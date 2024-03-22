<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence\Postgres\Entity;

use Doctrine\ORM\Mapping\Column;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\GeneratedValue;
use Doctrine\ORM\Mapping\Id;
use Doctrine\ORM\Mapping\Table;

#[Entity, Table(name: 'guides')]
final class GuideEntity{

    #[Id, Column(type: 'integer'), GeneratedValue(strategy: 'AUTO')]
    private int $id;
    #[Column(name: 'content_length', type: 'integer', nullable: false)]
    private int $contentLength;


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
