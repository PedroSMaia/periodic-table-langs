<?php

namespace Database\Seeders;

use App\Models\RoadmapPath;
use Illuminate\Database\Seeder;

class RoadmapPathSeeder extends Seeder
{
    public function run(): void
    {
        $dir = database_path('seeders/data/roadmap-paths');
        $files = glob("{$dir}/*.json");

        $this->command->info("Importing " . count($files) . " path details...");

        foreach ($files as $file) {
            $data = json_decode(file_get_contents($file), true);

            if (!$data || !isset($data['language']) || !isset($data['path_id'])) continue;

            RoadmapPath::updateOrCreate(
                ['language' => $data['language'], 'path_id' => $data['path_id']],
                [
                    'data' => array_merge(['status' => 'ready'], $data),
                    'generated_at' => now(),
                ]
            );
        }

        $this->command->info("✓ " . RoadmapPath::count() . " paths imported.");
    }
}
