'use strict';

angular.module('myApp.password', ['ngRoute']).config([
    '$routeProvider', function($routeProvider)
    {
        $routeProvider.when('/password', {
            templateUrl: 'sections/config/password/password.html', controller: 'passwordCtrl'
        });
    }
]).controller('passwordCtrl', function($scope,$mdDialog)
{
    $scope.update = function()
    {
        $.post(webtransporte + '/admin/update/password', {
            public_key:localStorage.getItem('public_key'),
            old_password:$scope.currentPass,
            new_password:$scope.newPass
        },function(response)
        {
            if(response.response_code == 200)
            {
                $scope.$apply(function()
                {
                    $scope.currentPass = '';
                    $scope.newPass = '';
                    $scope.newPass2 = '';
                    $mdDialog.show(
                        $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('Contraseña actualizada')
                        .ariaLabel('Dialog login error')
                        .ok('Aceptar')
                    );
                });

            }
            else{
                $scope.$apply(function()
                {
                    $scope.currentPass = '';
                    $scope.newPass = '';
                    $scope.newPass2 = '';
                    $mdDialog.show(
                        $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('No se pudo actualizar la contraseña')
                        .ariaLabel('Dialog login error')
                        .ok('Aceptar')
                    );
                });
            }
        },'json')
    };
});