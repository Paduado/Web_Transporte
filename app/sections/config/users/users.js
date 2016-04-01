'use strict';

angular.module('myApp.users', ['ngRoute']).config([
    '$routeProvider', function ($routeProvider)
    {
        $routeProvider.when('/users', {
            templateUrl: 'sections/config/users/users.html', controller: 'usersCtrl'
        });
    }
]).controller('usersCtrl', function ($scope, $location, $mdDialog)
{

    $scope.users = [];
    $.post(webtransporte + '/admin/get/users',
        {
            public_key: localStorage.getItem('public_key')
        },
        function (response)
        {
            if (response.response_code == 200)
            {
                $scope.$apply(function ()
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
        .fail(function ()
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
    $scope.openUsersDlg = function (data)
    {
        $mdDialog.show({
            controller: usersDlgCtrl,
            templateUrl: 'sections/config/users/usersDlg.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            fullscreen: false,
            locals: {
                data: data
            }
        }).then(function (data)
        {
            if (data.index != undefined)
                $scope.users[data.index] = data.user;
            else
            {
                data.user.public_key = localStorage.getItem('publick_key');
                $.post(webtransporte + '/admin/new/users',data.user,
                    function (response)
                    {
                        if (response.response_code == 200)
                        {

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
                    .fail(function ()
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
                //$scope.users.push(data.user);
            }

        }, function (index)
        {
            if (index != undefined)
            {

                $mdDialog.show(
                    $mdDialog.confirm()
                        .title('¿Desea eliminar este usuario?')
                        .ok('Eliminar')
                        .cancel('Cancelar'))
                    .then(function ()
                    {
                        $scope.users.splice(index, 1);
                    });



            }
        });
    };

    $scope.editUser = function (data)
    {
        $scope.openUsersDlg(data);
    };


    function usersDlgCtrl($scope, $mdDialog, data)
    {
        if (data != undefined)
        {
            $scope.user = {
                id: data.user.id,
                name: data.user.name,
                mail: data.user.mail,
                type: data.user.type,
                password: data.user.password
            };
            $scope.index = data.index;
            console.log(data);
        }
        else
        {
            $scope.user = {
                id: "",
                name: "",
                mail: "",
                type: "",
                password:""
            }
        }
        $scope.cancel = function (index)
        {
            $mdDialog.cancel(index);
        };

        $scope.save = function ()
        {
            $mdDialog.hide({
                user: $scope.user,
                index: $scope.index
            });
        };
    }
});