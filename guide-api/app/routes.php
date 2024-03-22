<?php

declare(strict_types=1);

use App\Application\Actions\Guide\CreateGuideAction;
use App\Application\Actions\Guide\DeleteGuideAction;
use App\Application\Actions\Guide\GetGuideAction;
use App\Application\Actions\Guide\TranslateGuideContentAction;
use App\Application\Actions\Guide\UpdateGuideAction;
use App\Application\Actions\Guide\UpdateGuideContentAction;
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


    /*
     * Since it is POC I skipped a lot of standard stuff, such as:
     *      authentication
     *      authorization
     *      request validation - we could use rg. symphony-validation
     * */
    $app->group('/guides', function (Group $group) {
        $group->post('/', CreateGuideAction::class);
        $group->get('/{id}', GetGuideAction::class);
        $group->delete('/{id}', DeleteGuideAction::class);
        $group->patch('/{id}/auto-translate', TranslateGuideContentAction::class);
        // This one in this API design actually represents something like PATCH on resource in standard REST
        $group->put('/{id}/content/{language}', UpdateGuideContentAction::class);
        /**
         * this implementation actually break the idempotency of put endpoint
         * but this is not actual REST representation of resources
         * but rather combined approach for performing CRUD operation on guides
         *
         * The approach couldn't be determine, since it is POC of coding task,
         * and we are missing a lot of factors (eg.
         *      what are actual the actual resources
         *      what are current requirements)
         *
         * Anyway one could take a more standard approach, then we would only modify Guide resource, and its properties,
         * and for that goal we would require to always operate on ids.
         * with standard approach applying patch method would actually have sense.
         */
        $group->put('/{id}', UpdateGuideAction::class);

    });
};
