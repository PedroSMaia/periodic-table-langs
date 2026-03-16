<?php

namespace App\Filament\Admin\Resources\Languages\RelationManagers;

use App\Jobs\GenerateRoadmapPathJob;
use App\Models\Roadmap;
use App\Models\RoadmapPath;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Notifications\Notification;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class RoadmapPathsRelationManager extends RelationManager
{
    protected static string $relationship = 'roadmapPaths';
    protected static ?string $title = 'Paths';

    public function form(Schema $schema): Schema
    {
        return $schema->components([]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('path_id')
            ->columns([
                TextColumn::make('path_id')
                    ->label('Path ID')
                    ->searchable()
                    ->fontFamily('mono')
                    ->size('sm'),

                TextColumn::make('label')
                    ->label('Path Name')
                    ->getStateUsing(fn ($record) => ($record->data['icon'] ?? '') . ' ' . ($record->data['label'] ?? $record->path_id))
                    ->searchable(query: fn ($query, $search) => $query->whereRaw(
                        "JSON_UNQUOTE(JSON_EXTRACT(data, '$.label')) LIKE ?", ["%{$search}%"]
                    )),

                TextColumn::make('category')
                    ->label('Category')
                    ->getStateUsing(fn ($record) => $record->data['category'] ?? '—')
                    ->badge()
                    ->color('gray'),

                TextColumn::make('status')
                    ->label('Status')
                    ->getStateUsing(fn ($record) => $record->data['status'] ?? 'unknown')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'ready'       => 'success',
                        'generating'  => 'warning',
                        'failed'      => 'danger',
                        'not_cached'  => 'gray',
                        default       => 'gray',
                    }),

                TextColumn::make('phases')
                    ->label('Phases')
                    ->getStateUsing(fn ($record) => ($record->data['status'] ?? '') === 'ready'
                        ? count($record->data['phases'] ?? [])
                        : '—')
                    ->alignCenter(),

                TextColumn::make('topics')
                    ->label('Topics')
                    ->getStateUsing(fn ($record) => ($record->data['status'] ?? '') === 'ready'
                        ? collect($record->data['phases'] ?? [])->sum(fn ($p) => count($p['topics'] ?? []))
                        : '—')
                    ->alignCenter(),

                TextColumn::make('generated_at')
                    ->label('Generated')
                    ->dateTime('d M Y H:i')
                    ->sortable(),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->label('Status')
                    ->options([
                        'ready'      => 'Ready',
                        'generating' => 'Generating',
                        'failed'     => 'Failed',
                        'not_cached' => 'Not Cached',
                    ])
                    ->query(fn ($query, $data) => $data['value']
                        ? $query->whereRaw("JSON_UNQUOTE(JSON_EXTRACT(data, '$.status')) = ?", [$data['value']])
                        : $query
                    ),

                SelectFilter::make('category')
                    ->label('Category')
                    ->options(function () {
                        $language = $this->getOwnerRecord()->name;
                        return RoadmapPath::where('language', $language)
                            ->get()
                            ->map(fn ($r) => $r->data['category'] ?? null)
                            ->filter()
                            ->unique()
                            ->sort()
                            ->mapWithKeys(fn ($c) => [$c => $c])
                            ->toArray();
                    })
                    ->query(fn ($query, $data) => $data['value']
                        ? $query->whereRaw("JSON_UNQUOTE(JSON_EXTRACT(data, '$.category')) = ?", [$data['value']])
                        : $query
                    ),
            ])
            ->headerActions([])
            ->recordActions([
                Action::make('generate')
                    ->label(fn ($record) => ($record->data['status'] ?? '') === 'not_cached' ? 'Generate' : 'Regenerate')
                    ->icon(fn ($record) => ($record->data['status'] ?? '') === 'not_cached' ? 'heroicon-o-play' : 'heroicon-o-arrow-path')
                    ->color(fn ($record) => ($record->data['status'] ?? '') === 'not_cached' ? 'success' : 'warning')
                    ->requiresConfirmation()
                    ->modalHeading(fn ($record) => ($record->data['status'] ?? '') === 'not_cached' ? 'Generate Path' : 'Regenerate Path')
                    ->modalDescription(fn ($record) => "Generate \"{$record->path_id}\" for " . $this->getOwnerRecord()->name . "? This may take a few minutes.")
                    ->modalSubmitActionLabel(fn ($record) => ($record->data['status'] ?? '') === 'not_cached' ? 'Yes, generate' : 'Yes, regenerate')
                    ->action(function ($record) {
                        $language = $this->getOwnerRecord()->name;
                        $roadmap  = Roadmap::where('language', $language)->first();

                        if (! $roadmap || ($roadmap->data['status'] ?? '') !== 'ready') {
                            Notification::make()->title('Roadmap not ready')->danger()->send();
                            return;
                        }

                        $pathStub = collect($roadmap->data['paths'] ?? [])->firstWhere('id', $record->path_id);
                        if (! $pathStub) {
                            Notification::make()->title('Path not found in roadmap')->danger()->send();
                            return;
                        }

                        $record->update([
                            'data'         => array_merge($record->data, ['status' => 'generating']),
                            'generated_at' => now(),
                        ]);

                        GenerateRoadmapPathJob::dispatch($language, $record->path_id, $pathStub);

                        Notification::make()
                            ->title('Queued')
                            ->body("Path \"{$record->path_id}\" is being generated.")
                            ->success()
                            ->send();
                    }),

                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort(fn ($query) => $query->orderByRaw("CASE JSON_UNQUOTE(JSON_EXTRACT(data, '$.status')) WHEN 'ready' THEN 0 WHEN 'generating' THEN 1 WHEN 'failed' THEN 2 ELSE 3 END")->orderBy('generated_at', 'desc'));
    }
}
