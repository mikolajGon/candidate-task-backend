<?php

namespace App\Infrastructure\Persistence\Guide;

use App\Domain\Guide\Models\ContentStep;
use App\Domain\Guide\Models\Language;
use App\Infrastructure\Persistence\Guide\Entity\GuideContentEntity;

class InMemoryStore
{

    public function __construct()
    {
        $guides = [1];
        $guideContent = [
            1 => [
                Language::En->value => new GuideContentEntity(
                    "A nice guide",
                    [
                        new ContentStep("step 1", "some content"),
                        new ContentStep("step 2", "some other content")
                    ])
            ]
        ];


        $this->setGuides($guides);
        $this->setGuideContent($guideContent);
    }

    public function getGuides(): array
    {
        return apcu_fetch('guides_key');
    }

    public function getGuideContent(): array
    {
        return apcu_fetch('guide_content_key');
    }

    public function setGuides(array $guides): void
    {
        apcu_store('guides_key', $guides, 3600);
    }

    public function setGuideContent(array $guideContent): void
    {
        apcu_store('guide_content_key', $guideContent, 3600);
    }
}
