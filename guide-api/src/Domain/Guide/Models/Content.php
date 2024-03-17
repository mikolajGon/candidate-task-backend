<?php

declare(strict_types=1);

namespace App\Domain\Guide\Models;

class Content
{
    private int $guideId;
    private Language $language;
    private string $title;
    /**
     * @var ContentStep[]
     */
    private array $steps;


    /**
     * @param ContentStep[] $steps
     */
    public function __construct(int $guideId, Language $language, string $title, array $steps)
    {
        $this->guideId = $guideId;
        $this->language = $language;
        $this->title = $title;
        $this->steps = $steps;
    }

    /**
     * @return string
     */
    public function getTitle(): string
    {
        return $this->title;
    }

    /**
     * @return Language
     */
    public function getLanguage(): Language
    {
        return $this->language;
    }

    /**
     * @return ContentStep[]
     */
    public function getSteps(): array
    {
        return $this->steps;
    }

    /**
     * @return int
     */
    public function getGuideId(): int
    {
        return $this->guideId;
    }
}
