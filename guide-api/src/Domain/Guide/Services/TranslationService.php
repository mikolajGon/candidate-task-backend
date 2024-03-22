<?php

namespace App\Domain\Guide\Services;

use App\Domain\DomainException\DomainInfrastructureException;
use App\Domain\Guide\Context\GuideContext;
use App\Domain\Guide\Exceptions\ContentNotFoundException;
use App\Domain\Guide\Exceptions\IncorrectContentException;
use App\Domain\Guide\Models\Content;
use App\Domain\Guide\Models\ContentStep;
use App\Domain\Guide\Models\Language;
use App\Domain\Guide\Ports\TranslationProvider;
use App\Domain\Guide\Ports\TranslationScheduler;
use Generator;
use Psr\Log\LoggerInterface;

class TranslationService
{

    public function __construct(
        private readonly LoggerInterface      $logger,
        private readonly TranslationScheduler $translationScheduler,
        private readonly TranslationProvider  $translationProvider
    )
    {
    }

    /**
     * @throws IncorrectContentException
     */
    public function scheduleTranslation(GuideContext $guideContext, Language $language): void
    {
        $currentContent = $guideContext->getContent($language);
        if (isset($currentContent)) {

            $guideContext->isReady($currentContent)
                ? throw new IncorrectContentException("Content for language: " . $language->value . " already exists")
                : throw new IncorrectContentException("Content for language: " . $language->value . " is already in progress");
        }

        $this->translationScheduler->scheduleTranslation($guideContext->getGuideId(), $language);
    }


    /**
     * @throws IncorrectContentException
     * @throws DomainInfrastructureException
     */
    public function translate(GuideContext $guideContext, Language $language): void
    {
        $currentContent = $guideContext->getContent($language);
        if (isset($currentContent)) {

            throw new IncorrectContentException("Content for language: " . $language->value . " already exists");
        }

        $anyContent = $guideContext->getAllContent()[0];

        if (!isset($anyContent)) {
            return;
        }

        $translation = $this->translationProvider->translate(content: [$anyContent->getTitle()], languageTo: $language, languageFrom: $anyContent->getLanguage());

        $addStepToContentFunc = $guideContext->createNotReadyContent(new Content($guideContext->getGuideId(), $language, $translation[0], []));

        foreach ($this->generateStepTranslation($anyContent, $language) as $index => $translation) {
            try {
                $addStepToContentFunc(new ContentStep($translation[0], $translation[1]), $index + 1);
            } catch (ContentNotFoundException $e) {
                $this->logger->warning('Content manipulated during translation GuideId: ' . $guideContext->getGuideId() . " language: " . $language->value);
                break;
            }
        }
    }

    /**
     * @return Generator<string[]>
     */
    private function generateStepTranslation(Content $content, Language $languageTo): Generator
    {
        foreach ($content->getSteps() as $step) {

            yield $this->translationProvider->translate(
                content: [$step->getTitle(), $step->getContent()],
                languageTo: $languageTo, languageFrom: $content->getLanguage());
        }
    }
}
