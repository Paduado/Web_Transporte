angular.module('myApp.addprivate', ['ngRoute']).config([
    '$routeProvider', function ($routeProvider)
    {
        $routeProvider.when('/add/private', {
            templateUrl: 'sections/routes/private/addprivate/addprivate.html',
            controller: 'addprivateCtrl'
        });
    }
]).controller('addprivateCtrl', function ($scope)
{

});
