'use strict';

angular.module('myApp.add_route_polyline', ['ngRoute']).config([
    '$routeProvider', function ($routeProvider)
    {
        $routeProvider.when('/add_route_polyline', {
            templateUrl: 'sections/add_route_polyline/add_route_polyline.html',
            controller: 'add_route_polylineCtrl'
        });
    }
]).controller('add_route_polylineCtrl', function ($scope)
{
    setTimeout(function ()
    {
        var mapDiv = document.getElementById('add-route-map');
        var map = new google.maps.Map(mapDiv, {
            center: {lat: 20.6947053, lng: -103.4203145},
            zoom: 15
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

        var deleteMenu = new DeleteMenu();

        map.addListener('click', function addLatLng(event)
        {
            poly.getPath().push(event.latLng);

        });

        map.addListener('rightclick', function addLatLng(event)
        {
            var contentString = '<div id="content">'+
                '<div id="siteNotice">'+
                '</div>'+
                '<h1 id="firstHeading" class="firstHeading">Uluru</h1>'+
                '<div id="bodyContent">'+
                '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
                'sandstone rock formation in the southern part of the '+
                'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) '+
                'south west of the nearest large town, Alice Springs; 450&#160;km '+
                '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major '+
                'features of the Uluru - Kata Tjuta National Park. Uluru is '+
                'sacred to the Pitjantjatjara and Yankunytjatjara, the '+
                'Aboriginal people of the area. It has many springs, waterholes, '+
                'rock caves and ancient paintings. Uluru is listed as a World '+
                'Heritage Site.</p>'+
                '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
                'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
                '(last visited June 22, 2009).</p>'+
                '</div>'+
                '</div>';

            var infowindow = new google.maps.InfoWindow({
                content: contentString
            });

            var marker = new google.maps.Marker({
                position: uluru,
                map: map,
                title: 'Uluru (Ayers Rock)'
            });
            marker.addListener('click', function() {
                infowindow.open(map, marker);
            });

        });

        google.maps.event.addListener(poly, 'click', function (e)
        {
            if (e.vertex == undefined)
            {
                return;
            }
            deleteMenu.open(map, poly.getPath(), e.vertex);
            //poly.getPath().removeAt(e.vertex);
        });
        google.maps.event.addListener(poly, 'rightclick', function (e)
        {
            if (e.vertex == undefined)
            {
                return;
            }
            poly.getPath().removeAt(e.vertex);

        });
    }, 1000);


    /**
     * A menu that lets a user delete a selected vertex of a path.
     * @constructor
     */
    function DeleteMenu()
    {
        this.div_ = document.createElement('div');
        this.div_.className = 'delete-menu';
        this.div_.innerHTML = 'Eliminar';

        var menu = this;
        google.maps.event.addDomListener(this.div_, 'click', function ()
        {
            menu.removeVertex();
        });
    }

    DeleteMenu.prototype = new google.maps.OverlayView();

    DeleteMenu.prototype.onAdd = function ()
    {
        var deleteMenu = this;
        var map = this.getMap();
        this.getPanes().floatPane.appendChild(this.div_);

        // mousedown anywhere on the map except on the menu div will close the
        // menu.
        this.divListener_ = google.maps.event.addDomListener(map.getDiv(), 'mousedown', function (e)
        {
            if (e.target != deleteMenu.div_)
            {
                deleteMenu.close();
            }
        }, true);
    };

    DeleteMenu.prototype.onRemove = function ()
    {
        google.maps.event.removeListener(this.divListener_);
        this.div_.parentNode.removeChild(this.div_);

        // clean up
        this.set('position');
        this.set('path');
        this.set('vertex');
    };

    DeleteMenu.prototype.close = function ()
    {
        this.setMap(null);
    };

    DeleteMenu.prototype.draw = function ()
    {
        var position = this.get('position');
        var projection = this.getProjection();

        if (!position || !projection)
        {
            return;
        }

        var point = projection.fromLatLngToDivPixel(position);
        this.div_.style.top = point.y + 'px';
        this.div_.style.left = point.x + 'px';
    };

    /**
     * Opens the menu at a vertex of a given path.
     */
    DeleteMenu.prototype.open = function (map, path, vertex)
    {
        this.set('position', path.getAt(vertex));
        this.set('path', path);
        this.set('vertex', vertex);
        this.setMap(map);
        this.draw();
    };

    /**
     * Deletes the vertex from the path.
     */
    DeleteMenu.prototype.removeVertex = function ()
    {
        var path = this.get('path');
        var vertex = this.get('vertex');

        if (!path || vertex == undefined)
        {
            this.close();
            return;
        }

        path.removeAt(vertex);
        this.close();
    };


});