<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence\Guide;

use App\Domain\Guide\ContentRepository;
use App\Domain\Guide\GuideNotFoundException;
use App\Domain\Guide\GuideRepository;
use App\Domain\Guide\Models\Content;
use App\Domain\Guide\Models\Guide;
use App\Domain\Guide\Models\Language;
use App\Infrastructure\Persistence\Guide\Entity\GuideContentEntity;

class InMemoryGuideRepository implements GuideRepository, ContentRepository
{
    private InMemoryStore $inMemoryStore;

    public function __construct()
    {
        $this->inMemoryStore = new InMemoryStore();
    }

    public function createGuide(): Guide
    {
        $guides = $this->inMemoryStore->getGuides();
        $lastId = end($guides);
        $newId = !$lastId ? 1 : $lastId + 1;

        $guides[] = $newId;

        $this->inMemoryStore->setGuides($guides);

        return new Guide($newId);
    }

    public function getGuide(int $id): Guide
    {
        echo $id;
        if (!in_array($id, $this->inMemoryStore->getGuides())) {
            throw new GuideNotFoundException();
        }
        return new Guide($id);
    }

    function createContent(Content $content): void
    {
        $guideContentEntity = new GuideContentEntity(
            $content->getTitle(), $content->getSteps()
        );
        $guideContent = $this->inMemoryStore->getGuideContent();

        if (isset($guideContent[$content->getGuideId()])) {
            $guideContent[$content->getGuideId()][$content->getLanguage()->value] = $guideContentEntity;
        } else {
            $newArray = [];
            $newArray[$content->getLanguage()->value] = $guideContentEntity;
            $guideContent[$content->getGuideId()] = $newArray;
        }

        $this->inMemoryStore->setGuideContent($guideContent);
    }

    /**
     * {@inheritdoc}
     */
    function getAllContent(int $guideId): array
    {
        $content = $this->inMemoryStore->getGuideContent()[$guideId];

        if (!$content) {
            throw new GuideNotFoundException();
        }

        return array_map(function (string $language) use ($guideId, $content) {
            $guide = $content[$language];
            return new Content($guideId, Language::from($language), $guide->getTitle(), $guide->getSteps());
        }, array_keys($content));
    }
}
