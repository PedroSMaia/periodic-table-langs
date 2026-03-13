<?php

namespace App\Filament\Admin\Widgets;

use App\Jobs\GenerateRoadmapPathJob;
use App\Models\Roadmap;
use App\Models\RoadmapPath;
use Filament\Actions\Action;
use Filament\Notifications\Notification;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Enums\PaginationMode;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class AllRoadmapPathsWidget extends TableWidget
{
    protected static bool $isDiscovered = false;
    protected int | string | array $columnSpan = 'full';

    public $record = null;

    protected function buildPathRecords(): Collection
    {
        if (! $this->record) {
            return collect();
        }

        $language = $this->record->name;
        $roadmap  = Roadmap::where('language', $language)->first();

        if (! $roadmap || ($roadmap->data['status'] ?? '') !== 'ready') {
            return collect();
        }

        $cached = RoadmapPath::where('language', $language)->get()->keyBy('path_id');

        return collect($roadmap->data['paths'] ?? [])->mapWithKeys(function ($stub) use ($cached) {
            $id     = $stub['id'] ?? '';
            $record = $cached->get($id);
            $status = $record ? ($record->data['status'] ?? 'unknown') : 'not_cached';

            return [$id => [
                'id'            => $id,
                'label'         => $stub['label'] ?? $id,
                'icon'          => $stub['icon'] ?? '',
                'category'      => $stub['category'] ?? '—',
                'category_icon' => $stub['category_icon'] ?? '',
                'status'        => $status,
                'phases'        => $record && $status === 'ready' ? count($record->data['phases'] ?? []) : null,
                'topics'        => $record && $status === 'ready'
                    ? collect($record->data['phases'] ?? [])->sum(fn ($p) => count($p['topics'] ?? []))
                    : null,
                'generated_at'  => $record?->generated_at?->format('d M Y H:i'),
            ]];
        });
    }

    public function table(Table $table): Table
    {
        return $table
            ->heading('🗺️ Roadmap Paths')
            ->records(function (?string $search, ?string $sortColumn, ?string $sortDirection, int $page, int $recordsPerPage, ?array $filters): LengthAwarePaginator {
                $all = $this->buildPathRecords();

                if (filled($search)) {
                    $q = strtolower($search);
                    $all = $all->filter(fn ($p) =>
                        str_contains(strtolower($p['label']), $q) ||
                        str_contains(strtolower($p['id']), $q)
                    );
                }

                $statusFilter   = $filters['status']['value']   ?? null;
                $categoryFilter = $filters['category']['value'] ?? null;

                if (filled($statusFilter)) {
                    $all = $all->where('status', $statusFilter);
                }
                if (filled($categoryFilter)) {
                    $all = $all->where('category', $categoryFilter);
                }

                if (filled($sortColumn)) {
                    $all = $all->sortBy($sortColumn, SORT_REGULAR, $sortDirection === 'desc');
                }

                $total = $all->count();

                return new LengthAwarePaginator(
                    items:       $all->slice(($page - 1) * $recordsPerPage, $recordsPerPage)->values(),
                    total:       $total,
                    perPage:     $recordsPerPage,
                    currentPage: $page,
                );
            })
            ->paginationMode(PaginationMode::Simple)
            ->defaultPaginationPageOption(20)
            ->searchable()
            ->columns([
                TextColumn::make('label')
                    ->label('Path')
                    ->formatStateUsing(fn ($state, $record) =>
                        ($record['icon'] ? $record['icon'] . ' ' : '') . $state
                    )
                    ->description(fn ($record) => $record['id'])
                    ->weight('medium')
                    ->searchable(false),

                TextColumn::make('category')
                    ->label('Category')
                    ->formatStateUsing(fn ($state, $record) =>
                        ($record['category_icon'] ? $record['category_icon'] . ' ' : '') . $state
                    )
                    ->color('gray')
                    ->size('sm'),

                TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'ready'      => 'success',
                        'generating' => 'warning',
                        'failed'     => 'danger',
                        default      => 'gray',
                    }),

                TextColumn::make('phases')
                    ->label('Phases')
                    ->alignCenter()
                    ->placeholder('—')
                    ->fontFamily('mono')
                    ->size('sm'),

                TextColumn::make('topics')
                    ->label('Topics')
                    ->alignCenter()
                    ->placeholder('—')
                    ->fontFamily('mono')
                    ->size('sm'),

                TextColumn::make('generated_at')
                    ->label('Generated')
                    ->placeholder('—')
                    ->size('sm')
                    ->color('gray'),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->options([
                        'ready'      => 'Ready',
                        'generating' => 'Generating',
                        'not_cached' => 'Not Cached',
                        'failed'     => 'Failed',
                    ]),

                SelectFilter::make('category')
                    ->options(fn () => $this->buildPathRecords()
                        ->pluck('category', 'category')
                        ->sort()
                        ->toArray()
                    ),
            ])
            ->recordActions([
                Action::make('generate')
                    ->label(fn ($record) => $record['status'] === 'ready' ? 'Regenerate' : 'Generate')
                    ->icon(fn ($record) => $record['status'] === 'ready' ? 'heroicon-o-arrow-path' : 'heroicon-o-play')
                    ->color(fn ($record) => $record['status'] === 'ready' ? 'warning' : 'success')
                    ->size('xs')
                    ->hidden(fn ($record) => $record['status'] === 'generating')
                    ->requiresConfirmation()
                    ->modalHeading(fn ($record) => ($record['status'] === 'ready' ? 'Regenerate' : 'Generate') . ' Path')
                    ->modalDescription(fn ($record) => "Generate \"{$record['label']}\"? This may take a few minutes.")
                    ->action(fn ($record) => $this->generate($record['id'])),
            ])
            ->headerActions([
                Action::make('generate_all')
                    ->label('Generate All Missing')
                    ->icon('heroicon-o-play')
                    ->color('success')
                    ->requiresConfirmation()
                    ->modalHeading('Generate All Missing Paths')
                    ->modalDescription('Queue generation for all paths not yet generated. Continue?')
                    ->action(fn () => $this->generateAll())
                    ->visible(fn () => $this->buildPathRecords()->contains('status', '!=', 'ready')),
            ])
            ->emptyStateHeading('No paths')
            ->emptyStateDescription('No roadmap generated yet, or this roadmap has no paths defined.')
            ->emptyStateIcon('heroicon-o-map')
            ->striped()
            ->poll('15s');
    }

    public function generate(string $pathId): void
    {
        if (! $this->record) return;

        $language = $this->record->name;
        $roadmap  = Roadmap::where('language', $language)->first();

        if (! $roadmap || ($roadmap->data['status'] ?? '') !== 'ready') {
            Notification::make()->title('Roadmap not ready')->danger()->send();
            return;
        }

        $pathStub = collect($roadmap->data['paths'] ?? [])->firstWhere('id', $pathId);
        if (! $pathStub) {
            Notification::make()->title('Path not found')->danger()->send();
            return;
        }

        RoadmapPath::updateOrCreate(
            ['language' => $language, 'path_id' => $pathId],
            ['data' => ['status' => 'generating'], 'generated_at' => now()]
        );

        GenerateRoadmapPathJob::dispatch($language, $pathId, $pathStub);

        Notification::make()->title('Queued')->body("Path \"{$pathStub['label']}\" is being generated.")->success()->send();
    }

    public function generateAll(): void
    {
        if (! $this->record) return;

        $language = $this->record->name;
        $roadmap  = Roadmap::where('language', $language)->first();

        if (! $roadmap || ($roadmap->data['status'] ?? '') !== 'ready') {
            Notification::make()->title('Roadmap not ready')->danger()->send();
            return;
        }

        $cachedPathIds = RoadmapPath::where('language', $language)
            ->whereRaw("JSON_UNQUOTE(JSON_EXTRACT(data, '$.status')) = 'ready'")
            ->pluck('path_id')->flip()->toArray();

        $queued = 0;
        foreach ($roadmap->data['paths'] ?? [] as $stub) {
            $id = $stub['id'] ?? null;
            if (! $id || array_key_exists($id, $cachedPathIds)) continue;
            RoadmapPath::updateOrCreate(
                ['language' => $language, 'path_id' => $id],
                ['data' => ['status' => 'generating'], 'generated_at' => now()]
            );
            GenerateRoadmapPathJob::dispatch($language, $id, $stub);
            $queued++;
        }

        $queued === 0
            ? Notification::make()->title('Nothing to generate')->body('All paths are already generated.')->info()->send()
            : Notification::make()->title('Queued')->body("{$queued} path(s) queued.")->success()->send();
    }
}
