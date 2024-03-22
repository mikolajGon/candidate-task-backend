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
use App\Domain\Guide\Ports\ContentStepRepository;
use App\Domain\Guide\Ports\GuideContentRepository;
use App\Domain\Guide\Services\TranslationService;
use Closure;

class GuideContext
{
    private readonly TranslationService $translationService;

    public function __construct(
        private readonly Guide                  $guide,
        private readonly ContentRepository      $contentRepository,
        private readonly ContentStepRepository  $contentStepRepository,
        private readonly GuideContentRepository $guideContentRepository)
    {
    }

    public function getGuideId(): int
    {
        return $this->guide->getId();
    }

    /**
     * @throws DomainInfrastructureException | IncorrectContentException
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

    /**
     * @return Content[]
     */
    public function getAllContent(): array
    {
        $allContent = $this->contentRepository->getAllContent($this->guide->getId());

        return array_filter($allContent, function (Content $content) {
            return count($content->getSteps()) == $this->guide->getContentLength();
        });
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
     * @throws IncorrectContentException | DomainInfrastructureException | GuideNotFoundException
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

    /**
     * @throws IncorrectContentException
     */
    public function isReady(Content $content): bool
    {
        if ($content->getGuideId() != $this->getGuideId()) {
            throw new IncorrectContentException('This content do not belong to this guide');
        }

        return count($content) == $this->guide->getContentLength();
    }

    public function getContent(Language $language): Content|null
    {
        return $this->contentRepository->getContent($this->getGuideId(), $language);
    }

    /**
     * @throws DomainInfrastructureException
     */
    public function createNotReadyContent(Content $content): callable
    {
        $this->contentRepository->createContent($content);

        return function (ContentStep $contentStep, int $order) use ($content) {
            $this->contentStepRepository->add($contentStep, $order, $content->getGuideId(), $content->getLanguage());
        };
    }
}
