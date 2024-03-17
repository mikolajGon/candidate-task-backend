<?php

declare(strict_types=1);

namespace App\Application\Actions\Guide\Dto;

use App\Domain\Guide\Models\ContentStep;
use JsonSerializable;

class GuideStepDto extends ContentStep implements JsonSerializable
{
    /**
     * @param ContentStep[] $contentSteps
     * @return GuideStepDto[]
     */
    public static function fromContent(array $contentSteps): array
    {
        return array_map(
            function (ContentStep $contentStep) {
                return new GuideStepDto($contentStep->getTitle(), $contentStep->getContent());
            },
            $contentSteps
        );
    }

    public function jsonSerialize(): array
    {
        return [
            'title' => $this->title,
            'content' => $this->content,
        ];
    }
}
