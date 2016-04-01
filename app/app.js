'use strict';
var webtransporte = "http://transportetuzobus.us-east-1.elasticbeanstalk.com";
// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'myApp.view1',
    'myApp.login',
    'myApp.routes',
    'myApp.addroute',
    'myApp.add_route_polyline',
    'myApp.site',
    'myApp.addsite',
    'myApp.private',
    'myApp.addprivate',
    'myApp.taxi',
    'myApp.users',
    'myApp.password',
    'sidebarMenu',
    'ngMaterial',
    'md.data.table'
]).config(function ($routeProvider)
    {
        $routeProvider.otherwise({redirectTo: '/route'});

    }
).run(function ($rootScope, $location)
{

    $rootScope.$on("$routeChangeStart", function (event, next)
    {
        if(next.$$route != undefined)
        {
            var path = next.$$route.originalPath;
            if (localStorage.getItem('username') != null)
            {
                if(path == "/login")
                    $location.path("/route");
            }
            else
            {
                if (path != "/login")
                    $location.path("/login");
            }
        }
    });
}).config(function ($mdThemingProvider)
{
    var customPrimary = {
        '50': '#6ddc84',
        '100': '#59d772',
        '200': '#44d261',
        '300': '#31cc50',
        '400': '#2cb848',
        '500': '#27A340',
        '600': '#228e38',
        '700': '#1d7a30',
        '800': '#186528',
        '900': '#135120',
        'A100': '#82e195',
        'A200': '#96e6a7',
        'A400': '#abebb8',
        'A700': '#0e3c18',
        'contrastDefaultColor': 'light'
    };
    $mdThemingProvider.definePalette('customPrimary', customPrimary);

    var customAccent = {
        '50': '#737373',
        '100': '#666666',
        '200': '#595959',
        '300': '#4d4d4d',
        '400': '#404040',
        '500': '#333',
        '600': '#262626',
        '700': '#1a1a1a',
        '800': '#0d0d0d',
        '900': '#000000',
        'A100': '#808080',
        'A200': '#8c8c8c',
        'A400': '#999999',
        'A700': '#000000'
    };

    $mdThemingProvider.definePalette('customAccent', customAccent);

    $mdThemingProvider.theme('default').primaryPalette('customPrimary').accentPalette('customAccent').warnPalette('red');
}).config(function($httpProvider)
{
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.withCredentials = true;
    delete $httpProvider.defaults.headers.common["X-Requested-With"];
    $httpProvider.defaults.headers.common["Accept"] = "application/json";
    $httpProvider.defaults.headers.common["Content-Type"] = "application/json";
});
