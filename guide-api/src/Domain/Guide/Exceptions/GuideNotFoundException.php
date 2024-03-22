<?php

declare(strict_types=1);

namespace App\Domain\Guide\Exceptions;

use App\Domain\DomainException\DomainRecordNotFoundException;

class GuideNotFoundException extends DomainRecordNotFoundException
{
    public $message = 'The guide you requested does not exist.';
}
