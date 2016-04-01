angular.module('myApp.private', ['ngRoute']).config([
    '$routeProvider', function ($routeProvider)
    {
        $routeProvider.when('/private', {
            templateUrl: 'sections/routes/private/private.html',
            controller: 'privateCtrl'
        });
    }
]).controller('privateCtrl', function ($scope)
{

});
