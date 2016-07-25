'use strict';

angular.module('myApp.add_route_polyline', ['ngRoute']).config([
    '$routeProvider', function($routeProvider)
    {
        $routeProvider.when('/add_route_polyline', {
            templateUrl: 'sections/routes/manage/add_route_polyline/add_route_polyline.html',
            controller: 'add_route_polylineCtrl'
        });
    }
]).controller('add_route_polylineCtrl', function($scope, $mdDialog, data)
{

    $scope.cancel = function()
    {
        $mdDialog.cancel();
    };
    setTimeout(function()
    {

        /** Init Variables **/

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

        var poly = new google.maps.Polyline({
            path: [],
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2,
            editable: true,
            suppressUndo: true,
            map: map
        });


        /** Map ready event **/


        google.maps.event.addListenerOnce(map, 'idle', function()
        {
            if(data.route.polyline != "")
            {
                var path = google.maps.geometry.encoding.decodePath(data.route.polyline);
                path.forEach(function(p)
                {
                    poly.getPath().push(p)
                });
                // poly.setPath(path);
                var stops = data.route.stops;
                var painted = 0;
                for(var i = 0; i < stops.length; i++)
                {
                    if(stops[i].lat != undefined)
                    {
                        var stopData = getStopData(stops[i]);
                        var latLng = stopData.latLng;
                        var index = stopData.index;
                    }

                    else
                    {
                        var latLng = path[stops[i].index];
                        var index = stops[i].index;
                    }


                    if(latLng)
                    {

                        var marker = new google.maps.Marker({
                            position: latLng,
                            map: map,
                            isStop: true,
                            stopName: stops[i].name,
                            icon: 'resources/icons/ic_edit_location.svg',
                            index: index
                        });
                        markers.push(marker);

                        painted++;
                    }
                    else console.log('failed at: ' + i);
                }

                console.log('painted: ' + painted + ' of: ' + stops.length);

                zoomToObject(poly);
            }
        });


        function getStopData(stop)
        {
            var path = poly.getPath();
            var tolerance = .00005;
            while(1)
            {
                loop:
                for(var i = 0; i < path.length; i++)
                {
                    var latDiff = Math.abs(path.getAt(i).lat() - stop.lat);
                    var lngDiff = Math.abs(path.getAt(i).lng() - stop.lng);

                    if(latDiff <= tolerance && lngDiff <= tolerance)
                    {
                        for(var j = 0; j < markers.length; j++)
                        {
                            if(markers[j].index == i)
                            {
                                continue loop;
                            }
                        }


                        return {latLng: path.getAt(i), index: i};
                    }
                }
                tolerance *= 2;
            }
        }


        /** Map listeners **/



        map.addListener('click', function(e)
        {
            poly.getPath().push(e.latLng);
        });


        // google.maps.event.addListener(poly, 'click', function (e)
        // {
        //     if (e.edge != null)
        //     {
        //         poly.getPath().insertAt(e.edge + 1, e.latLng);
        //     }
        // });

        google.maps.event.addListener(poly, 'rightclick', function(e)
        {
            if(e.vertex != null)
            {
                poly.getPath().removeAt(e.vertex);
            }

        });
        google.maps.event.addListener(poly, 'click', function(e)
        {
            // if (e.vertex != null)
            // {
            //     poly.setEditable(false);
            //     poly.setEditable(true);
            // }

            if(e.vertex != null)
            {
                $('#info_container').css('max-width', '230px');
                $('#map-cover').show();

                var isStop = false;
                var stopName = "";
                for(var i = 0; i < markers.length; i++)
                {
                    if(markers[i].index == e.vertex)
                    {
                        isStop = true;
                        stopName = markers[i].stopName;
                        break;
                    }
                }


                $scope.stopName = stopName;
                $scope.isStop = isStop;
                $scope.$digest();

                $scope.acceptInfo = function()
                {
                    if($scope.isStop && isStop)
                    {
                        markers[i].stopName = $scope.stopName;
                    }
                    else if($scope.isStop && !isStop)
                    {
                        var marker = new google.maps.Marker({
                            position: e.latLng,
                            map: map,
                            isStop: true,
                            stopName: $scope.stopName,
                            icon: 'resources/icons/ic_edit_location.svg',
                            index: e.vertex
                        });
                        markers.push(marker);
                    }
                    else if(!$scope.isStop && isStop)
                    {
                        markers[i].setMap(null);

                        markers.splice(i, 1);
                    }
                    // for (var i = 0; i < markers.length; i++)
                    // {
                    //     if ($scope.markerId == markers[i].m_id)
                    //     {
                    //         markers[i].isStop = $scope.isStop;
                    //         markers[i].stopName = $scope.isStop ? $scope.stopName : "";
                    //         markers[i].setIcon(getIcon(marker.isStop));
                    //     }
                    // }
                    $scope.cancelInfo();
                };
            }


        });


        // google.maps.event.addListener(poly.getPath(), 'insert_at', function (index)
        // {
        // var marker = new google.maps.Marker({
        //     position: poly.getPath().getAt(index),
        //     map: map,
        //     draggable: true,
        //     isStop: false,
        //     stopName: ""
        // });
        // marker.setIcon(getIcon(marker.isStop));
        //
        // markers.splice(index, 0, marker);
        //
        // var markersCnt = markers.length;
        // for (var i = index; i < markersCnt; i++)
        // {
        //     markers[i].m_id = i;
        // }

        // google.maps.event.addListener(marker, 'rightclick', function (e)
        // {
        //     poly.getPath().removeAt(marker.m_id);
        // });


        // google.maps.event.addListener(marker, 'drag', function (e)
        // {
        //     poly.getPath().setAt(marker.m_id, e.latLng);
        // });


        // google.maps.event.addListener(marker, 'click', function (e)
        // {
        //     $('#info_container').css('max-width', '230px');
        //     $('#map-cover').show();
        //     $scope.markerId = marker.m_id;
        //     $scope.stopName = marker.stopName;
        //     $scope.isStop = marker.isStop;
        //     $scope.$digest();
        //
        //     $scope.acceptInfo = function ()
        //     {
        //         for (var i = 0; i < markers.length; i++)
        //         {
        //             if ($scope.markerId == markers[i].m_id)
        //             {
        //                 markers[i].isStop = $scope.isStop;
        //                 markers[i].stopName = $scope.isStop ? $scope.stopName : "";
        //                 markers[i].setIcon(getIcon(marker.isStop));
        //             }
        //         }
        //         $scope.cancelInfo();
        //     };
        //
        //
        // });

        // });

        google.maps.event.addListener(poly.getPath(), 'set_at', function(index)
        {
            for(var i = 0; i < markers.length; i++)
            {
                if(markers[i].index == index)
                {
                    markers[i].setPosition(poly.getPath().getAt(index));
                    break;
                }
            }
        });

        google.maps.event.addListener(poly.getPath(), 'remove_at', function(index)
        {
            for(var i = 0; i < markers.length; i++)
            {
                if(markers[i].index == index)
                {
                    markers[i].setMap(null);
                    markers.splice(i, 1);
                    i--;
                }
                else if(markers[i].index > index)
                {
                    markers[i].index -= 1;
                }
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
            for(var n = 0; n < points.length; n++)
            {
                bounds.extend(points[n]);
            }
            map.fitBounds(bounds);
        }


        $scope.accept = function()
        {
            var polyline = google.maps.geometry.encoding.encodePath(poly.getPath());
            var lowResUrl = "https://maps.googleapis.com/maps/api/staticmap?size=320x240&scale=1&path=color:0xFF0000FF|weight:2|enc:" + polyline;
            var highResUrl = "https://maps.googleapis.com/maps/api/staticmap?size=640x360&scale=2&path=color:0xFF0000FF|weight:2|enc:" + polyline;
            var stops = [];
            for(var i = 0; i < markers.length; i++)
            {
                if(markers[i].isStop)
                {
                    stops.push({
                        name: markers[i].stopName,
                        index: markers[i].index
                    });
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

    $scope.cancelInfo = function()
    {
        $('#info_container').css('max-width', '0');
        $('#map-cover').hide();
    };


})
;