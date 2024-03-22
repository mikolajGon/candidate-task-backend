<?php

declare(strict_types=1);

namespace App\Domain\Guide\Ports;

use App\Domain\DomainException\DomainInfrastructureException;
use App\Domain\Guide\Exceptions\GuideNotFoundException;
use App\Domain\Guide\Models\Content;
use App\Domain\Guide\Models\ContentStep;
use App\Domain\Guide\Models\Guide;
use App\Domain\Guide\Models\Language;

interface GuideContentRepository
{
    /**
     * @param string $title
     * @param Language $language
     * @param ContentStep[] $content
     * @return Guide
     * @throws DomainInfrastructureException
     */
    public function create(string $title, Language $language, array $content): Guide;

    /**
     * @throws DomainInfrastructureException
     */
    public function removeAll(int $guideId): void;

    /**
     * @param Guide $guide
     * @param Content[] $contents
     * @return Content[]
     * @throws GuideNotFoundException
     * @throws DomainInfrastructureException
     */
    function replaceGuideContent(Guide $guide, array $contents): array;
}
