<?php

declare(strict_types=1);

namespace App\Application\Actions\Guide;

use App\Application\Actions\Action;
use App\Domain\Guide\Exceptions\IncorrectContentException;
use App\Domain\Guide\GuideApi;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Log\LoggerInterface;
use Slim\Exception\HttpBadRequestException;

abstract class GuideAction extends Action
{
    protected GuideApi $guideApi;

    public function __construct(LoggerInterface $logger, GuideApi $guideApi)
    {
        parent::__construct($logger);
        $this->guideApi = $guideApi;
    }

    public function __invoke(Request $request, Response $response, array $args): Response
    {
        try {

        return parent::__invoke($request, $response, $args);
        } catch (IncorrectContentException $e) {
            throw new HttpBadRequestException($this->request, $e->getMessage());
        }
    }
}
