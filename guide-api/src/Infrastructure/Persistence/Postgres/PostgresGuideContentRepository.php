<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence\Postgres;

use App\Domain\DomainException\DomainInfrastructureException;
use App\Domain\Guide\Exceptions\GuideNotFoundException;
use App\Domain\Guide\Models\Content;
use App\Domain\Guide\Models\Guide;
use App\Domain\Guide\Models\Language;
use App\Domain\Guide\Ports\GuideContentRepository;
use App\Infrastructure\Persistence\Postgres\Entity\ContentEntity;
use App\Infrastructure\Persistence\Postgres\Entity\ContentStepEntity;
use App\Infrastructure\Persistence\Postgres\Entity\GuideEntity;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\Exception\ORMException;
use Doctrine\ORM\OptimisticLockException;
use Psr\Log\LoggerInterface;

class PostgresGuideContentRepository implements GuideContentRepository
{
    private readonly EntityRepository $guideRepository;
    private readonly EntityRepository $contentRepository;

    public function __construct(
        protected readonly LoggerInterface $logger,
        private readonly EntityManager     $entityManager
    )
    {
        $this->guideRepository = $entityManager->getRepository(GuideEntity::class);
        $this->contentRepository = $entityManager->getRepository(ContentEntity::class);
    }

    /**
     * {@inheritdoc}
     */
    public function create($title, $language, $content): Guide
    {
        try {
            $this->entityManager->beginTransaction();

            $guideEntity = new GuideEntity();
            $guideEntity->setContentLength(count($content));
            $this->entityManager->persist($guideEntity);
            $this->entityManager->flush();

            $contentEntity = ContentEntity::fromContent(
                new Content($guideEntity->getId(), $language, $title, $content));

            $this->entityManager->persist($contentEntity);
            $this->entityManager->flush();

            foreach ($content as $index => $contentStep) {
                $this->entityManager->persist(new ContentStepEntity(
                    $contentStep->getTitle(),
                    $contentStep->getContent(),
                    $contentEntity,
                    $index + 1));
                $this->entityManager->flush();
            }

            $this->entityManager->commit();
            $this->entityManager->clear();

            return new Guide($guideEntity->getId(), $guideEntity->getContentLength());
        } catch (ORMException $e) {
            $this->logger->error($e->getMessage());
            throw new DomainInfrastructureException();
        }
    }

    /**
     * {@inheritdoc}
     */
    public function removeAll($guideId): void
    {
        try {
            $this->entityManager->beginTransaction();

            $allContent = $this->contentRepository->findBy(['guideId' => $guideId]);
            foreach ($allContent as $content) {
                $this->entityManager->remove($content);
            }

            $guide = $this->guideRepository->find($guideId);
            $this->entityManager->remove($guide);

            $this->entityManager->flush();
            $this->entityManager->commit();

        } catch (ORMException|OptimisticLockException $e) {
            $this->logger->error($e->getMessage());
            throw new DomainInfrastructureException();
        }
    }

    /**
     * {@inheritdoc}
     */
    public function replaceGuideContent(Guide $guide, array $contents): array
    {
        try {
            $this->entityManager->beginTransaction();

            /* @var GuideEntity $persistedGuide */
            $persistedGuide = $this->guideRepository->find($guide->getId());
            if (!isset($persistedGuide)) {
                throw new GuideNotFoundException();
            }

            $persistedGuide->setContentLength($guide->getContentLength());
            $this->entityManager->persist($persistedGuide);

            $currentContent = $this->contentRepository->findBy(['guideId' => $guide->getId()]);

            foreach ($currentContent as $content) {
                $this->entityManager->remove($content);
            }

            $this->entityManager->flush();

            foreach ($contents as $content) {
                $contentEntity = ContentEntity::fromContent($content);

                $this->entityManager->persist($contentEntity);
                $this->entityManager->flush();

                foreach ($content->getSteps() as $index => $contentStep) {
                    $this->entityManager->persist(
                        new ContentStepEntity(
                            $contentStep->getTitle(),
                            $contentStep->getContent(),
                            $contentEntity,
                            $index + 1
                        ));
                }
                $this->entityManager->flush();
            }

            $this->entityManager->commit();
            $this->entityManager->clear();

            return $contents;

        } catch (ORMException|OptimisticLockException $e) {
            $this->logger->error($e->getMessage());
            throw new DomainInfrastructureException();
        }
    }
}
