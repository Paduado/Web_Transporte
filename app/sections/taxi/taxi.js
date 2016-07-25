angular.module('myApp.taxi', ['ngRoute']).config([
    '$routeProvider', function($routeProvider)
    {
        $routeProvider.when('/taxi', {
            templateUrl: 'sections/taxi/taxi.html', controller: 'taxiCtrl'
        });
    }
]).controller('taxiCtrl', function($scope, $mdDialog)
{
    $scope.rates = [];

    $scope.getRates = function()
    {
        $.post(webtransporte + '/admin/get/cab_rates', {
            public_key: localStorage.getItem('public_key')
        }, function(response)
        {
            if(response.response_code == 200)
            {

                $scope.rates = response.rates;
                $scope.$digest();
            }
            else
            {
                $mdDialog.show(
                    $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title('Error al obtener las tarifas')
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


    $scope.getRates();
    $scope.openRatesDialog = function(rate)
    {
        $mdDialog.show({
            templateUrl: 'sections/taxi/taxiDlg.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            fullscreen: false,
            locals: {
                rate: rate
            },
            controller: function($scope, $mdDialog, rate)
            {
                if(rate != undefined)
                {
                    $scope.cabRateID = rate.id;
                    $scope.kms = parseFloat(rate.kms);
                    $scope.rate = parseFloat(rate.rate);
                    $scope.isNew = false;
                    $scope.isDefault = $scope.kms === 0;
                }
                else
                {
                    $scope.isNew = true;
                }
                $scope.cancel = function()
                {
                    $mdDialog.cancel();
                };

                $scope.create = function()
                {

                    $.post(webtransporte + '/admin/create/cab_rate', {
                        public_key: localStorage.getItem('public_key'),
                        kms:$scope.kms,
                        rate:$scope.rate
                    }, function(response)
                    {
                        if(response.response_code == 200)
                        {
                            $mdDialog.hide();
                        }
                    }, 'json');
                };

                $scope.save = function()
                {
                    $.post(webtransporte + '/admin/update/cab_rate', {
                        public_key: localStorage.getItem('public_key'),
                        cabRateID:$scope.cabRateID,
                        kms:$scope.kms,
                        rate:$scope.rate
                    }, function(response)
                    {
                        if(response.response_code == 200)
                        {
                            $mdDialog.hide();
                        }
                    }, 'json');
                };

                $scope.delete = function()
                {
                    $.post(webtransporte + '/admin/delete/cab_rate', {
                        public_key: localStorage.getItem('public_key'),
                        cabRateID:$scope.cabRateID
                    }, function(response)
                    {
                        if(response.response_code == 200)
                        {
                            $mdDialog.hide();
                        }
                    }, 'json');
                };


            }
        }).then(function()
        {
            $scope.getRates();
        });
    };

    $scope.editRate = function(rate)
    {
        $scope.openRatesDialog(rate);
    };


});