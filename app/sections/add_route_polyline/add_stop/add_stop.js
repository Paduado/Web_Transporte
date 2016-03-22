angular.module('myApp.add_stop', ['ngRoute'])
    .controller('add_stopCtrl', function ($scope, $mdBottomSheet)
    {
        $scope.save = function()
        {
            $mdBottomSheet.hide("ok");
        }
    });