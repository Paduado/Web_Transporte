angular.module('loading', ['ngRoute'])
.controller('loadingCtrl', function($scope,title)
{
    $scope.title = title?title:"Cargando";
});