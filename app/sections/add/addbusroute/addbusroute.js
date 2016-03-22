'use strict';

angular.module('myApp.addbusroute', ['ngRoute']).config([
    '$routeProvider', function ($routeProvider)
    {
        $routeProvider.when('/add/busroute', {
            templateUrl: 'sections/add/addbusroute/addbusroute.html',
            controller: 'addbusrouteCtrl'
        });
    }
]).controller('addbusrouteCtrl', function ($scope,$mdDialog)
{
    $scope.addPolyline = function()
    {
        $mdDialog.show({
            controller: 'add_route_polylineCtrl',
            templateUrl: 'sections/add_route_polyline/add_route_polyline.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            fullscreen: false
        });
    };



});
