<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence\Postgres;

use App\Domain\DomainException\DomainInfrastructureException;
use App\Domain\Guide\Exceptions\ContentNotFoundException;
use App\Domain\Guide\Models\ContentStep;
use App\Domain\Guide\Models\Language;
use App\Domain\Guide\Ports\ContentStepRepository;
use App\Infrastructure\Persistence\Postgres\Entity\ContentEntity;
use App\Infrastructure\Persistence\Postgres\Entity\ContentStepEntity;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\Exception\ORMException;
use Psr\Log\LoggerInterface;

class PostgresContentStepRepository implements ContentStepRepository
{
    private readonly EntityRepository $contentRepository;

    public function __construct(
        private readonly LoggerInterface $logger,
        private readonly EntityManager $entityManager,
    )
    {
        $this->contentRepository = $entityManager->getRepository(ContentEntity::class);
    }

    /**
     * @throws ContentNotFoundException
     * @throws DomainInfrastructureException
     */
    public function add(ContentStep $contentStep, int $order, int $guideId, Language $language): void
    {
        try {
            $contentEntity = $this->contentRepository->findOneBy([
                'guideId' => $guideId,
                'language' => $language->value
            ]);

            if (!isset($contentEntity)) {
                throw new ContentNotFoundException();
            }

            $contentStepEntity = new ContentStepEntity(
                $contentStep->getTitle(),
                $contentStep->getContent(),
                /* @var $contentEntity ContentEntity */
                $contentEntity,
                $order
            );

            $this->entityManager->persist($contentStepEntity);
            $this->entityManager->flush();
        } catch (ORMException $e) {
            $this->logger->error($e->getMessage());
            throw new DomainInfrastructureException();
        }
    }
}
