<?php

declare(strict_types=1);

namespace App\Domain\Guide;

use JsonSerializable;

class Guide implements JsonSerializable
{

    private string $title;
    private ArrayOfGuideSteps $guideSteps;

    public function __construct(string $title, ArrayOfGuideSteps $guideSteps)
    {
        $this->title = $title;

        $this->guideSteps = $guideSteps;
    }

    #[\ReturnTypeWillChange]
    public function jsonSerialize(): array
    {
        return [
            'title' => $this->title,
            'guideSteps' => $this->guideSteps,
        ];
    }

}
