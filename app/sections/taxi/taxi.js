angular.module('myApp.taxi', ['ngRoute']).config([
    '$routeProvider', function ($routeProvider)
    {
        $routeProvider.when('/taxi', {
            templateUrl: 'sections/taxi/taxi.html', controller: 'taxiCtrl'
        });
    }
]).controller('taxiCtrl', function ($scope, $mdDialog)
{
    $scope.fees = [{km: 0, amount: 10}];


    $scope.openFeesDialog = function (data)
    {
        $mdDialog.show({
            controller: addfeeCtrl,
            templateUrl: 'sections/taxi/taxiDlg.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            fullscreen: false,
            locals: {
                data: data
            }
        }).then(function (data)
        {
            if (data.index != undefined)
                $scope.fees[data.index] = data.fee;
            else
                $scope.fees.push(data.fee);
        }, function (index)
        {
            if (index != undefined)
            {

                $mdDialog.show(
                    $mdDialog.confirm()
                        .title('¿Desea eliminar esta tarifa?')
                        .ok('Eliminar')
                        .cancel('Cancelar'))
                    .then(function ()
                    {
                        $scope.fees.splice(index, 1);
                    });



            }
        });
    };

    $scope.editFee = function (data)
    {
        $scope.openFeesDialog(data);
    };


    function addfeeCtrl($scope, $mdDialog, data)
    {
        if (data != undefined)
        {
            $scope.km = data.fee.km;
            $scope.amount = data.fee.amount;
            $scope.index = data.index;
            console.log(data);
        }
        else
        {
            $scope.km = "";
            $scope.amount = "";
        }
        $scope.cancel = function (index)
        {
            $mdDialog.cancel(index);
        };

        $scope.save = function ()
        {
            $mdDialog.hide({
                fee: {
                    km: $scope.km,
                    amount: $scope.amount
                },
                index: $scope.index
            });
        };
    }

});