<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class PortfolioDemoController extends Controller
{
    public function show(): Response
    {
        return Inertia::render('Portfolio/Demo', [
            'sampleImage' => asset('images/auth/artist_with_guitar.png'),
        ]);
    }
}
