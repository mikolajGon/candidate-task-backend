<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence\Postgres;

use App\Domain\Guide\ContentRepository;
use App\Domain\Guide\GuideNotFoundException;
use App\Domain\Guide\GuideRepository;
use App\Domain\Guide\Models\Content;
use App\Domain\Guide\Models\Guide;
use App\Infrastructure\Persistence\Postgres\Entity\ContentEntity;
use App\Infrastructure\Persistence\Postgres\Entity\ContentStepEntity;
use App\Infrastructure\Persistence\Postgres\Entity\GuideEntity;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\Exception\ORMException;
use Doctrine\ORM\OptimisticLockException;

class PostgresGuideRepository implements GuideRepository, ContentRepository
{
    private readonly EntityRepository $guideRepository;
    private readonly EntityRepository $contentRepository;

    public function __construct(
        private readonly EntityManager $entityManager,
    )
    {
        $this->guideRepository = $entityManager->getRepository(GuideEntity::class);
        $this->contentRepository = $entityManager->getRepository(ContentEntity::class);
    }

    /**
     * @throws OptimisticLockException
     * @throws ORMException
     */
    function createContent(Content $content): void
    {

        $this->entityManager->beginTransaction();
        $contentEntity = new ContentEntity(
            $content->getTitle(),
            $content->getLanguage()->value,
            $content->getGuideId()
        );

        $this->entityManager->persist($contentEntity);
        $this->entityManager->flush();

        foreach ($content->getSteps() as $index => $contentStep) {
            $this->entityManager->persist(new ContentStepEntity(
                $contentStep->getTitle(),
                $contentStep->getContent(),
                $contentEntity,
                $index + 1
            ));
            $this->entityManager->flush();
        }

        $this->entityManager->commit();
        $this->entityManager->clear();
    }

    function getAllContent(int $guideId): array
    {
        return array_map(function (ContentEntity $contentEntity) {
            return $contentEntity->toContent();
        }, $this->contentRepository->findBy(['guideId' => $guideId]));
    }

    /**
     * @throws ORMException
     */
    public function createGuide(): Guide
    {
        $guideEntity = new GuideEntity();
        $this->entityManager->persist($guideEntity);
        $this->entityManager->flush();


        return new Guide($guideEntity->getId());
    }

    public function getGuide(int $id): Guide
    {
        $guideEntity = $this->guideRepository->find($id);
        if ($guideEntity === null) {
            throw new GuideNotFoundException();
        }
        return new Guide($guideEntity->getId());
    }
}
