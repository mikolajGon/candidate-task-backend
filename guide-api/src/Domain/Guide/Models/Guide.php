<?php

declare(strict_types=1);

namespace App\Domain\Guide\Models;

class Guide
{

    public function __construct(
        private readonly int $id,
        private int $contentLength
    )
    {
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getContentLength(): int
    {
        return $this->contentLength;
    }

    public function setContentLength(int $contentLength): void
    {
        $this->contentLength = $contentLength;
    }
}
