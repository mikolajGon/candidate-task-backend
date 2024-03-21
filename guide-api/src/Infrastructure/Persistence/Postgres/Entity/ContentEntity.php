<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence\Postgres\Entity;

use App\Domain\Guide\Models\Content;
use App\Domain\Guide\Models\ContentStep;
use App\Domain\Guide\Models\Language;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping\Column;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\GeneratedValue;
use Doctrine\ORM\Mapping\Id;
use Doctrine\ORM\Mapping\OneToMany;
use Doctrine\ORM\Mapping\Table;

#[Entity, Table(name: 'contents')]
final class ContentEntity
{
    #[Id, Column(type: 'integer'), GeneratedValue(strategy: 'AUTO')]
    private int $id;
    #[Column(type: 'string', nullable: false)]
    private string $title;
    #[Column(type: 'string', nullable: false)]
    private string $language;
    #[Column(name: 'guide_id', type: 'integer', nullable: false)]
    private int $guideId;
    #[Column(name: 'step_count', type: 'integer', nullable: false)]
    private int $stepCount;

    /**
     *
     * @var Collection<int, ContentStepEntity>
     */
    #[OneToMany(targetEntity: ContentStepEntity::class, mappedBy: 'contentProperties', cascade: ["persist"], orphanRemoval: true)]
    private Collection $steps;

    public function __construct(string $title, string $language, int $guideId, int $stepCount)
    {
        $this->steps = new ArrayCollection();
        $this->title = $title;
        $this->language = $language;
        $this->guideId = $guideId;
        $this->stepCount = $stepCount;
    }

    /**
     * @return ContentStep[]
     */
    private function getSteps(): array
    {
        return $this->steps->map(function (ContentStepEntity $contentStepEntity) {
            return $contentStepEntity->toContentStep();
        })->toArray();
    }

    /**
     * @return int
     */
    public function getId(): int
    {
        return $this->id;
    }


    public function toContent(): Content
    {
        return new Content($this->guideId, Language::from($this->language), $this->title, $this->getSteps());
    }
}
