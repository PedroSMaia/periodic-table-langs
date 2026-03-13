<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Roadmap extends Model
{
    protected $fillable = [
        'language',
        'data',
        'generated_at',
    ];

    protected $casts = [
        'data'         => 'array',
        'generated_at' => 'datetime',
    ];
}
