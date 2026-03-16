<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RoadmapPath extends Model
{
    protected $fillable = ['language', 'path_id', 'data', 'generated_at'];
    protected $casts    = ['data' => 'array', 'generated_at' => 'datetime'];
}
