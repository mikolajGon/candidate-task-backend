<?php

declare(strict_types=1);

namespace App\Domain\Guide;

use App\Domain\Guide\Models\Guide;

interface GuideRepository
{
    public function createGuide(): Guide;

    public function getGuide(int $id): Guide;

}
