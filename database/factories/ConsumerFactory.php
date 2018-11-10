<?php

use Faker\Generator as Faker;

$factory->define(App\Consumer::class, function (Faker $faker) {
    return [
        'name' => $faker->name,
        'age' => $faker->numberBetween(14, 99),
        'city' => $faker->randomElement(explode(',', env('CONSUMER_CITIES')))
    ];
});
