<?php

namespace App\Console\Commands;

use App\Models\RoadmapPath;
use Illuminate\Console\Command;

class ImportRoadmapPaths extends Command
{
    protected $signature = 'roadmap:import-paths {--dir=storage/app/roadmap-paths : Directory containing path JSON files} {--lang= : Import paths for a single language}';

    protected $description = 'Import roadmap path detail JSON files into the database';

    public function handle(): int
    {
        $dir = base_path($this->option('dir'));
        $singleLang = $this->option('lang');

        if ($singleLang) {
            $files = glob("{$dir}/{$singleLang}--*.json");
        } else {
            $files = glob("{$dir}/*.json");
        }

        if (empty($files)) {
            $this->warn('No path JSON files found in ' . $dir);
            return self::FAILURE;
        }

        $imported = 0;

        foreach ($files as $file) {
            $data = json_decode(file_get_contents($file), true);

            if (!$data || !isset($data['language']) || !isset($data['path_id'])) {
                $this->warn("Invalid: " . basename($file));
                continue;
            }

            RoadmapPath::updateOrCreate(
                ['language' => $data['language'], 'path_id' => $data['path_id']],
                [
                    'data' => array_merge(['status' => 'ready'], $data),
                    'generated_at' => now(),
                ]
            );

            $phases = count($data['phases'] ?? []);
            $this->info("  ✓ {$data['language']} / {$data['label']} — {$phases} phases");
            $imported++;
        }

        $this->info("Done: {$imported} path(s) imported.");
        return $imported > 0 ? self::SUCCESS : self::FAILURE;
    }
}
