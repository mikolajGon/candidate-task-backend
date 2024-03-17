<?php

declare(strict_types=1);

namespace App\Application\Actions\Guide\Dto;

use App\Domain\Guide\Models\Content;
use JsonSerializable;

class GuideDto implements JsonSerializable
{

    static function fromContent(int $guideId, Content $content): GuideDto
    {
        $steps = GuideStepDto::fromContent($content->getSteps());
        return new GuideDto($content->getTitle(), $steps, $content->getLanguage()->value, $guideId);
    }

    private int $id;
    private string $language;
    private string $title;
    private array $guideSteps;

    public function __construct(string $title, array $guideSteps, string $language, int $id = null)
    {
        $this->title = $title;
        $this->guideSteps = $guideSteps;
        $this->language = $language;
        $this->id = $id;
    }

    #[\ReturnTypeWillChange]
    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'language' => $this->language,
            'title' => $this->title,
            'guideSteps' => $this->guideSteps,
        ];
    }

}
