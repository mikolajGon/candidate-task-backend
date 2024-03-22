<?php

declare(strict_types=1);

namespace App\Application\Actions;

use App\Domain\DomainException\DomainInfrastructureException;
use App\Domain\DomainException\DomainRecordNotFoundException;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Log\LoggerInterface;
use Slim\Exception\HttpBadRequestException;
use Slim\Exception\HttpInternalServerErrorException;
use Slim\Exception\HttpNotFoundException;

abstract class Action
{

    protected Request $request;

    protected Response $response;

    protected array $args;

    public function __construct(protected readonly LoggerInterface $logger)
    {
    }

    /**
     * @throws HttpNotFoundException
     * @throws HttpBadRequestException
     */
    public function __invoke(Request $request, Response $response, array $args): Response
    {
        $this->request = $request;
        $this->response = $response;
        $this->args = $args;

        try {
            return $this->action();
        } catch (DomainRecordNotFoundException $e) {
            throw new HttpNotFoundException($this->request, $e->getMessage());
        } catch (DomainInfrastructureException $e) {
            $this->logger->error($e);
            throw new HttpInternalServerErrorException($this->request, 'Something went wrong');
        }
    }

    /**
     * @throws DomainRecordNotFoundException
     * @throws DomainInfrastructureException
     */
    abstract protected function action(): Response;

    /**
     * @return array|object
     */
    protected function getFormData(): object|array
    {
        return $this->request->getParsedBody();
    }

    /**
     * @param string $name
     * @return mixed
     * @throws HttpBadRequestException
     */
    protected function resolveArg(string $name): mixed
    {
        if (!isset($this->args[$name])) {
            throw new HttpBadRequestException($this->request, "Could not resolve argument `{$name}`.");
        }

        return $this->args[$name];
    }

    /**
     * @param object|array|null $data
     */
    protected function respondWithData(object|array $data = null, int $statusCode = 200): Response
    {
        $payload = new ActionPayload($statusCode, $data);

        return $this->respond($payload);
    }

    protected function respond(ActionPayload $payload): Response
    {
        $json = json_encode($payload, JSON_PRETTY_PRINT);
        $this->response->getBody()->write($json);

        return $this->response
                    ->withHeader('Content-Type', 'application/json')
                    ->withStatus($payload->getStatusCode());
    }
}
