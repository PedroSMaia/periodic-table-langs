<?php

namespace App\Filament\Admin\Resources\Languages\Schemas;

use App\Jobs\GenerateRoadmapJob;
use App\Models\Roadmap;
use App\Models\RoadmapPath;
use Filament\Actions\Action;
use Filament\Infolists\Components\RepeatableEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Notifications\Notification;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Schema;

class LanguageInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(1)
            ->components([
                // ── Identity ──────────────────────────────────────────────
                Section::make('Identity')
                    ->columns(4)
                    ->schema([
                        TextEntry::make('sym')
                            ->label('Symbol')
                            ->badge()
                            ->color('warning')
                            ->fontFamily('mono'),

                        TextEntry::make('name')
                            ->label('Name')
                            ->weight('bold'),

                        TextEntry::make('cat')
                            ->label('Category')
                            ->badge()
                            ->color(fn (string $state): string => match ($state) {
                                'systems'    => 'danger',
                                'scripting'  => 'warning',
                                'oop'        => 'info',
                                'functional' => 'success',
                                'web'        => 'primary',
                                'scientific' => 'gray',
                                'esoteric'   => 'danger',
                                'logic'      => 'info',
                                'general'    => 'warning',
                                'hardware'   => 'gray',
                                default      => 'gray',
                            }),

                        TextEntry::make('year')
                            ->label('Year'),

                        TextEntry::make('paradigm')
                            ->label('Paradigm')
                            ->columnSpanFull(),

                        TextEntry::make('desc')
                            ->label('Description')
                            ->columnSpanFull(),
                    ]),

                // ── Tabs ───────────────────────────────────────────────────
                Tabs::make('Details')
                    ->tabs([

                        Tab::make('Links')
                            ->schema([
                                TextEntry::make('links')
                                    ->label('')
                                    ->html()
                                    ->columnSpanFull()
                                    ->getStateUsing(function ($record): string {
                                        $links = $record?->links;
                                        if (empty($links) || !is_array($links)) {
                                            return '<em style="color:#6b7280">No links</em>';
                                        }
                                        $items = array_map(
                                            fn ($k, $v) => sprintf(
                                                '<a href="%s" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:6px;padding:6px 14px;margin:4px;border-radius:8px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);color:#93c5fd;text-decoration:none;font-size:0.82rem;font-family:monospace">%s ↗</a>',
                                                htmlspecialchars($v),
                                                htmlspecialchars(ucfirst($k))
                                            ),
                                            array_keys($links),
                                            array_values($links)
                                        );
                                        return '<div style="display:flex;flex-wrap:wrap;gap:2px;padding:4px 0">'
                                            . implode('', $items)
                                            . '</div>';
                                    }),
                            ]),

                        Tab::make('Tutorials')
                            ->schema([
                                RepeatableEntry::make('tutorials')
                                    ->label('')
                                    ->schema([
                                        TextEntry::make('name')->label('Name'),
                                        TextEntry::make('url')
                                            ->label('URL')
                                            ->html()
                                            ->formatStateUsing(fn ($state) => $state
                                                ? "<a href=\"{$state}\" target=\"_blank\" style=\"color:#93c5fd\">{$state}</a>"
                                                : '—'),
                                    ])
                                    ->columns(2),
                            ]),

                        Tab::make('Frameworks')
                            ->schema([
                                RepeatableEntry::make('frameworks')
                                    ->label('')
                                    ->schema([
                                        TextEntry::make('name')->label('Name'),
                                        TextEntry::make('desc')->label('Description'),
                                        TextEntry::make('url')
                                            ->label('URL')
                                            ->html()
                                            ->formatStateUsing(fn ($state) => $state
                                                ? "<a href=\"{$state}\" target=\"_blank\" style=\"color:#93c5fd\">{$state}</a>"
                                                : '—'),
                                    ])
                                    ->columns(3),
                            ]),

                        Tab::make('Tools')
                            ->schema([
                                RepeatableEntry::make('tools')
                                    ->label('')
                                    ->schema([
                                        TextEntry::make('name')->label('Name'),
                                        TextEntry::make('desc')->label('Description'),
                                        TextEntry::make('url')
                                            ->label('URL')
                                            ->html()
                                            ->formatStateUsing(fn ($state) => $state
                                                ? "<a href=\"{$state}\" target=\"_blank\" style=\"color:#93c5fd\">{$state}</a>"
                                                : '—'),
                                    ])
                                    ->columns(3),
                            ]),

                        Tab::make('Packages')
                            ->schema([
                                RepeatableEntry::make('packages')
                                    ->label('')
                                    ->schema([
                                        TextEntry::make('name')->label('Name'),
                                        TextEntry::make('desc')->label('Description'),
                                        TextEntry::make('url')
                                            ->label('URL')
                                            ->html()
                                            ->formatStateUsing(fn ($state) => $state
                                                ? "<a href=\"{$state}\" target=\"_blank\" style=\"color:#93c5fd\">{$state}</a>"
                                                : '—'),
                                    ])
                                    ->columns(3),
                            ]),

                        Tab::make('Package Manager')
                            ->schema([
                                TextEntry::make('package_manager')
                                    ->label('')
                                    ->html()
                                    ->columnSpanFull()
                                    ->getStateUsing(function ($record): string {
                                        $pm = $record?->package_manager;
                                        if (empty($pm)) {
                                            return '<em style="color:#6b7280">None</em>';
                                        }
                                        $item = is_array($pm) && isset($pm[0]) ? $pm[0] : $pm;
                                        $name = is_array($item) ? ($item['name'] ?? '—') : (string) $item;
                                        $url  = is_array($item) ? ($item['url']  ?? null) : null;
                                        return $url
                                            ? "<a href=\"{$url}\" target=\"_blank\" style=\"color:#93c5fd;font-weight:600;font-size:1rem\">{$name} ↗</a>"
                                            : "<span style=\"font-weight:600;font-size:1rem\">{$name}</span>";
                                    }),
                            ]),

                    ]),

                    // ── Roadmap ────────────────────────────────────────────────
                Section::make('Roadmap')
                    ->columns(2)
                    ->headerActions([
                        Action::make('regenerate_roadmap')
                            ->label(fn ($record) => Roadmap::where('language', $record->name)->exists()
                                ? '✦ Regenerate Roadmap'
                                : '✦ Generate Roadmap'
                            )
                            ->icon('heroicon-o-map')
                            ->color('warning')
                            ->requiresConfirmation()
                            ->modalHeading('Regenerate Roadmap')
                            ->modalDescription(fn ($record) => 'This will delete the existing roadmap and paths for ' . $record->name . ' and queue a fresh generation. Continue?')
                            ->modalSubmitActionLabel('Yes, regenerate')
                            ->action(function ($record) {
                                $language = $record->name;

                                Roadmap::where('language', $language)->delete();
                                RoadmapPath::where('language', $language)->delete();

                                GenerateRoadmapJob::dispatch($language);

                                Notification::make()
                                    ->title('Roadmap generation queued')
                                    ->body("Roadmap for {$language} is being generated. This may take a few minutes.")
                                    ->success()
                                    ->send();
                            }),
                    ])
                    ->schema([
                        TextEntry::make('roadmap_status')
                            ->label('Status')
                            ->html()
                            ->getStateUsing(function ($record): string {
                                $roadmap = Roadmap::where('language', $record->name)->first();
                                if (! $roadmap) {
                                    return '<span style="color:#6b7280;font-size:0.85rem">Not generated</span>';
                                }
                                $status = $roadmap->data['status'] ?? 'unknown';
                                $color  = match ($status) {
                                    'ready'      => '#4ade80',
                                    'generating' => '#fbbf24',
                                    'failed'     => '#f87171',
                                    default      => '#6b7280',
                                };
                                $label = ucfirst($status);
                                $date  = $roadmap->generated_at?->format('d M Y H:i') ?? '—';
                                return "<span style=\"color:{$color};font-weight:600\">{$label}</span> <span style=\"color:#6b7280;font-size:0.75rem\">· generated {$date}</span>";
                            }),

                        TextEntry::make('roadmap_stats')
                            ->label('Stats')
                            ->html()
                            ->getStateUsing(function ($record): string {
                                $roadmap = Roadmap::where('language', $record->name)->first();
                                if (! $roadmap || ($roadmap->data['status'] ?? '') !== 'ready') {
                                    return '<span style="color:#6b7280;font-size:0.85rem">—</span>';
                                }
                                $phases = count($roadmap->data['core'] ?? []);
                                $topics = collect($roadmap->data['core'] ?? [])->sum(fn ($p) => count($p['topics'] ?? []));
                                $paths  = count($roadmap->data['paths'] ?? []);
                                return "<span style=\"color:#e5e7eb;font-size:0.85rem\">{$phases} core phases · {$topics} topics · {$paths} paths available</span>";
                            }),
                    ]),
            ]);
    }
}
