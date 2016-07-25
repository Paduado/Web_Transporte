'use strict';

angular.module('myApp.routes', ['ngRoute']).config([
    '$routeProvider', function ($routeProvider)
    {
        $routeProvider.when('/routes/:route_type', {
            templateUrl: 'sections/routes/routes.html', controller: 'routesCtrl'
        });
    }
]).controller('routesCtrl', function ($scope, $mdDialog, $routeParams)
{
    $scope.userLevel = localStorage.getItem('level');

    switch ($routeParams.route_type)
    {
        case "1":
            $scope.routeType = "site";
            $scope.title = "SITIOS";
            break;
        case "2":
            $scope.routeType = "route";
            $scope.title = "RUTAS";
            break;
        case "3":
            $scope.routeType = "private";
            $scope.title = "PRIVADOS";
            
            break;
    }
    $scope.routes = [];

    function getRoutes()
    {
        $mdDialog.show({
            controller: 'loadingCtrl',
            templateUrl: 'loading/loading.html',
            locals:{title:"Cargando..."}
        });
        $.post(webtransporte + '/admin/get/routes',
            {
                public_key: localStorage.getItem('public_key'),
                route_type: $routeParams.route_type
            },
            function (response)
            {
                $mdDialog.hide();
                if (response.response_code == 200)
                {

                    $scope.routes = response.routes;
                    $scope.$digest();

                }
                else
                {
                    $scope.$apply(function ()
                    {
                        $mdDialog.show(
                            $mdDialog.alert()
                                .clickOutsideToClose(true)
                                .title('Error al obtener las rutas')
                                .ariaLabel('Dialog route error')
                                .ok('Aceptar')
                        );
                    });

                }
            }, 'json')
            .fail(function ()
            {
                $mdDialog.hide();
                $scope.$apply(function ()
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
            });
    }

    getRoutes();





    $scope.enableRoute = function (key, enable)
    {
        $.post(webtransporte + '/admin/enable/route',
            {
                public_key: localStorage.getItem('public_key'),
                route_key: key,
                enable: enable ? 1 : 0
            },
            function (response)
            {
                if (response.response_code == 200)
                {
                    getRoutes();
                }
                else
                {
                    $scope.$apply(function ()
                    {
                        $mdDialog.show(
                            $mdDialog.alert()
                                .clickOutsideToClose(true)
                                .title('Error al obtener las rutas')
                                .ariaLabel('Dialog route error')
                                .ok('Aceptar')
                        );
                    });

                }
            }, 'json')
            .fail(function ()
            {
                $scope.$apply(function ()
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
            });
    };



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


    $scope.isTypeChecked = function (route)
    {
        return $scope.routeType != 'route'
            || ($scope.checkType1 ? route.concession_route.route_typeId == 1 : false)
            || ($scope.checkType2 ? route.concession_route.route_typeId == 2 : false)
            || ($scope.checkType3 ? route.concession_route.route_typeId == 3 : false);
    };


    $scope.getTypeString = function(type)
    {
        switch(type)
        {
            case '1':
                return "Autobús";
            case '2':
                return "Colector";
            case '3':
                return "TuzoBús";
        }
    };


});