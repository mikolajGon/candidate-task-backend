<?php

namespace App\Infrastructure\NotFake\Http;

//we could use some http client for symphony per example
class DefinitelyLegitHttpClient
{

    //this one could/should be injected from settings to make it adjustable as in requirement
    // since I ma mocking I am ommiting this step
    private readonly string $httpHost;

    public function post(string $serviceEndpoint, array $body): array
    {
        //http call to $httpHost.$serviceEndpoint with $body
        $result = [
            'original_language' => $body['original_language'],
            'language' => $body['language'],
            'data' => []
        ];

        foreach ($body['data'] as $dataToTranslate) {
            $result['data'][] = $body['language'].": ".$dataToTranslate;
        }
        return $result;
    }
}
