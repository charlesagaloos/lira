<?php

namespace Tests\Feature;

use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PortfolioDemoTest extends TestCase
{
    public function test_guest_can_open_the_interactive_portfolio_demo(): void
    {
        $this->get(route('portfolio.demo'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Portfolio/Demo')
                ->where('sampleImage', asset('images/auth/artist_with_guitar.png')));
    }
}
