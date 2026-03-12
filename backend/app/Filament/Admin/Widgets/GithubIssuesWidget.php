<?php

namespace App\Filament\Admin\Widgets;

use Filament\Widgets\Widget;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class GithubIssuesWidget extends Widget
{
    protected string $view = 'filament.widgets.github-issues';
    protected static ?int $sort = 3;
    protected int | string | array $columnSpan = 'full';

    public function getViewData(): array
    {
        $token = config('services.github.token');
        $repo  = config('services.github.repo');

        if (!$token || !$repo) {
            return ['issues' => [], 'count' => 0, 'error' => 'GITHUB_TOKEN or GITHUB_REPO not set in .env'];
        }

        $issues = Cache::remember('github_open_issues', 300, function () use ($token, $repo) {
            $response = Http::withToken($token)
                ->get("https://api.github.com/repos/{$repo}/issues", [
                    'state'    => 'open',
                    'per_page' => 10,
                ]);

            return $response->successful() ? $response->json() : null;
        });

        if ($issues === null) {
            return ['issues' => [], 'count' => 0, 'error' => 'Failed to fetch issues from GitHub.'];
        }

        return [
            'issues' => $issues,
            'count'  => count($issues),
            'error'  => null,
        ];
    }
}
