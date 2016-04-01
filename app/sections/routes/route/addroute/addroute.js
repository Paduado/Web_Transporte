
angular.module('myApp.addroute', ['ngRoute']).config([
    '$routeProvider', function ($routeProvider)
    {
        $routeProvider.when('/add/route', {
            templateUrl: 'sections/routes/route/addroute/addroute.html',
            controller: 'addrouteCtrl'
        });
    }
]).controller('addrouteCtrl', function ($scope, $mdDialog)
{
    $scope.route = {};
    $scope.addPolyline = function ()
    {
        $mdDialog.show({
            controller: 'add_route_polylineCtrl',
            templateUrl: 'sections/routes/route/addroute/add_route_polyline/add_route_polyline.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            fullscreen: false
        }).then(function (url, stops)
        {
            $scope.route.link = url;
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
                    $('#preview').attr('src', e.target.result);
                };

                reader.readAsDataURL(this.files[0]);
            }
        });
    };


});
