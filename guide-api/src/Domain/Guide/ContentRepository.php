<?php

declare(strict_types=1);

namespace App\Domain\Guide;

use App\Domain\Guide\Models\Content;

interface ContentRepository
{
    function createContent(Content $content);

    /**
     * @param int $guideId
     * @return Content[]
     * @throws GuideNotFoundException
     */
    function getAllContent(int $guideId): array;
}
