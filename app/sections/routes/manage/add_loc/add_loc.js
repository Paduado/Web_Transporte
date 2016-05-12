angular.module('myApp.add_loc', ['ngRoute'])
.controller('add_locCtrl', function($scope,$mdDialog)
{
    $scope.cancel = function ()
    {
        $mdDialog.cancel();
    };
    setTimeout(function ()
    {

        var mapDiv = document.getElementById('add-loc-map');
        var map = new google.maps.Map(mapDiv, {
            center: {lat: 20.098799, lng: -98.761757},
            zoom: 14,
            mapTypeControl: false,
            streetViewControl: true,
            zoomControl: true,
            draggableCursor: "crosshair",
            zoomControlOptions: {
                position: google.maps.ControlPosition.LEFT_TOP
            }
        });

        var marker = new google.maps.Marker({
            position: {lat: 20.098799, lng: -98.761757},
            map: map,
            draggable: true
        });


        map.addListener('click', function (e)
        {
            marker.setPosition(e.latLng);
        });
        


        $scope.accept = function ()
        {
            var url = "https://maps.googleapis.com/maps/api/staticmap?size=400x400&zoom=15&markers="+marker.getPosition().lat()+","+marker.getPosition().lng();
            $mdDialog.hide(url);

        };
    }, 1000);

});