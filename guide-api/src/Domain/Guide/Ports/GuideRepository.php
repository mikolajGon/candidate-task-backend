<?php

declare(strict_types=1);

namespace App\Domain\Guide\Ports;

use App\Domain\DomainException\DomainInfrastructureException;
use App\Domain\Guide\Exceptions\GuideNotFoundException;
use App\Domain\Guide\Models\Guide;

interface GuideRepository
{

    /**
     * @throws DomainInfrastructureException
     * @throws GuideNotFoundException
     */
    public function getGuide(int $id): Guide;

}
