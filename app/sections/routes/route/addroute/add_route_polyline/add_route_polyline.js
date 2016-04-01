'use strict';

angular.module('myApp.add_route_polyline', ['ngRoute']).config([
    '$routeProvider', function ($routeProvider)
    {
        $routeProvider.when('/add_route_polyline', {
            templateUrl: 'sections/routes/addbusroute/add_route_polyline/add_route_polyline.html',
            controller: 'add_route_polylineCtrl'
        });
    }
]).controller('add_route_polylineCtrl', function ($scope, $mdDialog)
{

    $scope.cancel = function ()
    {
        $mdDialog.cancel();
    };
    setTimeout(function ()
    {

        var mapDiv = document.getElementById('add-route-map');
        var map = new google.maps.Map(mapDiv, {
            center: {lat: 20.6947053, lng: -103.4203145},
            zoom: 15,
            mapTypeControl:false,
            streetViewControl: true,
            zoomControl: true,
            zoomControlOptions: {
                position: google.maps.ControlPosition.LEFT_TOP
            }
        });

        var markers = [];
        var cordinates = [];

        var poly = new google.maps.Polyline({
            path: cordinates,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2,
            editable: true,
            map: map
        });



        map.addListener('click', function (e)
        {
            poly.getPath().push(e.latLng);
        });

        google.maps.event.addListener(poly, 'click', function (e)
        {
            if (e.edge != null)
            {
                poly.getPath().insertAt(e.edge + 1,e.latLng);
            }
        });
        google.maps.event.addListener(poly, 'mousedown', function (e)
        {
            if (e.vertex != null)
            {
                poly.setEditable(false);
                poly.setEditable(true);
            }
        });

        google.maps.event.addListener(poly.getPath(), 'insert_at', function (index)
        {
            var marker = new google.maps.Marker({
                position: poly.getPath().getAt(index),
                map: map,
                draggable: true,
                isStop:false,
                stopName:""
            });
            marker.setIcon(getIcon(marker.isStop));

            markers.splice(index, 0, marker);

            var markersCnt = markers.length;
            for (var i = index; i < markersCnt; i++)
            {
                markers[i].m_id = i;
            }

            google.maps.event.addListener(marker, 'rightclick', function (e)
            {
                poly.getPath().removeAt(marker.m_id);
            });

            google.maps.event.addListener(marker, 'drag', function (e)
            {
                poly.getPath().setAt(marker.m_id, e.latLng);
            });

            google.maps.event.addListener(marker, 'click', function (e)
            {
                $('#info_container').css('max-width','230px');
                $('#map-cover').show();
                $scope.markerId = marker.m_id;
                $scope.stopName = marker.stopName;
                $scope.isStop = marker.isStop;
                $scope.$digest();

                $scope.acceptInfo = function()
                {
                    for(var i=0;i<markers.length;i++)
                    {
                        if($scope.markerId == markers[i].m_id)
                        {
                            markers[i].isStop = $scope.isStop;
                            markers[i].stopName = $scope.isStop?$scope.stopName:"";
                            markers[i].setIcon(getIcon(marker.isStop));
                        }
                    }
                    $scope.cancelInfo();
                };


            });

        });

        google.maps.event.addListener(poly.getPath(), 'remove_at', function (index)
        {
            markers[index].setMap(null);
            markers.splice(index, 1);
            var markersCnt = markers.length;
            for (var i = index; i < markersCnt; i++)
            {
                markers[i].m_id = i;
            }
        });

        function getIcon(isStop)
        {
            return isStop?'resources/icons/ic_edit_location.svg':'resources/icons/ic_add_location.svg';
        }

        $('#map-dialog-body').css('background','#000');



        $scope.accept = function()
        {

            var url = "https://maps.googleapis.com/maps/api/staticmap?size=400x400&path=color:0xFF0000FF|weight:2|enc:"+google.maps.geometry.encoding.encodePath(poly.getPath());
            var stops = [];
            for(var i=0;i<markers.length;i++)
            {
                if(markers[i].isStop)
                {
                    var stop = {
                        name: markers[i].stopName,
                        lat:markers[i].getPosition().lat(),
                        lng:markers[i].getPosition().lng()
                    };
                    stops.push(stop);
                }
            }
            console.log(stops);

            var data ={
                url:url,
                stops:stops
            };

            $mdDialog.hide(url,stops);

        };
    }, 1000);

    $scope.cancelInfo = function()
    {
        $('#info_container').css('max-width','0');
        $('#map-cover').hide();
    };




})
;