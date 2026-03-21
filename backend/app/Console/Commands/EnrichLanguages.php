<?php

namespace App\Console\Commands;

use App\Models\Language;
use Illuminate\Console\Command;

class EnrichLanguages extends Command
{
    protected $signature = 'languages:enrich {--dir=storage/app/language-enrichments : Directory containing enrichment JSON files} {--lang= : Enrich a single language}';

    protected $description = 'Enrich language detail data (frameworks, tools, packages, links, tutorials) from JSON files';

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
            $this->warn('No JSON files found in ' . $dir);
            return self::FAILURE;
        }

        $enriched = 0;

        foreach ($files as $file) {
            if (!file_exists($file)) continue;

            $data = json_decode(file_get_contents($file), true);
            if (!$data || !isset($data['name'])) {
                $this->warn("Invalid: " . basename($file));
                continue;
            }

            $lang = Language::where('name', $data['name'])->first();
            if (!$lang) {
                $this->warn("Language not found: {$data['name']}");
                continue;
            }

            $updates = [];

            // Merge arrays (append new items, don't replace existing)
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

            // Merge links (add missing keys)
            if (!empty($data['links'])) {
                $existingLinks = $lang->links ?? [];
                $mergedLinks = array_merge($existingLinks, $data['links']);
                if ($mergedLinks !== $existingLinks) {
                    $updates['links'] = $mergedLinks;
                }
            }

            // Set package_manager if missing
            if (!empty($data['package_manager']) && empty($lang->package_manager)) {
                $updates['package_manager'] = $data['package_manager'];
            }

            if ($updates) {
                $lang->update($updates);
                $counts = [];
                foreach (['frameworks', 'tools', 'packages', 'tutorials'] as $f) {
                    if (isset($updates[$f])) $counts[] = count($updates[$f]) . " {$f}";
                }
                $this->info("  ✓ {$data['name']} — " . implode(', ', $counts ?: ['links updated']));
                $enriched++;
            }
        }

        $this->info("Done: {$enriched} language(s) enriched.");
        return $enriched > 0 ? self::SUCCESS : self::FAILURE;
    }
}
