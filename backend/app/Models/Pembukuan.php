<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Pembukuan extends Model
{
    protected $table = 'pembukuan';

    protected $fillable = [
        'user_id',
        'name',
        'month',
        'year',
        'status',
        'catatan',
    ];

    protected $casts = [
        'month' => 'integer',
        'year'  => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}