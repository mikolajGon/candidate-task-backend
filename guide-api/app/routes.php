<?php

declare(strict_types=1);

use App\Application\Actions\Guide\CreateGuideAction;
use App\Application\Actions\Guide\GetGuideAction;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\App;
use Slim\Interfaces\RouteCollectorProxyInterface as Group;

return function (App $app) {
    $app->options('/{routes:.*}', function (Request $request, Response $response) {
        // CORS Pre-Flight OPTIONS Request Handler
        return $response;
    });

    $app->get('/', function (Request $request, Response $response) {
        $response->getBody()->write('Hello world!');
        return $response;
    });


    $app->group('/guides', function (Group $group) {
        $group->post('/', CreateGuideAction::class);
        $group->get('/{id}', GetGuideAction::class);
//        $group->delete('/{id}', ViewUserAction::class);
//        $group->patch('/{id}', ViewUserAction::class);
//        $group->post('/auto-translate/{id}', ViewUserAction::class);
    });
};
