<?php

declare(strict_types=1);

namespace App\Domain\Guide\Models;

class Content
{

    public function __construct(
        private readonly int $guideId,
        private readonly Language $language,
        private readonly string $title,
        /**
         * @var ContentStep[]
         */
        private readonly array $steps)
    {
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
