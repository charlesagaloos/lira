<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Throwable;

class ImageModerationService
{
    public function check(UploadedFile $file): array
    {
        $apiUser = config('services.sightengine.user');
        $apiSecret = config('services.sightengine.secret');

        if (!$apiUser || !$apiSecret) {
            return [
                'allowed' => false,
                'message' => 'Image moderation is not configured.',
            ];
        }

        try {
            $response = Http::timeout(30)
                ->attach(
                    'media',
                    fopen($file->getRealPath(), 'r'),
                    $file->getClientOriginalName(),
                )
                ->post(
                    'https://api.sightengine.com/1.0/check.json',
                    [
                        'models' => 'nudity-2.1',
                        'api_user' => $apiUser,
                        'api_secret' => $apiSecret,
                    ],
                );

            if (!$response->successful()) {
                return [
                    'allowed' => false,
                    'message' => 'Unable to verify the image. Please try again.',
                ];
            }

            $result = $response->json();

            if (($result['status'] ?? null) !== 'success') {
                return [
                    'allowed' => false,
                    'message' => 'Unable to verify the image. Please try again.',
                ];
            }

            $nudity = $result['nudity'] ?? [];
            $classes = $nudity['suggestive_classes'] ?? [];

            /*
             * Reject explicit sexual content.
             */
            if (
                ($nudity['sexual_activity'] ?? 0) >= 0.50 ||
                ($nudity['sexual_display'] ?? 0) >= 0.50 ||
                ($nudity['erotica'] ?? 0) >= 0.50
            ) {
                return [
                    'allowed' => false,
                    'message' => 'This image contains explicit or inappropriate content and cannot be uploaded.',
                ];
            }

            /*
             * Reject sexual posing or sexual focus.
             */
            if (
                ($classes['suggestive_pose'] ?? 0) >= 0.96 ||
                ($classes['suggestive_focus'] ?? 0) >= 0.96
            ) {
                return [
                    'allowed' => false,
                    'message' => 'This image contains sexually suggestive content and cannot be uploaded.',
                ];
            }

            /*
             * Reject lingerie and male underwear.
             * Bikinis and normal swimwear remain allowed.
             */
            if (
                ($classes['lingerie'] ?? 0) >= 0.70 ||
                ($classes['male_underwear'] ?? 0) >= 0.70
            ) {
                return [
                    'allowed' => false,
                    'message' => 'This image contains inappropriate clothing and cannot be uploaded.',
                ];
            }

            return [
                'allowed' => true,
                'message' => null,
            ];
        } catch (Throwable $e) {
            report($e);

            return [
                'allowed' => false,
                'message' => 'Unable to verify the image. Please try again.',
            ];
        }
    }
}
