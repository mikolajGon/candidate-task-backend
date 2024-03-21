<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence\Postgres;

use App\Domain\Guide\GuideContentRepository;
use App\Infrastructure\Persistence\Postgres\Entity\ContentEntity;
use App\Infrastructure\Persistence\Postgres\Entity\GuideEntity;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\Exception\ORMException;

class PostgresGuideContentRepository implements GuideContentRepository
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
     * @throws ORMException
     */
    public function removeAll(int $guideId): void
    {
        $this->entityManager->beginTransaction();

        $allContent = $this->contentRepository->findBy(['guideId' => $guideId]);
        foreach ($allContent as $content) {
            $this->entityManager->remove($content);
        }

        $guide = $this->guideRepository->find($guideId);
        $this->entityManager->remove($guide);

        $this->entityManager->flush();
        $this->entityManager->commit();
    }
}
