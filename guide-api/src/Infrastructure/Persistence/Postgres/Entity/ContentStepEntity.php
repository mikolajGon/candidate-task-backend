<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence\Postgres\Entity;

use App\Domain\Guide\Models\ContentStep;
use Doctrine\ORM\Mapping\Column;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\GeneratedValue;
use Doctrine\ORM\Mapping\Id;
use Doctrine\ORM\Mapping\JoinColumn;
use Doctrine\ORM\Mapping\ManyToOne;
use Doctrine\ORM\Mapping\Table;

#[Entity, Table(name: 'content_steps')]
final class ContentStepEntity
{
    #[Id, Column(type: 'integer'), GeneratedValue(strategy: 'AUTO')]
    private int $id;
    #[Column(type: 'string', nullable: false)]
    private string $title;
    #[Column(type: 'string', nullable: false)]
    private string $content;
    #[Column(name: 'step_order', type: 'integer', nullable: false)]
    private int $stepOrder;
    #[ManyToOne(targetEntity: ContentEntity::class, inversedBy: 'steps')]
    #[JoinColumn(name: 'content_id', referencedColumnName: 'id')]
    private ContentEntity|null $contentProperties = null;

    public function __construct(string $title, string $content, ContentEntity $contentProperties, int $order)
    {
        $this->title = $title;
        $this->content = $content;
        $this->contentProperties = $contentProperties;
        $this->stepOrder = $order;
    }

    public function toContentStep(): ContentStep
    {
        return new ContentStep($this->title, $this->content);
    }

    /**
     * @param string $title
     */
    public function setTitle(string $title): void
    {
        $this->title = $title;
    }

    /**
     * @param string $content
     */
    public function setContent(string $content): void
    {
        $this->content = $content;
    }

}
