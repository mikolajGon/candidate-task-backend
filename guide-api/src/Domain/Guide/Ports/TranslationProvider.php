<?php

declare(strict_types=1);

namespace App\Domain\Guide\Ports;

use App\Domain\Guide\Models\Language;

interface TranslationProvider
{
    /**
     * @param string[] $content
     * @return string[]
     */
    function translate(array $content, Language $languageTo, Language $languageFrom): array;
}
