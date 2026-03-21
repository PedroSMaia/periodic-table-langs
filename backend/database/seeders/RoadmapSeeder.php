<?php

namespace Database\Seeders;

use App\Models\Roadmap;
use Illuminate\Database\Seeder;

class RoadmapSeeder extends Seeder
{
    public function run(): void
    {
        $dir = database_path('seeders/data/roadmaps');
        $files = glob("{$dir}/*.json");

        $this->command->info("Importing " . count($files) . " roadmaps...");

        foreach ($files as $file) {
            $data = json_decode(file_get_contents($file), true);

            if (!$data || !isset($data['core'])) continue;

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
        }

        $this->command->info("✓ " . Roadmap::count() . " roadmaps imported.");
    }
}
