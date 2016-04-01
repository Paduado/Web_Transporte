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
    $.post(webtransporte + '/admin/get/routes',
        {
            public_key: localStorage.getItem('public_key')
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
            console.log(response);
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

    $scope.limit = 5;
    $scope.page = 1;
    $scope.pages = [];
    $scope.filtered = [];
    $scope.prevPage = function ()
    {
        if ($scope.page > 1)
        {
            $scope.page--;
            //$scope.$digest();
        }
    };
    $scope.nextPage = function ()
    {
        if (($scope.page * $scope.limit) < $scope.filtered.length)
        {
            $scope.page++;
            //$scope.$digest();
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
        return ($scope.checkType1 ? route.route_type == 1 : false) || ($scope.checkType2 ? route.route_type == 2 : false) || ($scope.checkType3 ? route.route_type == 3 : false);
    };


});