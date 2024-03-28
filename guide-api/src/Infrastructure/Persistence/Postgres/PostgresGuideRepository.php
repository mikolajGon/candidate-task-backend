<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence\Postgres;

use App\Domain\DomainException\DomainInfrastructureException;
use App\Domain\Guide\Exceptions\GuideNotFoundException;
use App\Domain\Guide\Models\Guide;
use App\Domain\Guide\Ports\GuideRepository;
use App\Infrastructure\Persistence\Postgres\Entity\GuideEntity;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\Exception\ORMException;
use Psr\Log\LoggerInterface;

class PostgresGuideRepository implements GuideRepository
{
    private readonly EntityRepository $guideRepository;

    public function __construct(
        protected readonly LoggerInterface $logger,
        private readonly EntityManager     $entityManager,
    )
    {
        $this->guideRepository = $entityManager->getRepository(GuideEntity::class);
    }


    /**
     * {@inheritdoc}
     */
    public function getGuide(int $id): Guide
    {
        try {
            $guideEntity = $this->guideRepository->find($id);
            if ($guideEntity === null) {
                throw new GuideNotFoundException();
            }
            $this->entityManager->refresh($guideEntity);

            return new Guide($guideEntity->getId(), $guideEntity->getContentLength());

        } catch (ORMException $e) {
            $this->logger->error($e->getMessage());
            throw new DomainInfrastructureException();
        }
    }
}
