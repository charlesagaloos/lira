<?php

namespace Tests\Unit;

use App\Services\ImageModerationService;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class ImageModerationServiceTest extends TestCase
{
    public function test_moderation_fails_closed_when_credentials_are_missing(): void
    {
        config([
            'services.sightengine.user' => null,
            'services.sightengine.secret' => null,
        ]);

        Http::preventStrayRequests();

        $result = app(ImageModerationService::class)->check(
            UploadedFile::fake()->image('safe.jpg')
        );

        $this->assertFalse($result['allowed']);
        $this->assertSame(
            'Image moderation is not configured.',
            $result['message']
        );

        Http::assertNothingSent();
    }

    public function test_moderation_fails_closed_when_api_returns_http_error(): void
    {
        config([
            'services.sightengine.user' => 'test-user',
            'services.sightengine.secret' => 'test-secret',
        ]);

        Http::fake([
            'api.sightengine.com/*' => Http::response([], 500),
        ]);

        $result = app(ImageModerationService::class)->check(
            UploadedFile::fake()->image('safe.jpg')
        );

        $this->assertFalse($result['allowed']);
        $this->assertSame(
            'Unable to verify the image. Please try again.',
            $result['message']
        );

        Http::assertSentCount(1);
    }

    public function test_moderation_fails_closed_when_api_reports_failure(): void
    {
        config([
            'services.sightengine.user' => 'test-user',
            'services.sightengine.secret' => 'test-secret',
        ]);

        Http::fake([
            'api.sightengine.com/*' => Http::response([
                'status' => 'failure',
                'error' => [
                    'message' => 'Invalid credentials',
                ],
            ], 200),
        ]);

        $result = app(ImageModerationService::class)->check(
            UploadedFile::fake()->image('safe.jpg')
        );

        $this->assertFalse($result['allowed']);
        $this->assertSame(
            'Unable to verify the image. Please try again.',
            $result['message']
        );
    }

    public function test_moderation_rejects_explicit_sexual_content(): void
    {
        config([
            'services.sightengine.user' => 'test-user',
            'services.sightengine.secret' => 'test-secret',
        ]);

        Http::fake([
            'api.sightengine.com/*' => Http::response([
                'status' => 'success',
                'nudity' => [
                    'sexual_activity' => 0.80,
                    'sexual_display' => 0.10,
                    'erotica' => 0.10,
                    'suggestive_classes' => [],
                ],
            ], 200),
        ]);

        $result = app(ImageModerationService::class)->check(
            UploadedFile::fake()->image('explicit.jpg')
        );

        $this->assertFalse($result['allowed']);
        $this->assertSame(
            'This image contains explicit or inappropriate content and cannot be uploaded.',
            $result['message']
        );
    }

    public function test_moderation_allows_an_image_below_rejection_thresholds(): void
    {
        config([
            'services.sightengine.user' => 'test-user',
            'services.sightengine.secret' => 'test-secret',
        ]);

        Http::fake([
            'api.sightengine.com/*' => Http::response([
                'status' => 'success',
                'nudity' => [
                    'sexual_activity' => 0.01,
                    'sexual_display' => 0.01,
                    'erotica' => 0.01,
                    'suggestive_classes' => [
                        'suggestive_pose' => 0.10,
                        'suggestive_focus' => 0.10,
                        'lingerie' => 0.10,
                        'male_underwear' => 0.10,
                    ],
                ],
            ], 200),
        ]);

        $result = app(ImageModerationService::class)->check(
            UploadedFile::fake()->image('safe.jpg')
        );

        $this->assertTrue($result['allowed']);
        $this->assertNull($result['message']);
    }

    public function test_moderation_fails_closed_when_api_connection_fails(): void
    {
        config([
            'services.sightengine.user' => 'test-user',
            'services.sightengine.secret' => 'test-secret',
        ]);

        Http::fake(function () {
            throw new ConnectionException('Connection timed out.');
        });

        $result = app(ImageModerationService::class)->check(
            UploadedFile::fake()->image('safe.jpg')
        );

        $this->assertFalse($result['allowed']);
        $this->assertSame(
            'Unable to verify the image. Please try again.',
            $result['message']
        );
    }
}
