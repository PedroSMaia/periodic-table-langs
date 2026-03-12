<?php

namespace App\Filament\Admin\Widgets;

use App\Models\Language;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Facades\DB;

class LanguagesByCategoryChart extends ChartWidget
{
    protected ?string $heading = 'Languages by Category';
    protected static ?int $sort = 2;
    protected int | string | array $columnSpan = 'full';
    protected ?string $maxHeight = '400px';

    protected function getData(): array
    {
        $categories = [
            'systems'    => ['label' => 'Systems',         'color' => '#60a5fa'],
            'scripting'  => ['label' => 'Scripting',       'color' => '#34d399'],
            'oop'        => ['label' => 'Object-Oriented', 'color' => '#a78bfa'],
            'functional' => ['label' => 'Functional',      'color' => '#f472b6'],
            'web'        => ['label' => 'Query / Web',     'color' => '#38bdf8'],
            'scientific' => ['label' => 'Scientific',      'color' => '#fb923c'],
            'esoteric'   => ['label' => 'Esoteric',        'color' => '#e879f9'],
            'logic'      => ['label' => 'Logic',           'color' => '#facc15'],
            'general'    => ['label' => 'General-Purpose', 'color' => '#94a3b8'],
            'hardware'   => ['label' => 'Hardware',        'color' => '#f87171'],
        ];

        $counts = Language::select('cat', DB::raw('count(*) as total'))
            ->groupBy('cat')
            ->pluck('total', 'cat')
            ->toArray();

        $labels = [];
        $data   = [];
        $colors = [];

        foreach ($categories as $key => $meta) {
            $labels[] = $meta['label'];
            $data[]   = $counts[$key] ?? 0;
            $colors[] = $meta['color'];
        }

        return [
            'datasets' => [
                [
                    'label'           => 'Languages',
                    'data'            => $data,
                    'backgroundColor' => $colors,
                    'borderRadius'    => 4,
                ],
            ],
            'labels' => $labels,
        ];
    }

    protected function getType(): string
    {
        return 'bar';
    }
}
