<?php

declare(strict_types=1);

namespace App\Domain\Guide\Models;

enum Language: string
{
    case Pl = 'Pl';
    case It = 'It';
    case De = 'De';
    case Fr = 'Fr';
    case Sp = 'Sp';
    case En = 'En';

}
