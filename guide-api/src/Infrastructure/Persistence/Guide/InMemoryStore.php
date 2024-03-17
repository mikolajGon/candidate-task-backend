<?php

namespace App\Infrastructure\Persistence\Guide;

use App\Domain\Guide\Models\ContentStep;
use App\Domain\Guide\Models\Language;
use App\Infrastructure\Persistence\Guide\Entity\GuideContentEntity;

class InMemoryStore
{
    public array $guides;
    public array $guideContent;

    public function __construct()
    {
        $this->guides = [1];
        $this->guideContent = [
            1 => [
                Language::En->value => new GuideContentEntity(
                    "A nice guide",
                    [
                        new ContentStep("step 1", "some content"),
                        new ContentStep("step 2", "some other content")
                    ])
            ]
        ];
    }
}
