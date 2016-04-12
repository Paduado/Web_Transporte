'use strict';
//var webtransporte = "http://transportetuzobus.us-east-1.elasticbeanstalk.com";
var webtransporte = "http://148.239.50.177:8888";
// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'myApp.view1',
    'myApp.login',
    'myApp.routes',
    'myApp.manage',
    'myApp.add_route_polyline',
    'myApp.taxi',
    'myApp.users',
    'myApp.password',
    'sidebarMenu',
    'ngMaterial',
    'md.data.table',
    'ngMessages'
]).config(function ($routeProvider)
    {
        $routeProvider.otherwise({redirectTo: '/routes/2'});

    }
).run(function ($rootScope, $location)
{

    $rootScope.$on("$routeChangeStart", function (event, next)
    {
        if (next.$$route != undefined)
        {
            var path = next.$$route.originalPath;
            if (localStorage.getItem('username') != null)
            {
                if (path == "/login")
                    $location.path("/routes/2");
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
        '50': '#ffffff',
        '100': '#ffffff',
        '200': '#ffffff',
        '300': '#ffffff',
        '400': '#ffffff',
        '500': '#fff',
        '600': '#f2f2f2',
        '700': '#e6e6e6',
        '800': '#d9d9d9',
        '900': '#cccccc',
        'A100': '#ffffff',
        'A200': '#ffffff',
        'A400': '#ffffff',
        'A700': '#bfbfbf'
    };
    $mdThemingProvider.definePalette('customAccent', customAccent);

    $mdThemingProvider.theme('default').primaryPalette('customPrimary').accentPalette('customAccent').warnPalette('red');
}).config(function ($httpProvider)
{
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.withCredentials = true;
    delete $httpProvider.defaults.headers.common["X-Requested-With"];
    $httpProvider.defaults.headers.common["Accept"] = "application/json";
    $httpProvider.defaults.headers.common["Content-Type"] = "application/json";
});
