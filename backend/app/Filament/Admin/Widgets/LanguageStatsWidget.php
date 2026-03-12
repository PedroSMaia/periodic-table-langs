<?php

namespace App\Filament\Admin\Widgets;

use App\Models\Language;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class LanguageStatsWidget extends BaseWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        $oldest     = Language::orderBy('year')->first();
        $newest     = Language::orderBy('year', 'desc')->first();
        $totalCats  = Language::distinct('cat')->count('cat');

        return [
            Stat::make('Total Languages', Language::count())
                ->description('In the database')
                ->icon('heroicon-o-code-bracket')
                ->color('primary'),

            Stat::make('Categories', $totalCats)
                ->description('Distinct language families')
                ->icon('heroicon-o-squares-2x2')
                ->color('success'),

            Stat::make('Oldest Language', $oldest?->year ?? '—')
                ->description($oldest?->name ?? '')
                ->icon('heroicon-o-clock')
                ->color('warning'),

            Stat::make('Newest Language', $newest?->year ?? '—')
                ->description($newest?->name ?? '')
                ->icon('heroicon-o-rocket-launch')
                ->color('info'),
        ];
    }
}
