<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence\Postgres;

use App\Domain\DomainException\DomainInfrastructureException;
use App\Domain\Guide\Models\Content;
use App\Domain\Guide\Models\Language;
use App\Domain\Guide\Ports\ContentRepository;
use App\Infrastructure\Persistence\Postgres\Entity\ContentEntity;
use App\Infrastructure\Persistence\Postgres\Entity\ContentStepEntity;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\Exception\ORMException;
use Psr\Log\LoggerInterface;

class PostgresContentRepository implements ContentRepository
{
    private readonly EntityRepository $contentRepository;

    public function __construct(
        private readonly LoggerInterface $logger,
        private readonly EntityManager   $entityManager,
    )
    {
        $this->contentRepository = $entityManager->getRepository(ContentEntity::class);
    }

    /**
     * {@inheritdoc}
     */
    function getAllContent(int $guideId): array
    {
        $contentEntities = $this->contentRepository->findBy(['guideId' => $guideId]);

        return array_map(function (ContentEntity $contentEntity) {
            return $contentEntity->toContent();
        }, $contentEntities);
    }


    /**
     * {@inheritdoc}
     */
    function updateContent($content): Content
    {

        try {
            $this->entityManager->beginTransaction();

            /* @var ContentEntity|null $contentEntity */
            $contentEntity = $this->contentRepository->findOneBy([
                'guideId' => $content->getGuideId(),
                'language' => $content->getLanguage()->value
            ]);

            if (!isset($contentEntity)) {

                $contentEntity = ContentEntity::fromContent(
                    new Content(
                        $content->getGuideId(),
                        $content->getLanguage(),
                        $content->getTitle(),
                        $content->getSteps()));

                $this->entityManager->persist($contentEntity);
                $this->entityManager->flush();

                foreach ($content->getSteps() as $index => $contentStep) {
                    $this->entityManager->persist(new ContentStepEntity(
                        $contentStep->getTitle(),
                        $contentStep->getContent(),
                        $contentEntity,
                        $index + 1));
                    $this->entityManager->flush();
                }
            } else {
                /* @var ContentStepEntity $step */
                foreach ($contentEntity->getSteps() as $index => $step) {
                    $step->setTitle($content->getSteps()[$index]->getTitle());
                    $step->setContent($content->getSteps()[$index]->getContent());
                }
            }

            $contentEntity->setTitle($content->getTitle());
            $this->entityManager->persist($contentEntity);

            $this->entityManager->commit();
            $this->entityManager->clear();

            return $content;
        } catch (ORMException $e) {
            $this->logger->error($e->getMessage());
            throw new DomainInfrastructureException();
        }
    }

    function getContent(int $guideId, Language $language): Content|null
    {
        $contentEntity = $this->contentRepository->findOneBy(['guideId' => $guideId, 'language' => $language->value]);
        if (!isset($contentEntity)) {
            return null;
        };

        return $contentEntity->toContent();
    }

    function createContent(Content $content): Content
    {
        try {
            $contentEntity = ContentEntity::fromContent($content);

            $this->entityManager->persist($contentEntity);
            $this->entityManager->flush();

            return $content;
        } catch (ORMException $e) {
            $this->logger->error($e->getMessage());
            throw new DomainInfrastructureException();
        }
    }
}
