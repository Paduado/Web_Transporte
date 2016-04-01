angular.module('myApp.addsite', ['ngRoute']).config([
    '$routeProvider', function ($routeProvider)
    {
        $routeProvider.when('/add/site', {
            templateUrl: 'sections/routes/site/addsite/addsite.html',
            controller: 'addsiteCtrl'
        });
    }
]).controller('addsiteCtrl', function ($scope)
{

});
