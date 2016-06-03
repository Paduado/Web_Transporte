'use strict';

angular.module('myApp.add_route_polyline', ['ngRoute']).config([
    '$routeProvider', function ($routeProvider)
    {
        $routeProvider.when('/add_route_polyline', {
            templateUrl: 'sections/routes/manage/add_route_polyline/add_route_polyline.html',
            controller: 'add_route_polylineCtrl'
        });
    }
]).controller('add_route_polylineCtrl', function ($scope, $mdDialog, data)
{

    $scope.cancel = function ()
    {
        $mdDialog.cancel();
    };
    setTimeout(function ()
    {

        var mapDiv = document.getElementById('add-route-map');
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

        google.maps.event.addListenerOnce(map, 'idle', function ()
        {
            if (data.route.polyline != "")
            {
                var path = google.maps.geometry.encoding.decodePath(data.route.polyline);
                for (var i = 0; i < path.length; i++)
                {
                    poly.getPath().push(path[i]);
                    var stops = data.route.stops;
                    for (var j = 0; j < stops.length; j++)
                    {

                        if (Math.round(path[i].lat() * 100000) / 100000 == Math.round(stops[j].lat * 100000) / 100000 && Math.round(path[i].lng() * 100000) / 100000 == Math.round(stops[j].lng * 100000) / 100000)
                        {
                            markers[i].isStop = true;
                            markers[i].stopName = stops[j].name;
                            markers[i].setIcon(getIcon(true));
                        }
                    }
                }
                zoomToObject(poly);
            }
        });

        google.maps.event.addListener(poly, 'click', function (e)
        {
            if (e.edge != null)
            {
                poly.getPath().insertAt(e.edge + 1, e.latLng);
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
                isStop: false,
                stopName: ""
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
                $('#info_container').css('max-width', '230px');
                $('#map-cover').show();
                $scope.markerId = marker.m_id;
                $scope.stopName = marker.stopName;
                $scope.isStop = marker.isStop;
                $scope.$digest();

                $scope.acceptInfo = function ()
                {
                    for (var i = 0; i < markers.length; i++)
                    {
                        if ($scope.markerId == markers[i].m_id)
                        {
                            markers[i].isStop = $scope.isStop;
                            markers[i].stopName = $scope.isStop ? $scope.stopName : "";
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
            return isStop ? 'resources/icons/ic_edit_location.svg' : 'resources/icons/ic_add_location.svg';
        }

        $('#map-dialog-body').css('background', '#000');


        function zoomToObject(obj)
        {
            var bounds = new google.maps.LatLngBounds();
            var points = obj.getPath().getArray();
            for (var n = 0; n < points.length; n++)
            {
                bounds.extend(points[n]);
            }
            map.fitBounds(bounds);
        }


        $scope.accept = function ()
        {
            var polyline = google.maps.geometry.encoding.encodePath(poly.getPath());
            var lowResUrl =  "https://maps.googleapis.com/maps/api/staticmap?size=320x240&scale=1&path=color:0xFF0000FF|weight:2|enc:" + polyline;
            var highResUrl = "https://maps.googleapis.com/maps/api/staticmap?size=640x360&scale=2&path=color:0xFF0000FF|weight:2|enc:"+ polyline;
            var stops = [];
            for (var i = 0; i < markers.length; i++)
            {
                if (markers[i].isStop)
                {
                    var stop = {
                        name: markers[i].stopName,
                        lat: markers[i].getPosition().lat(),
                        lng: markers[i].getPosition().lng()
                        //lat:Math.round(markers[i].getPosition().lat()*100000)/100000,
                        //lng:Math.round(markers[i].getPosition().lng()*100000)/100000
                    };
                    stops.push(stop);
                }
            }

            var data = {
                polyline: polyline,
                stops: stops,
                lowResUrl: lowResUrl,
                highResUrl: highResUrl
            };
            
            $mdDialog.hide(data);

        };
    }, 1000);

    $scope.cancelInfo = function ()
    {
        $('#info_container').css('max-width', '0');
        $('#map-cover').hide();
    };


})
;