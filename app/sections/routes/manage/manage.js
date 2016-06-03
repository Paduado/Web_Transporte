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

    $scope.isNew = true;
    if($routeParams.route_key != "new")
    {
        $scope.isNew = false;
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
            if($scope.route.type == 2)
                $scope.route.concession_route.route_typeId = parseInt($scope.route.concession_route.route_typeId);
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
                            .textContent($scope.getErrorMessage(response.response_message))
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

            if($scope.route.type == 2)
                $scope.route.concession_route.route_typeId = parseInt($scope.route.concession_route.route_typeId);
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
                            .textContent($scope.getErrorMessage(response.response_message))
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

    $scope.clearImg = function()
    {
        $scope.route.image = "";
        $('#preview').attr('src','');
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
            public_key: localStorage.getItem('public_key')
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

    
    $scope.getErrorMessage = function(message)
    {
        if(message instanceof Object)
        {
            var key = Object.keys(message)[0];
            return key in keys ? keys[key] : key;
        }
        else
        {
            return message;
        }
    };


    var keys =
    {
        "route.key": "Error en el parámetro: Clave mnemotécnica",
        "route.name": "Error en el parámetro: Nombre",
        "route.itinerary": "Error en el parámetro: Itinerario",
        "route.localityId": "Error en el parámetro: Localidad",
        "route.municipalityId": "Error en el parámetro: Minicipio",
        "route.link": "Error en el parámetro: Mapa",
        "route.sizing": "Error en el parámetro: Dimensionamiento",
        "route.notes": "Error en el parámetro: Observaciones",
        "route.vehicle_classId": "Error en el parámetro: Clase de vehículo",
        "route.vehicle_typeId": "Error en el parámetro: Tipo de vehículo",
        "route.vehicle_antiquity": "Error en el parámetro: Antigüedad de vehículo",
        "route.schedule_start": "Error en el parámetro: Inicio",
        "route.schedule_end": "Error en el parámetro: Fin",
        "route.concession_route.length": "Error en el parámetro: Longitud",
        "route.concession_route.duration": "Error en el parámetro: Tiempo de recorrido",
        "route.concession_route.frequency": "Error en el parámetro: Frecuencia",
        "route.concession_route.min_rate": "Error en el parámetro: Tarifa mínima",
        "route.concession_route.max_rate": "Error en el parámetro: Tarifa máxima",
        "route.concession_route.polyline": "Error en el parámetro: Mapa de la ruta",
        "route.concession_route.stops": "La ruta debe de tener al menos una parada",
        "route.site.generator": "Error en el parámetro: Generador",
        "route.site.atractor": "Error en el parámetro: Atractor",
        "route.site.users_benefit": "Error en el parámetro: Usuarios Beneficiados",
        "route.site.frequency": "Error en el parámetro: Frecuencia",
        "route.site.min_rate": "Error en el parámetro: Tarifa mínima",
        "route.site.max_rate": "Error en el parámetro: Tarifa máxima",
        "route.private_route.generator": "Error en el parámetro: Generador",
        "route.private_route.atractor": "Error en el parámetro: Atractor",
        "route.private_route.users_benefit": "Error en el parámetro: Usuarios beneficiados",
        "route.private_route.rate": "Error en el parámetro: Tarífa",
        "route.private_route.concessions": "Error en el parámetro: Concesiones",
        "route.private_route.service_units": "Error en el parámetro: Unidades óptimas para el servicio"

    }
});








