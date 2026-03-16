<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminApiKey
{
    public function handle(Request $request, Closure $next)
    {
        $key = config('app.admin_api_key');

        if (! $key || $request->header('X-Admin-Key') !== $key) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return $next($request);
    }
}
