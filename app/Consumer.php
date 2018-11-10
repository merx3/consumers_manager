<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Consumer extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'consumer';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'age', 'city',
    ];
}
