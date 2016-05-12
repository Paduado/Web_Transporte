angular.module('myApp.login', ['ngRoute']).config([
    '$routeProvider', function ($routeProvider)
    {
        $routeProvider.when('/login', {
            templateUrl: 'login/login.html',
            controller: 'loginCtrl'
        });
    }
]).controller('loginCtrl', function ($scope, $location, $mdDialog,$interval)
{
    //$('.main_container').addClass('login-background');



    $scope.loading = false;

    $scope.login = function ()
    {
        $scope.loading = true;
        $.post(webtransporte + '/admin/login',
            {
                username: $scope.user,
                password: $scope.password
            },
            function (response)
            {
                $scope.loading = false;
                if (response.response_code == 200)
                {
                    $scope.$apply(function ()
                    {
                        localStorage.setItem('public_key', response.user.public_key);
                        localStorage.setItem('username', response.user.username);
                        localStorage.setItem('name', response.user.name);
                        localStorage.setItem('email', response.user.email);
                        localStorage.setItem('level', response.user.level);

                        //$('.main_container').removeClass('login-background');

                        $location.path('/route');
                        var hearbeat = $interval(function()
                        {
                            $.post(webtransporte + '/admin/heartbeat', {
                                public_key: localStorage.getItem('public_key')
                            }, function(response)
                            {
                                if(response.response_code != 200)
                                {
                                    $scope.logout();
                                    $interval.cancel(hearbeat);
                                }

                            },'json').fail(function()
                            {
                                $scope.logout();
                                $interval.cancel(hearbeat);
                            });
                        }, 10000);
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
            .fail(function ()
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

});
