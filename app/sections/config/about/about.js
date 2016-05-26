angular.module('about', ['ngRoute'])
.config(function($routeProvider)
{
    $routeProvider.when('/about', {
        templateUrl: 'sections/config/about/about.html',
        controller: 'aboutCtrl'
    });
})
.controller('aboutCtrl', function($scope)
{
});