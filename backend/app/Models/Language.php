<?php

namespace App\Models;

use App\Models\RoadmapPath;
use Illuminate\Database\Eloquent\Model;

class Language extends Model
{
    protected $fillable = [
        'sym',
        'name',
        'cat',
        'year',
        'paradigm',
        'desc',
        'links',
        'tutorials',
        'frameworks',
        'tools',
        'packages',
        'package_manager',
    ];

    protected $casts = [
        'links'           => 'array',
        'tutorials'       => 'array',
        'frameworks'      => 'array',
        'tools'           => 'array',
        'packages'        => 'array',
        'package_manager' => 'array',
    ];

    /**
     * Normalise package_manager before saving.
     * The seeder stores it as {name, url}.
     * The Filament KeyValue stores it as {name: "...", url: "..."}.
     * Both formats are valid arrays — this accessor ensures a consistent
     * {name, url} shape when reading, regardless of how it was saved.
     */
    public function roadmapPaths(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(RoadmapPath::class, 'language', 'name');
    }

    public function getPackageManagerAttribute(mixed $value): ?array
    {
        $decoded = is_string($value) ? json_decode($value, true) : $value;

        if (empty($decoded)) return null;

        // Already a flat {name, url} object
        if (isset($decoded['name'])) return $decoded;

        // Came from a Repeater as [{name, url}] — unwrap first item
        if (isset($decoded[0]) && is_array($decoded[0])) return $decoded[0];

        return $decoded;
    }
}
