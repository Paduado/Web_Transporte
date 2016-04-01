angular.module('myApp.site', ['ngRoute']).config([
    '$routeProvider', function ($routeProvider)
    {
        $routeProvider.when('/site', {
            templateUrl: 'sections/routes/site/site.html',
            controller: 'siteCtrl'
        });
    }
]).controller('siteCtrl', function ($scope)
{
    $scope.routes = [];


    for(var i =0;i<1000;i++)
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
        link: "padua.com",
        status: 1,
        type:3
    });





//------TABLE--------------------------------------------
    $scope.limit = 5;
    $scope.page = 1;
    $scope.pages = [];
    $scope.filtered = [];
    $scope.prevPage = function()
    {
        if($scope.page > 1)
        {
            $scope.page--;
        }
    };
    $scope.nextPage = function()
    {
        if(($scope.page * $scope.limit)<$scope.filtered.length)
        {
            $scope.page++;
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


});
