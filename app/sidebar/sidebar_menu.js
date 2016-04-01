/**
 * Created by robertoreym on 27/01/16.
 */
'use strict';

(function ()
{
    var app = angular.module('sidebarMenu', []);
    app.directive('sidebarMenu', function ()
    {
        return {
            restrict: 'E',
            templateUrl: 'sidebar/sidebar-menu.html',
            controller: function ($scope, $location)
            {
                $scope.tab = 1;

                $scope.isTabSelected = function (tab)
                {
                    return (tab == $scope.tab);
                };
                $scope.setTab = function (tab)
                {
                    $scope.tab = tab;
                };
                $scope.go = function (path)
                {
                    $location.path(path);
                };
                $scope.logout = function (path)
                {
                    localStorage.clear();
                    location.reload();
                };
                $('.tree-toggler').click(function ()
                {
                    $(this).parent().children('ul.tree').toggle('blind');
                });

                $scope.isUserLoged = function()
                {
                    return $location.path() != "/login";
                };

                $scope.logout = function()
                {
                    localStorage.clear();
                    $location.path('/login')

                };
            },
            controllerAs: 'sidebarCtrl'
        };
    });
    app.config(function ($logProvider)
    {
        $logProvider.debugEnabled(true);
    });
})();
$(document).ready(function ()
{
    $('.tree-toggler').click(function ()
    {
        $(this).parent().children('ul.tree').toggle(300);
    });
});