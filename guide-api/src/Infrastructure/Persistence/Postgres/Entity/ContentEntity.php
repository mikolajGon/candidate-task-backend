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
    static function fromContent(Content $content): ContentEntity
    {
        return new ContentEntity(
            $content->getTitle(),
            $content->getLanguage()->value,
            $content->getGuideId()
        );
    }

    #[Id, Column(type: 'integer'), GeneratedValue(strategy: 'AUTO')]
    private int $id;
    #[Column(type: 'string', nullable: false)]
    private string $title;
    #[Column(type: 'string', nullable: false)]
    private string $language;
    #[Column(name: 'guide_id', type: 'integer', nullable: false)]
    private int $guideId;

    /**
     *
     * @var Collection<int, ContentStepEntity>
     */
    #[OneToMany(targetEntity: ContentStepEntity::class, mappedBy: 'contentProperties', cascade: ["persist"], orphanRemoval: true)]
    private Collection $steps;

    public function __construct(string $title, string $language, int $guideId)
    {
        $this->steps = new ArrayCollection();
        $this->title = $title;
        $this->language = $language;
        $this->guideId = $guideId;
    }

    /**
     * @return ContentStep[]
     */
    private function getContentSteps(): array
    {
        return $this->steps->map(function (ContentStepEntity $contentStepEntity) {
            return $contentStepEntity->toContentStep();
        })->toArray();
    }

    /**
     * @return Collection<int, ContentStepEntity>
     */
    public function getSteps(): Collection
    {
        return $this->steps;
    }

    public function getId(): int
    {
        return $this->id;
    }

    /**
     * @param string $title
     */
    public function setTitle(string $title): void
    {
        $this->title = $title;
    }

    public function toContent(): Content
    {
        return new Content(
            $this->guideId,
            Language::from($this->language),
            $this->title,
            $this->getContentSteps()
        );
    }
}
