<?php

declare(strict_types=1);

namespace App\Domain\Guide\Ports;

use App\Domain\DomainException\DomainInfrastructureException;
use App\Domain\Guide\Models\Content;

interface ContentRepository
{

    /**
     * @param int $guideId
     * @return Content[]
     */
    function getAllContent(int $guideId): array;

    /**
     * @param Content $content
     * @throws DomainInfrastructureException
     */
    function updateContent(Content $content): Content;
}
