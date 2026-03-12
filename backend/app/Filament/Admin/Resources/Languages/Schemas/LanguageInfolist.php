<?php

namespace App\Filament\Admin\Resources\Languages\Schemas;

use Filament\Infolists\Components\RepeatableEntry;
use Filament\Infolists\Components\TextEntry;
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
            ]);
    }
}
