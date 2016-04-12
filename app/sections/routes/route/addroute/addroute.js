angular.module('myApp.addroute', ['ngRoute']).config([
    '$routeProvider', function ($routeProvider)
    {
        $routeProvider.when('/add/route', {
            templateUrl: 'sections/routes/route/addroute/addroute.html',
            controller: 'addrouteCtrl'
        });
    }
]).controller('addrouteCtrl', function ($scope, $mdDialog,$location)
{
    $scope.route = {};
    $scope.route.type = 2;
    $scope.states = [];
    $scope.municipalities = [];
    $scope.localities = [];
    $scope.vehicles = [];

    $scope.route.concession_route = {};
    $scope.route.concession_route.mapslink = "";
    $scope.route.concession_route.polyline = "";
    $scope.route.concession_route.stops = [];

    $.post(webtransporte + '/admin/get/states', {
        public_key: localStorage.getItem('public_key')
    }, function (response)
    {
        if (response.response_code == 200)
        {
            $scope.$apply(function ()
            {
                $scope.states = response.states;
            });
        }
    });

    $.post(webtransporte + '/admin/get/municipalities', {
        public_key: localStorage.getItem('public_key')
    }, function (response)
    {
        if (response.response_code == 200)
        {
            $scope.$apply(function ()
            {
                $scope.municipalities = response.municipalities;
            });
        }
    });

    $scope.getLocalities = function(municipalityId)
    {
        $scope.localityId = "";
        $.post(webtransporte + '/admin/get/localities', {
            public_key: localStorage.getItem('public_key'),
            municipalityId:municipalityId
        }, function (response)
        {
            if (response.response_code == 200)
            {
                $scope.$apply(function ()
                {
                    $scope.localities = response.localities;
                });
            }
        });
    };

    $.post(webtransporte + '/admin/get/vehicles', {
        public_key: localStorage.getItem('public_key')
    }, function (response)
    {
        if (response.response_code == 200)
        {
            $scope.$apply(function ()
            {
                $scope.vehicles = response.vehicles;
            });
        }
    });

    $scope.addPolyline = function ()
    {
        $mdDialog.show({
            controller: 'add_route_polylineCtrl',
            templateUrl: 'sections/routes/route/addroute/add_route_polyline/add_route_polyline.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            fullscreen: false,
            locals:{
                data:{
                    route:$scope.route.concession_route
                }
            }
        }).then(function (data)
        {
            $scope.route.link = data.url;
            $scope.route.concession_route.mapslink = data.url;
            $scope.route.concession_route.polyline = data.polyline;
            $scope.route.concession_route.stops = data.stops;
        });
    };


    $scope.selectFile = function ()
    {
        $('#file').click();

        $('#file').off('change');

        $('#file').on('change', function ()
        {
            if (this.files && this.files[0])
            {
                var reader = new FileReader();

                reader.onload = function (e)
                {
                    $scope.route.image = e.target.result;
                    $('#preview').attr('src', e.target.result);
                };

                reader.readAsDataURL(this.files[0]);
            }
        });
    };



    $scope.saveRoute = function()
    {
        $.post(webtransporte + '/admin/new/route',
        {
            public_key: localStorage.getItem('public_key'),
            route:JSON.stringify($scope.route)
        }, function (response)
        {
            if (response.response_code == 200)
            {

                $scope.$apply(function ()
                {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('Ruta Agregada')
                            .ariaLabel('Dialog route added')
                            .ok('Aceptar')
                    );
                    $location.path('/route');
                });
            }
        },'json');
    };


    $scope.roadChanged = function()
    {
        $scope.route.concession_route.road = parseInt($scope.route.concession_route.road);
    };

    $scope.groundChanged = function()
    {
        $scope.route.concession_route.ground = parseInt($scope.route.concession_route.ground);
    };


});
