<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class FetchMetrics extends Command
{
    protected $signature = 'metrics:fetch';

    protected $description = 'Fetch TIOBE rankings and merge with Stack Overflow survey data into metrics.json';

    /**
     * Stack Overflow Developer Survey 2024 — "Admired and Desired" (loved %)
     * Source: https://survey.stackoverflow.co/2024/technology/admired-and-desired
     */
    private const SO_LOVED = [
        'Rust' => 83.0, 'Elixir' => 73.0, 'Clojure' => 68.0, 'Zig' => 73.0,
        'Scala' => 53.0, 'Go' => 62.0, 'Kotlin' => 61.0, 'TypeScript' => 70.5,
        'Swift' => 56.0, 'C#' => 62.0, 'Python' => 66.0, 'Haskell' => 60.0,
        'F#' => 59.0, 'Dart' => 52.0, 'JavaScript' => 58.0, 'Ruby' => 51.0,
        'Java' => 49.0, 'Erlang' => 47.0, 'SQL' => 55.0, 'HTML' => 55.0,
        'CSS' => 52.0, 'Lua' => 55.0, 'OCaml' => 56.0, 'C++' => 47.0,
        'C' => 44.0, 'PHP' => 42.0, 'R' => 42.0, 'Bash' => 52.0,
        'PowerShell' => 49.0, 'Assembly' => 38.0, 'MATLAB' => 37.0,
        'Perl' => 30.0, 'Objective-C' => 28.0, 'COBOL' => 23.0,
        'Fortran' => 29.0, 'Delphi' => 28.0, 'Visual Basic' => 24.0,
        'Prolog' => 40.0, 'Julia' => 55.0, 'Crystal' => 50.0,
        'Nim' => 52.0, 'Gleam' => 65.0,
    ];

    /**
     * Stack Overflow Developer Survey 2024 — "Most Popular Technologies" (used %)
     */
    private const SO_USED = [
        'JavaScript' => 62.3, 'HTML' => 52.9, 'CSS' => 50.7,
        'Python' => 51.0, 'SQL' => 51.5, 'TypeScript' => 38.5,
        'Bash' => 33.4, 'Java' => 30.3, 'C#' => 27.1, 'C++' => 23.0,
        'C' => 19.3, 'PHP' => 18.2, 'PowerShell' => 13.6, 'Go' => 13.5,
        'Rust' => 12.6, 'Kotlin' => 9.4, 'Ruby' => 6.2, 'Lua' => 6.2,
        'Dart' => 6.0, 'Assembly' => 5.4, 'Swift' => 4.7, 'R' => 4.5,
        'MATLAB' => 3.8, 'Elixir' => 2.5, 'Scala' => 2.6,
        'Perl' => 2.4, 'Haskell' => 2.1, 'Objective-C' => 2.0,
        'Delphi' => 1.7, 'Clojure' => 1.2, 'Julia' => 1.0,
        'Erlang' => 0.9, 'F#' => 0.9, 'Fortran' => 1.0,
        'COBOL' => 0.7, 'OCaml' => 0.6, 'Visual Basic' => 3.7,
        'Prolog' => 0.7, 'Ada' => 0.5, 'Zig' => 1.0, 'Nim' => 0.3,
    ];

    public function handle(): int
    {
        $this->info('Fetching TIOBE index…');

        $tiobe = $this->fetchTiobe();
        $tiobeCount = count($tiobe);
        $this->info("  → Got {$tiobeCount} TIOBE rankings.");

        $data = [
            'tiobe'    => $tiobe,
            'so_loved' => self::SO_LOVED,
            'so_used'  => self::SO_USED,
            'ratings'  => $this->buildRatings($tiobe),
            '_meta'    => [
                'updated_at'       => now()->toIso8601String(),
                'tiobe_source'     => 'tiobe.com (scraped)',
                'so_survey_source' => 'Stack Overflow Developer Survey 2024',
            ],
        ];

        file_put_contents(storage_path('app/metrics.json'), json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

        $this->info('metrics.json written to storage/app/metrics.json');

        return self::SUCCESS;
    }

    /**
     * Scrape the TIOBE index page for the top-N languages and their ranks.
     * Returns ['Language' => rank, …]
     */
    private function fetchTiobe(): array
    {
        try {
            $response = Http::timeout(15)
                ->withHeaders(['User-Agent' => 'Mozilla/5.0 (compatible; PTL-Bot/1.0)'])
                ->get('https://www.tiobe.com/tiobe-index/');

            if (!$response->successful()) {
                $this->warn("  TIOBE fetch failed (HTTP {$response->status()}), using fallback.");
                return $this->tiobeFallback();
            }

            $html = $response->body();
            $rankings = [];

            // TIOBE lists languages in a table with id "top20"
            if (preg_match('/<table[^>]*id=["\']top20["\'][^>]*>(.*?)<\/table>/si', $html, $tableMatch)) {
                preg_match_all('/<tr[^>]*>.*?<\/tr>/si', $tableMatch[1], $rows);
                $rank = 0;
                foreach ($rows[0] as $row) {
                    preg_match_all('/<td[^>]*>(.*?)<\/td>/si', $row, $cells);
                    if (count($cells[1]) >= 5) {
                        $rank++;
                        $name = trim(strip_tags($cells[1][4] ?? $cells[1][3] ?? ''));
                        if ($name) {
                            $rankings[$this->normalizeName($name)] = $rank;
                        }
                    }
                }
            }

            return !empty($rankings) ? $rankings : $this->tiobeFallback();
        } catch (\Exception $e) {
            $this->warn("  TIOBE scrape error: {$e->getMessage()}, using fallback.");
            return $this->tiobeFallback();
        }
    }

    /**
     * Fallback TIOBE rankings (March 2025 approximate).
     */
    private function tiobeFallback(): array
    {
        return [
            'Python' => 1, 'C++' => 2, 'Java' => 3, 'C' => 4, 'C#' => 5,
            'JavaScript' => 6, 'Go' => 7, 'SQL' => 8, 'Visual Basic' => 9,
            'Fortran' => 10, 'Delphi' => 11, 'PHP' => 12, 'Rust' => 13,
            'MATLAB' => 14, 'R' => 15, 'Ruby' => 16, 'Scratch' => 17,
            'Kotlin' => 18, 'COBOL' => 19, 'Swift' => 20,
            'Assembly' => 21, 'Dart' => 22, 'Lua' => 23, 'Scala' => 24,
            'Perl' => 25, 'TypeScript' => 26, 'Haskell' => 27,
            'Prolog' => 28, 'Bash' => 29, 'Objective-C' => 30,
        ];
    }

    /**
     * Normalize TIOBE language names to match our DB names.
     */
    private function normalizeName(string $name): string
    {
        $map = [
            'C/C++' => 'C++',
            'C (Objective)' => 'Objective-C',
            'Visual Basic' => 'Visual Basic',
            'Classic Visual Basic' => 'Visual Basic',
            'Delphi/Object Pascal' => 'Delphi',
            'MATLAB/Simulink' => 'MATLAB',
            'Assembly language' => 'Assembly',
            'Bourne shell' => 'Bash',
            'Bash/Shell/PowerShell' => 'Bash',
        ];

        return $map[$name] ?? $name;
    }

    /**
     * Build a simple 0-100 composite rating per language.
     */
    private function buildRatings(array $tiobe): array
    {
        $ratings = [];
        $allLangs = array_unique(array_merge(
            array_keys($tiobe),
            array_keys(self::SO_LOVED),
            array_keys(self::SO_USED),
        ));

        foreach ($allLangs as $lang) {
            $tiobeScore = 0;
            if (isset($tiobe[$lang])) {
                // Rank 1 → 100, rank 50 → 2
                $tiobeScore = max(0, 100 - ($tiobe[$lang] - 1) * 2);
            }

            $loved = self::SO_LOVED[$lang] ?? 0;
            $used  = self::SO_USED[$lang] ?? 0;

            // Weighted composite: 40% TIOBE, 30% loved, 30% used
            $composite = ($tiobeScore * 0.4) + ($loved * 0.3) + ($used * 0.3);

            if ($composite > 0) {
                $ratings[$lang] = round($composite, 1);
            }
        }

        arsort($ratings);

        return $ratings;
    }
}
