<?php

declare(strict_types=1);

namespace App\Domain\Guide;

use App\Domain\Guide\Models\Guide;

interface GuideContentRepository
{
    public function removeAll(int $guideId): void;
}
