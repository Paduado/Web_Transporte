'use strict';

angular.module('myApp.password', ['ngRoute']).config([
    '$routeProvider', function ($routeProvider)
    {
        $routeProvider.when('/password', {
            templateUrl: 'sections/config/password/password.html', controller: 'passwordCtrl'
        });
    }
]).controller('passwordCtrl', function ($scope,$location)
{

});