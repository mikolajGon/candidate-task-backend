<?php

namespace App\Domain\Guide;

use App\Domain\Guide\Models\ContentStep;
use App\Domain\Guide\Models\Guide;
use App\Domain\Guide\Models\Language;

class GuideContext
{
    private Guide $guide;
    private GuideRepository $guideRepository;
    private ContentRepository $contentRepository;

    public function __construct(Guide $guide, GuideRepository $guideRepository, ContentRepository $contentRepository)
    {
        $this->guide = $guide;
        $this->guideRepository = $guideRepository;
        $this->contentRepository = $contentRepository;
    }

    /**
     * @return int
     */
    public function getGuideId(): int
    {
        return $this->guide->getId();
    }

    /**
     * @param Language $language
     * @param ContentStep[] $guideSteps
     * @return void
     */
    public function updateContent(Language $language, array $guideSteps)
    {

    }

    public function getContent(Language $language)
    {
    }

    /**
     * @return ContentStep[]
     * @throws GuideNotFoundException
     */
    public function getAllContent(): array
    {
        return $this->contentRepository->getAllContent($this->guide->getId());
    }

    public function createTranslation(Language $language)
    {
    }

}
