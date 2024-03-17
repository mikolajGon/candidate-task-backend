<?php

declare(strict_types=1);

namespace App\Domain\Guide\Models;

class Guide
{
    private readonly int $id;

    public function __construct(int $id)
    {
        $this->id = $id;
    }

    /**
     * @return int
     */
    public function getId(): int
    {
        return $this->id;
    }
}
