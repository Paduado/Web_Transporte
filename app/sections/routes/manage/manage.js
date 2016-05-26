angular.module('myApp.manage', ['ngRoute']).config([
    '$routeProvider', function($routeProvider)
    {
        $routeProvider.when('/manage/:type/:route_key', {
            templateUrl: 'sections/routes/manage/manage.html',
            controller: 'manageCtrl'
        });
    }
]).controller('manageCtrl', function($scope, $routeParams, $mdDialog, $location)
{
    $scope.route = {};

    // $scope.test = function()
    // {
    //     navigator.bluetooth.requestDevice({
    //         filters: [
    //             {services: ['00001101-0000-1000-8000-00805f9b34fb']}
    //         ]
    //     })
    //     .then(function(device)
    //     {
    //         return device.gatt.connect();
    //     })
    //     .then(function(a)
    //     {
    //         console.log(a);
    //     })
    //     .catch(function(e)
    //     {
    //         console.log(e);
    //     });
    // };


    switch($routeParams.type)
    {
        case "route":
            $scope.route.type = 2;
            $scope.route.concession_route = {};
            $scope.route.concession_route.polyline = "";
            $scope.route.concession_route.stops = [];
            break;
        case "site":
            $scope.route.type = 1;
            $scope.route.site = {};
            break;
        case "private":
            $scope.route.type = 3;
            $scope.route.private_route = {};
            break;
        default:
            $location.path('/route');
    }


    if($routeParams.route_key != "new")
    {
        $.post(webtransporte + '/admin/get/route',
            {
                public_key: localStorage.getItem('public_key'),
                route_key: $routeParams.route_key

            }, function(response)
            {
                if(response.response_code == 200)
                {
                    $scope.route = response.route;
                    $scope.vehicleKey = $scope.route.vehicle_typeId + "-" + $scope.route.vehicle_classId;
                    $('#preview').attr('src', $scope.route.image);
                    $scope.$digest();

                    $scope.getLocalities(response.route.municipalityId);
                }

            }, 'json');
    }

    getSelectsContent();


    /********************************
     polyline modal
     *********************************/

    $scope.addPolyline = function()
    {
        $mdDialog.show({
            controller: 'add_route_polylineCtrl',
            templateUrl: 'sections/routes/manage/add_route_polyline/add_route_polyline.html',
            parent: angular.element(document.body),
            escapeToClose: false,
            fullscreen: false,
            locals: {
                data: {
                    route: $scope.route.concession_route
                }
            }
        }).then(function(data)
        {
            $scope.route.link = data.highResUrl;
            $scope.route.concession_route.polyline = data.polyline;
            $scope.route.concession_route.stops = data.stops;

            toDataUrl(data.lowResUrl, function(result)
            {
                $scope.route.lowResMap = result;
            });
            toDataUrl(data.highResUrl, function(result)
            {
                $scope.route.highResMap = result;
            });
        });
    };

    $scope.addLoc = function()
    {
        $mdDialog.show({
            controller: 'add_locCtrl',
            templateUrl: 'sections/routes/manage/add_loc/add_loc.html',
            parent: angular.element(document.body),
            escapeToClose: false,
            fullscreen: false
        }).then(function(data)
        {
            $scope.route.link = data.highResUrl;
            toDataUrl(data.lowResUrl, function(result)
            {
                $scope.route.lowResMap = result;
            });
            toDataUrl(data.highResUrl, function(result)
            {
                $scope.route.highResMap = result;
            });

        });
    };


    function toDataUrl(url, callback)
    {
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = function()
        {
            var reader = new FileReader();
            reader.onloadend = function()
            {
                callback(reader.result);
            };
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.send();
    }


    /********************************
     top buttons
     *********************************/

    $scope.saveRoute = function()
    {
        if($routeParams.route_key == "new")
        {
            $.post(webtransporte + '/admin/new/route',
                {
                    public_key: localStorage.getItem('public_key'),
                    route: JSON.stringify($scope.route)
                }, function(response)
                {
                    if(response.response_code == 200)
                    {
                        $scope.$apply(function()
                        {
                            $mdDialog.show(
                                $mdDialog.alert()
                                .clickOutsideToClose(true)
                                .title($scope.route.type == 2 ? 'Ruta Agregada' : $scope.route.type == 1 ? 'Sitio Agregado' : 'Privado Agregado')
                                .ariaLabel('Dialog route added')
                                .ok('Aceptar')
                            );
                            $location.path('/routes/' + $scope.route.type);
                        });
                    }
                    else if(response.response_code == 400)
                    {
                        $mdDialog.show(
                            $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('Error al guardar')
                            .textContent('Error en el parámetro: ' + $scope.translateKey(Object.keys(response.response_message)[0]))
                            .ariaLabel('Alguno de los parámetros es inválido')
                            .ok('Aceptar')
                        );
                    }
                    else
                    {
                        $scope.$apply(function()
                        {
                            $mdDialog.show(
                                $mdDialog.alert()
                                .clickOutsideToClose(true)
                                .title('Error al guardar')
                                .ariaLabel('Alguno de los parámetros es inválido')
                                .textContent('Alguno de los parámetros es inválido')
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
                        .title('Error al guardar')
                        .ariaLabel('Alguno de los parámetros es inválido')
                        .textContent('Alguno de los parámetros es inválido')
                        .ok('Aceptar')
                    );
                });
            });
        }
        else
        {
            $scope.route.type = $scope.getRouteType();
            $.post(webtransporte + '/admin/update/route',
                {
                    public_key: localStorage.getItem('public_key'),
                    route_key: $routeParams.route_key,
                    route: JSON.stringify($scope.route)
                }, function(response)
                {
                    if(response.response_code == 200)
                    {

                        $scope.$apply(function()
                        {
                            $mdDialog.show(
                                $mdDialog.alert()
                                .clickOutsideToClose(true)
                                .title($scope.route.type == 2 ? 'Ruta Guardada' : $scope.route.type == 1 ? 'Sitio Guardado' : 'Privado Guardado')
                                .ariaLabel('Dialog route added')
                                .ok('Aceptar')
                            );
                            $location.path('/routes/' + $scope.route.type);
                        });
                    }
                    else if(response.response_code == 400)
                    {
                        $mdDialog.show(
                            $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('Error al guardar')
                            .textContent('Error en el parámetro: ' + $scope.translateKey(Object.keys(response.response_message)[0]))
                            .ariaLabel('Alguno de los parámetros es inválido')
                            .ok('Aceptar')
                        );
                    }
                    else
                    {
                        $scope.$apply(function()
                        {
                            $mdDialog.show(
                                $mdDialog.alert()
                                .clickOutsideToClose(true)
                                .title('Error al guardar')
                                .ariaLabel('Alguno de los parámetros es inválido')
                                .textContent('Alguno de los parámetros es inválido')
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
                        .title('Error al guardar')
                        .ariaLabel('Alguno de los parámetros es inválido')
                        .textContent('Alguno de los parámetros es inválido')
                        .ok('Aceptar')
                    );
                });
            });
        }

    };


    /********************************
     route params
     *********************************/
    $scope.routeTypeEquals = function(type)
    {
        return $routeParams.type == type;
    };

    $scope.isNewRoute = function()
    {
        return $routeParams.route_key == "new"
    };
    $scope.getRouteType = function()
    {
        switch($routeParams.type)
        {
            case 'route':
                return 2;
            case 'site':
                return 1;
            case 'private':
                return 3;
        }
    };


    /********************************
     image
     *********************************/

    $scope.selectFile = function()
    {
        $('#file').click();

        $('#file').off('change');

        $('#file').on('change', function()
        {
            if(this.files && this.files[0])
            {
                var reader = new FileReader();

                reader.onload = function(e)
                {
                    $('#preview').attr('src', e.target.result);

                    $scope.route.image = e.target.result;
                    $scope.$digest();


                };

                reader.readAsDataURL(this.files[0]);
            }
        });
    };


    /********************************
     get selects content
     *********************************/


    function getSelectsContent()
    {
        $.post(webtransporte + '/admin/get/states', {
            public_key: localStorage.getItem('public_key')
        }, function(response)
        {
            if(response.response_code == 200)
            {
                $scope.$apply(function()
                {
                    $scope.states = response.states;
                });
            }
        });


        $.post(webtransporte + '/admin/get/municipalities', {
            public_key: localStorage.getItem('public_key'),
        }, function(response)
        {
            if(response.response_code == 200)
            {
                $scope.$apply(function()
                {
                    $scope.municipalities = response.municipalities;
                });
            }
        });

        $.post(webtransporte + '/admin/get/vehicles', {
            public_key: localStorage.getItem('public_key')
        }, function(response)
        {
            if(response.response_code == 200)
            {
                $scope.$apply(function()
                {

                    $scope.vehicles = {};
                    response.vehicles.forEach(function(vehicle)
                    {
                        $scope.vehicles[(vehicle.id + "-" + vehicle.class)] = vehicle;
                    });


                });
            }
        });


    }

    $scope.getLocalities = function(municipalityId)
    {
        $.post(webtransporte + '/admin/get/localities', {
            public_key: localStorage.getItem('public_key'),
            municipalityId: municipalityId
        }, function(response)
        {
            if(response.response_code == 200)
            {
                $scope.$apply(function()
                {
                    $scope.localities = response.localities;
                });
            }
        });
    };


    /********************************
     service units
     *********************************/

    $scope.chipsChanged = function()
    {
        console.log($scope.route.private_route.service_units);
    };


    /********************************
     form validation
     *********************************/

    $scope.isFormValid = function()
    {
        return $scope.routeForm.$valid;
    };


    $scope.filterVehicles = function(vehicles, classId)
    {
        var result = {};
        angular.forEach(vehicles, function(vehicle, key)
        {
            if(vehicle.class == classId)
            {
                result[key] = vehicle;
            }
        });
        return result;
    };


    $scope.translateKey = function(key)
    {
        return key in keys ? keys[key] : key;
    };

    var keys =
    {
        "route.key": "Clave mnemotécnica",
        "route.name": "Nombre",
        "route.itinerary": "Itinerario",
        "route.localityId": "Localidad",
        "route.municipalityId": "Minicipio",
        "route.link": "Mapa",
        "route.sizing": "Dimensionamiento",
        "route.notes": "Observaciones",
        "route.vehicle_classId": "Clase de vehículo",
        "route.vehicle_typeId": "Tipo de vehículo",
        "route.vehicle_antiquity": "Antigüedad de vehículo",
        "route.schedule_start": "Inicio",
        "route.schedule_end": "Fin",
        "route.concession_route.length": "Longitud",
        "route.concession_route.duration": "Tiempo de recorrido",
        "route.concession_route.frequency": "Frecuencia",
        "route.concession_route.min_rate": "Tarifa mínima",
        "route.concession_route.max_rate": "Tarifa máxima",
        "route.concession_route.polyline": "Mapa de la ruta",
        "route.concession_route.stops": "Paradas",
        "route.site.generator": "Generador",
        "route.site.atractor": "Atractor",
        "route.site.users_benefit": "Usuarios Beneficiados",
        "route.site.frequency": "Frecuencia",
        "route.site.min_rate": "Tarifa mínima",
        "route.site.max_rate": "Tarifa máxima",
        "route.private_route.generator": "Generador",
        "route.private_route.atractor": "Atractor",
        "route.private_route.users_benefit": "Usuarios beneficiados",
        "route.private_route.rate": "Tarífa",
        "route.private_route.concessions": "Concesiones",
        "route.private_route.service_units": "Unidades óptimas para el servicio"

    }
});








