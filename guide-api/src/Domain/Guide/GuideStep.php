<?php

namespace App\Domain\Guide;

use JsonSerializable;

class GuideStep implements JsonSerializable
{

    private string $title;

    private string $content;


    public function __construct(string $title, string $content)
    {
        $this->title = $title;
        $this->content = $content;
    }

    public function jsonSerialize(): array
    {
        return [
            'title' => $this->title,
            'content' => $this->content,
        ];
    }
}
