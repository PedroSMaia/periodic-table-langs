<?php

namespace App\Console\Commands;

use App\Models\Roadmap;
use Illuminate\Console\Command;

class ImportRoadmaps extends Command
{
    protected $signature = 'roadmap:import {--dir=storage/app/roadmaps : Directory containing JSON files} {--lang= : Import a single language file}';

    protected $description = 'Import roadmap JSON files into the database';

    public function handle(): int
    {
        $dir = base_path($this->option('dir'));
        $singleLang = $this->option('lang');

        if ($singleLang) {
            $files = ["{$dir}/{$singleLang}.json"];
        } else {
            $files = glob("{$dir}/*.json");
        }

        if (empty($files)) {
            $this->warn('No JSON files found.');
            return self::FAILURE;
        }

        $imported = 0;
        $failed = 0;

        foreach ($files as $file) {
            if (!file_exists($file)) {
                $this->warn("File not found: {$file}");
                $failed++;
                continue;
            }

            $data = json_decode(file_get_contents($file), true);

            if (!$data || !isset($data['core'])) {
                $this->warn("Invalid JSON in: " . basename($file));
                $failed++;
                continue;
            }

            $language = $data['language'] ?? pathinfo($file, PATHINFO_FILENAME);

            Roadmap::updateOrCreate(
                ['language' => $language],
                [
                    'data' => [
                        'status' => 'ready',
                        'core'   => $data['core'],
                        'paths'  => $data['paths'] ?? [],
                    ],
                    'generated_at' => now(),
                ]
            );

            $phases = count($data['core']);
            $paths = count($data['paths'] ?? []);
            $this->info("  ✓ {$language} — {$phases} phases, {$paths} paths");
            $imported++;
        }

        $this->info("Done: {$imported} imported, {$failed} failed.");

        return $imported > 0 ? self::SUCCESS : self::FAILURE;
    }
}
