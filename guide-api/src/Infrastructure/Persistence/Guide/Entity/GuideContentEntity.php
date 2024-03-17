<?php

namespace App\Infrastructure\Persistence\Guide\Entity;

use App\Domain\Guide\Models\ContentStep;

class GuideContentEntity
{
    private string $title;
    /**
     * @var ContentStep[]
     */
    private array $steps;


    /**
     * @param ContentStep[] $steps
     */
    public function __construct(string $title, array $steps)
    {
        $this->title = $title;
        $this->steps = $steps;
    }

    /**
     * @return ContentStep[]
     */
    public function getSteps(): array
    {
        return $this->steps;
    }

    /**
     * @return string
     */
    public function getTitle(): string
    {
        return $this->title;
    }
}
