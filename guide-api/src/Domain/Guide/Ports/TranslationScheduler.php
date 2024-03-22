<?php

declare(strict_types=1);

namespace App\Domain\Guide\Ports;

use App\Domain\Guide\Models\Language;

interface TranslationScheduler
{
    function scheduleTranslation(int $guideId, Language $language): void;
}
