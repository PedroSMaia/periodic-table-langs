<?php

namespace Database\Seeders;

use App\Models\Language;
use Illuminate\Database\Seeder;

class LanguageEnrichmentSeeder extends Seeder
{
    public function run(): void
    {
        $dir = database_path('seeders/data/language-enrichments');
        $files = glob("{$dir}/*.json");

        $this->command->info("Enriching " . count($files) . " languages...");

        $enriched = 0;

        foreach ($files as $file) {
            $data = json_decode(file_get_contents($file), true);
            if (!$data || !isset($data['name'])) continue;

            $lang = Language::where('name', $data['name'])->first();
            if (!$lang) continue;

            $updates = [];

            foreach (['frameworks', 'tools', 'packages', 'tutorials'] as $field) {
                if (!empty($data[$field])) {
                    $existing = $lang->$field ?? [];
                    $existingNames = array_map(fn($i) => $i['name'] ?? '', $existing);
                    $new = array_filter($data[$field], fn($i) => !in_array($i['name'] ?? '', $existingNames));
                    if ($new) {
                        $updates[$field] = array_merge($existing, array_values($new));
                    }
                }
            }

            if (!empty($data['links'])) {
                $existingLinks = $lang->links ?? [];
                $mergedLinks = array_merge($existingLinks, $data['links']);
                if ($mergedLinks !== $existingLinks) {
                    $updates['links'] = $mergedLinks;
                }
            }

            if (!empty($data['package_manager']) && empty($lang->package_manager)) {
                $updates['package_manager'] = $data['package_manager'];
            }

            if ($updates) {
                $lang->update($updates);
                $enriched++;
            }
        }

        $this->command->info("✓ {$enriched} languages enriched.");
    }
}
