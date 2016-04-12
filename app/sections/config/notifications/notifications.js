angular.module('myApp.notifications', ['ngRoute']).config([
    '$routeProvider', function ($routeProvider)
    {
        $routeProvider.when('/notifications', {
            templateUrl: 'sections/config/notifications/notifications.html',
            controller: 'notificationsCtrl'
        });
    }
]).controller('notificationsCtrl', function ($scope,$mdDialog)
{
    $scope.sendPush = function()
    {
        $.post(webtransporte + '/admin/send/notification',
            {
                public_key: localStorage.getItem('public_key'),
                body: $scope.body

            }, function (response)
            {
                if (response.response_code == 200)
                {
                    $scope.$apply(function()
                    {
                        $mdDialog.show(
                            $mdDialog.alert()
                                .clickOutsideToClose(true)
                                .title('Notificación enviada')
                                .ariaLabel('Dialog route added')
                                .ok('Aceptar')
                        );
                        $scope.body = '';
                    });
                }
                else
                {
                    $scope.$apply(function()
                    {
                        $mdDialog.show(
                            $mdDialog.alert()
                                .clickOutsideToClose(true)
                                .title('Error al enviar')
                                .ariaLabel('Dialog route added')
                                .ok('Aceptar')
                        );
                    });
                }


            }, 'json')
            .fail(function()
            {
                $scope.$apply(function()
                {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('Error en el servidor')
                            .ariaLabel('Dialog route added')
                            .ok('Aceptar')
                    );
                });
            });
    };
});
