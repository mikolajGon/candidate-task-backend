<?php

namespace App\Infrastructure\NotFake;

use App\Domain\Guide\Models\Language;
use App\Domain\Guide\Ports\TranslationProvider;
use App\Infrastructure\NotFake\Http\DefinitelyLegitHttpClient;
use Symfony\Component\Console\Output\ConsoleOutput;

class NotFakeTranslationProvider implements TranslationProvider
{

    public function __construct(private readonly DefinitelyLegitHttpClient $translationProviderHttpClient)
    {
    }

    /**
     * {@inheritdoc}
     */
    function translate(array $content, Language $languageTo, Language $languageFrom): array
    {
        $body = [
            'original_language' => $this->languageToLocale($languageFrom),
            'language' => $this->languageToLocale($languageTo),
            'data' => $content
        ];

        // this service in its representation is responsible for maintaining the order;
        $result = $this->translationProviderHttpClient->post('/v1/auto-translate', $body);

        return $result['data'];
    }

    private function languageToLocale(Language $language): string
    {
        //mock impl
        return $language->value;
    }
}
