<?php

declare(strict_types=1);

namespace App\Domain\Guide\Ports;

use App\Domain\Guide\Models\ContentStep;
use App\Domain\Guide\Models\Language;

interface ContentStepRepository
{

    function add(ContentStep $contentStep, int $order, int $guideId, Language $language): void;
}
