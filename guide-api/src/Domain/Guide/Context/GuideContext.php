<?php

namespace App\Domain\Guide\Context;

use App\Domain\DomainException\DomainInfrastructureException;
use App\Domain\Guide\Exceptions\GuideNotFoundException;
use App\Domain\Guide\Exceptions\IncorrectContentException;
use App\Domain\Guide\Models\Content;
use App\Domain\Guide\Models\ContentStep;
use App\Domain\Guide\Models\Guide;
use App\Domain\Guide\Models\Language;
use App\Domain\Guide\Ports\ContentRepository;
use App\Domain\Guide\Ports\GuideContentRepository;

class GuideContext
{

    public function __construct(
        private readonly Guide                  $guide,
        private readonly ContentRepository      $contentRepository,
        private readonly GuideContentRepository $guideContentRepository)
    {
    }

    public function getGuideId(): int
    {
        return $this->guide->getId();
    }

    /**
     * @throws DomainInfrastructureException
     * @throws IncorrectContentException
     */
    public function updateContent(Content $content): Content
    {
        if ($content->getGuideId() != $this->getGuideId()) {
            throw new IncorrectContentException("Content is for other guide, should be " . $this->getGuideId() . " but is " . $content->getGuideId());
        }

        $currentContentStepsCount = count($content->getSteps());
        if ($currentContentStepsCount != $this->guide->getContentLength()) {
            throw new IncorrectContentException("Content steps count do not match");
        }

        return $this->contentRepository->updateContent($content);
    }

    public function getContent(Language $language): void
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

    /**
     * @throws DomainInfrastructureException
     */
    public function delete(int $guideId): void
    {
        $this->guideContentRepository->removeAll($guideId);
    }

    /**
     * @param Content[] $contents
     * @return Content[]
     * @throws IncorrectContentException
     * @throws DomainInfrastructureException
     */
    public function replaceContent(array $contents): array
    {
        $contentStepsCount = count($contents[0]->getSteps());
        $languages = [];

        foreach ($contents as $content) {
            if ($content->getGuideId() != $this->getGuideId()) {
                throw new IncorrectContentException("Content is for other guide, should be " . $this->getGuideId() . " but is " . $content->getGuideId());
            }

            $currentContentStepsCount = count($content->getSteps());
            if ($currentContentStepsCount != $contentStepsCount) {
                throw new IncorrectContentException("Not all content has same amount of steps");
            }

            if (array_key_exists($content->getLanguage()->value, $languages)) {
                throw new IncorrectContentException("Double content for same language");
            }
            $languages[$content->getLanguage()->value] = true;
        }

        $this->guide->setContentLength($contentStepsCount);

        return $this->guideContentRepository->replaceGuideContent($this->guide, $contents);
    }
}
