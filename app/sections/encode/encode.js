angular.module('encode', ['ngRoute']).config([
    '$routeProvider', function ($routeProvider)
    {
        $routeProvider.when('/encode', {
            templateUrl: 'sections/encode/encode.html',
            controller: 'encodeCtrl'
        });
    }
]).controller('encodeCtrl', function ($scope)
{
    $scope.encode = function()
    {
        var cordinates = [];
        var arr = $scope.input.split('0 ');

        for(var i =0; i<arr.length;i++)
        {
            var latlng = arr[i].split(',');

            cordinates.push({
                lat:parseFloat(latlng[1]),
                lng:parseFloat(latlng[0])
            })
        }


        var poly = new google.maps.Polyline({
            path: cordinates,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });


        var encoded = google.maps.geometry.encoding.encodePath(poly.getPath());

        console.log(encoded);


    }
});
