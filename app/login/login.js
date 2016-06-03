angular.module('myApp.login', ['ngRoute']).config([
    '$routeProvider', function($routeProvider)
    {
        $routeProvider.when('/login', {
            templateUrl: 'login/login.html',
            controller: 'loginCtrl'
        });
    }
]).controller('loginCtrl', function($scope, $location, $mdDialog, $interval, $rootScope)
{
    //$('.main_container').addClass('login-background');

    // $scope.user = '';
    // $scope.password = '';

    $scope.loading = false;

    $scope.login = function()
    {
        $scope.loading = true;
        $.post(webtransporte + '/admin/login',
            {
                username: $scope.user,
                password: $scope.password
            },
            function(response)
            {
                $scope.loading = false;
                if(response.response_code == 200)
                {
                    $scope.$apply(function()
                    {
                        localStorage.setItem('public_key', response.user.public_key);
                        localStorage.setItem('username', response.user.username);
                        localStorage.setItem('name', response.user.name);
                        localStorage.setItem('email', response.user.email);
                        localStorage.setItem('level', response.user.level);

                        //$('.main_container').removeClass('login-background');

                        $location.path('/route');
                    });

                }
                else
                {
                    $mdDialog.show(
                        $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('Error al iniciar sesión')
                        .textContent('Verifique su usuario o contraseña.')
                        .ariaLabel('Dialog login error')
                        .ok('Aceptar')
                    );
                }
            }, 'json')
        .fail(function()
        {
            $scope.loading = false;
            $mdDialog.show(
                $mdDialog.alert()
                .clickOutsideToClose(true)
                .title('Error en el servidor')
                .textContent('Contacte al administrador.')
                .ariaLabel('Dialog login error')
                .ok('Aceptar')
            );
        });


    };


    $scope.forgotPass = function()
    {

        if($scope.user != '')
        {
            $mdDialog.show(
                $mdDialog.confirm()
                .clickOutsideToClose(true)
                .title('Recuperar')
                .textContent('Se enviara un correo al correo del usuario: ' + $scope.user)
                .ariaLabel('Dialog login error')
                .ok('Enviar')
                .cancel('cancelar')
            ).then(function()
            {
                $.post(webtransporte + '/admin/recover/password', {
                    username: $scope.user
                });
            });
        }



    };

});
