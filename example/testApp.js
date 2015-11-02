(function () {
    'use strict';

    /**
     * @ngdoc overview
     * @name app.cms:app
     * @description
     * the main module of the cms application
     */
    angular.module('testApp', ['favourites'])
    .config(function (favouritesProvider) {
        favouritesProvider.setHeadline('MyFavs');
        favouritesProvider.setBgColor('#00a66e');
    })
    .controller('testAppCtrl', ['$log', '$scope', function ($log, $scope) {
        $scope.link = ['https://easir.com/', 'https://docs.angularjs.org/api', 'https://www.oculus.com/en-us/rift/#oculus-touch'];
    }]);

})();