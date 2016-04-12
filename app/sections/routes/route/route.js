'use strict';

angular.module('myApp.routes', ['ngRoute']).config([
    '$routeProvider', function ($routeProvider)
    {
        $routeProvider.when('/route', {
            templateUrl: 'sections/routes/route/route.html', controller: 'routesCtrl'
        });
    }
]).controller('routesCtrl', function ($scope, $mdDialog)
{
    $scope.routes = [];

    function getRoutes()
    {
        $.post(webtransporte + '/admin/get/routes',
            {
                public_key: localStorage.getItem('public_key'),
                route_type:2
            },
            function (response)
            {
                if (response.response_code == 200)
                {
                    $scope.$apply(function ()
                    {
                        $scope.routes = response.routes;

                    });
                }
                else
                {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('Error al obtener las rutas')
                            .ariaLabel('Dialog route error')
                            .ok('Aceptar')
                    );
                }
            }, 'json')
            .fail(function ()
            {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('Error en el servidor')
                        .textContent('Contacte al administrador.')
                        .ariaLabel('Dialog login error')
                        .ok('Aceptar')
                );
            });
    }

    getRoutes();


    $scope.limit = 5;
    $scope.page = 1;
    $scope.pages = [];
    $scope.filtered = [];
    $scope.prevPage = function ()
    {
        if ($scope.page > 1)
        {
            $scope.page--;
        }
    };
    $scope.nextPage = function ()
    {
        if (($scope.page * $scope.limit) < $scope.filtered.length)
        {
            $scope.page++;
        }
    };

    $scope.onFilterChange = function ()
    {
        $scope.page = 1;

    };


    $scope.getPages = function ()
    {
        var count = $scope.filtered.length;
        var pages = count / $scope.limit;
        if (count % pages)
            pages++;
        pages = parseInt(pages);
        $scope.pages = [];
        for (var i = 1; i <= pages; i++)
        {
            $scope.pages.push(i);
        }

        return $scope.pages;
    };


    $scope.predicate = '';
    $scope.reverse = false;
    $scope.order = function (predicate)
    {


        if ($scope.predicate == predicate && $scope.reverse)
        {
            $scope.predicate = '';
            $scope.reverse = false;
        }
        else if ($scope.predicate == predicate && !$scope.reverse)
        {
            $scope.reverse = true;
        }
        else
        {
            $scope.predicate = predicate;
            $scope.reverse = false;
        }


    };


    $scope.enableRoute = function(key,enable)
    {
        $.post(webtransporte + '/admin/enable/route',
            {
                public_key: localStorage.getItem('public_key'),
                route_key:key,
                enable:enable?1:0
            },
            function (response)
            {
                if (response.response_code == 200)
                {
                    getRoutes();
                }
                else
                {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('Error al obtener las rutas')
                            .ariaLabel('Dialog route error')
                            .ok('Aceptar')
                    );
                }
            }, 'json')
            .fail(function ()
            {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('Error en el servidor')
                        .textContent('Contacte al administrador.')
                        .ariaLabel('Dialog login error')
                        .ok('Aceptar')
                );
            });
    };


    $scope.isTypeChecked = function (route)
    {
        return ($scope.checkType1 ? route.type == 1 : false) || ($scope.checkType2 ? route.type == 2 : false) || ($scope.checkType3 ? route.type == 3 : false);
    };


});