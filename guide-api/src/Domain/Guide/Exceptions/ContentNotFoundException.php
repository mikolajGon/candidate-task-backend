<?php

declare(strict_types=1);

namespace App\Domain\Guide\Exceptions;

use App\Domain\DomainException\DomainRecordNotFoundException;

class ContentNotFoundException extends DomainRecordNotFoundException
{
    public $message = 'Content does not exist.';
}
