<?php

declare(strict_types=1);

namespace App\Domain\Guide\Exceptions;

use App\Domain\DomainException\DomainException;
use Throwable;

class IncorrectContentException extends DomainException
{
    public function __construct(string $reason, int $code = 0, ?Throwable $previous = null)
    {
        $message = "The Content of Guide you provided is incorrect, because: " . $reason;
        parent::__construct($message, $code, $previous);
    }

}
