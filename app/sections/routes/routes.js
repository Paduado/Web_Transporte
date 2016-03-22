'use strict';

angular.module('myApp.routes', ['ngRoute']).config([
    '$routeProvider', function ($routeProvider)
    {
        $routeProvider.when('/routes', {
            templateUrl: 'sections/routes/routes.html', controller: 'routesCtrl'
        });
    }
]).controller('routesCtrl', function ($scope,$location)
{
    $scope.routes = [];


    for(var i =0;i<51;i++)
    {
        $scope.routes.push({
            key: Math.floor(Math.random() * (3 - 1 + 1)) + 1,
            schedule: "11:1"+i,
            link: "url.com",
            status: 1,
            type:1
        });
    }

    $scope.routes.push({
        key: 1,
        schedule: "11:1"+i,
        link: "url.com",
        status: 1,
        type:3
    });

    $scope.limit = 5;
    $scope.page = 1;
    $scope.pages = [];
    $scope.filtered = [];
    $scope.prevPage = function()
    {
        if($scope.page > 1)
        {
            $scope.page--;
            //$scope.$digest();
        }
    };
    $scope.nextPage = function()
    {
        if(($scope.page * $scope.limit)<$scope.filtered.length)
        {
            $scope.page++;
            //$scope.$digest();
        }
    };

    $scope.onFilterChange = function()
    {
        $scope.page = 1;


    };


    $scope.getPages = function()
    {
        var count = $scope.filtered.length;
        var pages = count / $scope.limit;
        if(count%pages)
            pages++;
        pages = parseInt(pages);
        $scope.pages = [];
        for(var i=1;i<=pages;i++)
        {
            $scope.pages.push(i);
        }

        return $scope.pages;
    };




    $scope.predicate = '';
    $scope.reverse = false;
    $scope.order = function(predicate)
    {


        if($scope.predicate == predicate && $scope.reverse)
        {
            $scope.predicate = '';
            $scope.reverse = false;
        }
        else if($scope.predicate == predicate && !$scope.reverse)
        {
            $scope.reverse = true;
        }
        else
        {
            $scope.predicate = predicate;
            $scope.reverse = false;
        }


    };


    $scope.isTypeChecked = function(route)
    {
        return ($scope.checkType1? route.key==1 : false) || ($scope.checkType2? route.key==2:false) || ($scope.checkType3? route.key==3:false);
    };


    $scope.go = function(path)
    {
        $location.path(path);
    };
});