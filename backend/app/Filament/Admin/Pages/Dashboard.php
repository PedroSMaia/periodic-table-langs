<?php

namespace App\Filament\Admin\Pages;

use App\Filament\Admin\Widgets\GithubIssuesWidget;
use App\Filament\Admin\Widgets\LanguagesByCategoryChart;
use App\Filament\Admin\Widgets\LanguageStatsWidget;
use Filament\Pages\Dashboard as BaseDashboard;

class Dashboard extends BaseDashboard
{
    public function getWidgets(): array
    {
        return [
            LanguageStatsWidget::class,
            LanguagesByCategoryChart::class,
            GithubIssuesWidget::class,
        ];
    }

    public function getColumns(): int | array
    {
        return 2;
    }
}
