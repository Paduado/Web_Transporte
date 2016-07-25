'use strict';

angular.module('myApp.users', ['ngRoute']).config([
    '$routeProvider', function($routeProvider)
    {
        $routeProvider.when('/users', {
            templateUrl: 'sections/config/users/users.html', controller: 'usersCtrl'
        });
    }
]).controller('usersCtrl', function($scope, $location, $mdDialog)
{

    $scope.users = [];

    $scope.getUsers = function()
    {
        $.post(webtransporte + '/admin/get/users',
            {
                public_key: localStorage.getItem('public_key')
            },
            function(response)
            {
                if(response.response_code == 200)
                {
                    $scope.$apply(function()
                    {
                        $scope.users = response.users;
                    });
                }
                else
                {
                    $mdDialog.show(
                        $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('Error al obtener los usuarios')
                        .ariaLabel('Dialog route error')
                        .ok('Aceptar')
                    );
                }
                console.log(response);
            }, 'json')
        .fail(function()
        {
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

    $scope.getUsers();

    $scope.createUser = function()
    {
        $mdDialog.show({
            templateUrl: 'sections/config/users/usersDlg.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            fullscreen: false,
            controller: function($scope, $mdDialog, $timeout)
            {
                $scope.user = {
                    name: "",
                    email: "",
                    type: "",
                    password: ""
                };

                $scope.userError = false;

                $scope.cancel = function()
                {
                    $mdDialog.cancel();
                };

                $scope.save = function()
                {

                    $scope.user.public_key = localStorage.getItem('public_key');

                    $.post(webtransporte + '/admin/new/user', $scope.user,
                        function(response)
                        {
                            if(response.response_code == 200)
                            {
                                $mdDialog.hide();
                            }
                            else if(response.response_code == 422)
                            {
                                $scope.userError = true;
                                $scope.$digest();
                                $timeout(function()
                                {
                                    $scope.userError = false;
                                }, 4000)
                            }
                            else
                            {
                                $mdDialog.show(
                                    $mdDialog.alert()
                                    .clickOutsideToClose(true)
                                    .title('Error al crear el usuario')
                                    .ariaLabel('Dialog route error')
                                    .ok('Aceptar')
                                );
                            }
                            console.log(response);
                        }, 'json')
                    .fail(function()
                    {
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
            }
        }).then(function()
        {
            $scope.getUsers();
        });


    };

    $scope.editUser = function(user)
    {
        $mdDialog.show({
            templateUrl: 'sections/config/users/editUsersDlg.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            fullscreen: false,
            locals: {
                user: user
            },
            controller: function editUsersDlgCtrl($scope, $mdDialog, user)
            {

                $scope.user = {
                    user_id: user.id,
                    username: user.username,
                    name: user.name,
                    email: user.email,
                    type: user.level
                };

                $scope.userError = false;

                $scope.cancel = function()
                {
                    $mdDialog.cancel();
                };

                $scope.save = function()
                {
                    if($scope.updatePass)
                        $scope.user.password = $scope.password;

                    $scope.user.public_key = localStorage.getItem('public_key');
                    $.post(webtransporte + '/admin/update/user', $scope.user,
                        function(response)
                        {
                            if(response.response_code == 200)
                            {
                                $mdDialog.hide();
                            }
                            else if(response.response_code == 422)
                            {
                                $scope.userError = true;
                                $scope.$digest();
                                $timeout(function()
                                {
                                    $scope.userError = false;
                                }, 4000)
                            }
                            else
                            {
                                $mdDialog.show(
                                    $mdDialog.alert()
                                    .clickOutsideToClose(true)
                                    .title('Error al guardar el usuario')
                                    .ariaLabel('Dialog route error')
                                    .ok('Aceptar')
                                );
                            }
                            console.log(response);
                        }, 'json')
                    .fail(function()
                    {
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

                $scope.delete = function()
                {

                    $.post(webtransporte + '/admin/delete/user',
                        {
                            public_key: localStorage.getItem('public_key'),
                            user_id: $scope.user.user_id
                        },
                        function(response)
                        {
                            if(response.response_code == 200)
                            {
                                $mdDialog.hide();
                            }
                            else
                            {
                                $mdDialog.show(
                                    $mdDialog.alert()
                                    .clickOutsideToClose(true)
                                    .title('Error al eliminar el usuario')
                                    .ariaLabel('Dialog route error')
                                    .ok('Aceptar')
                                );
                            }
                            console.log(response);
                        }
                        ,
                        'json'
                    )
                    .fail(function()
                    {
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
            }
        }).then(function()
        {
            $scope.getUsers();

        });
    };


    $scope.getLevelString = function(level)
    {
        switch(level)
        {
            case "10":
                return "Lectura";
            case "20":
                return "Escritura";
            case "30":
                return "Súper Admin";
        }
    };


});