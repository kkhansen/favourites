(function () {
    'use strict';

    /**
     * @ngdoc overview
     * @name favourites
     * @description
     * module with a directive that makes you store favourite urls in localstorage
     */
    angular.module('favourites', [])
    .controller('favCtrl', ['$log', '$scope', function ($log, $scope) {
        $scope.hello = ['https://easir.com/', 'https://docs.angularjs.org/api', 'https://www.oculus.com/en-us/rift/#oculus-touch'];
    }])
    .config(function (favouritesProvider) {
        favouritesProvider.setHeadline('MyFavs');
        favouritesProvider.setBgColor('#00a66e');
    })
    .directive('favourites', ['$localstorage', 'favourites', function ($localstorage, favourites) {
        return {
            restrict: 'EA',
            require: "ngModel",
            template: '<div id="favs">'+
                        '<div class="header" data-ng-style="hbgc" data-ng-show="!add">' +
                            '<div class="headertxt" >{{header}}</div>' +
                            '<div class="fright" data-ng-click="clearfav()" data-ng-mouseenter="lblClear=true" data-ng-mouseleave="lblClear=false" data-ng-init="lblClear=false">/' +
                                '<span class="lbl" ng-if="lblClear">reset</span>' +
                            '</div>' +
                            '<div class="fright" data-ng-click="add=true" data-ng-mouseenter="lblAdd=true" data-ng-mouseleave="lblAdd=false" data-ng-init="lblAdd=false">+' +
                            '<span class="lbl" ng-if="lblAdd">add</span>' +
                            '</div>' +
                            '</div>' +
                        '<div class="header" data-ng-style="hbgc" data-ng-show="add">' +
                            '<input class="headertxt" data-ng-model="addwww"></input>' +
                            '<div class="fright" data-ng-if="addwww" data-ng-click="addfav()">add</div>' +
                            '<div class="fright" data-ng-click="addnot()">x</div>' +
                        '</div>' +
                        '<div class="urls">' +
                            '<ul>' +
                                '<li class="headertxt" data-ng-repeat="(glob, value) in favUrls track by $index" data-ng-mouseenter="remove=true" data-ng-mouseleave="remove=false" data-ng-init="remove=false">' +
                                    '<div data-ng-click="edit(value.name)">' +
                                        '<a data-ng-href="{{value.link}}" target="_blank">{{value.name}}</a>' +
                                        '<span class="remove" data-ng-if="remove" data-ng-click="removefav($index)">x</span>' +
                                    '</div>' +
                                '</li>' +
                            '</ul>' +
                        '</div>' +
                      '</div>',
            link: function (scope, elem, attr, ngModel) {

                scope.addwww = '';

                // from provider
                scope.hbgc = { 'background-color': favourites.BgColor };
                scope.header = favourites.headline;

                // init
                ngModel.$render = function () {

                    var ls = $localstorage.getObject('favs');
                    
                    if (Object.keys(ls).length>0) {
                        scope.favUrls = ls;
                        updateModel();
                    } else {

                        scope.favUrls = UrlsToObjs(ngModel.$viewValue);

                        // save to local storage
                        $localstorage.setObject('favs', scope.favUrls);
                        $localstorage.setObject('favsorg', scope.favUrls); // save for reset
                    }
                };

                //---------------------------------------------------------------
                // clear favourites
                scope.clearfav = function () {
                    scope.favUrls = $localstorage.getObject('favsorg');
                    $localstorage.setObject('favs', scope.favUrls);

                    // update model
                    updateModel();
                }

                //---------------------------------------------------------------
                // add new favourite
                scope.addfav = function () {
                    // create new urlobj
                    var o = {};
                    o.link = scope.addwww;
                    o.name = extractDomain(scope.addwww);
                    scope.favUrls.push(o);

                    scope.add = false;
                    scope.addwww = '';

                    // save in local storage
                    $localstorage.setObject('favs', scope.favUrls);

                    // update model
                    updateModel();
                }

                //---------------------------------------------------------------
                // remove favourite
                scope.removefav = function (index) {

                    scope.favUrls.splice(index, 1);

                    // save in local storage
                    $localstorage.setObject('favs', scope.favUrls);

                    // update model
                    updateModel();
                }

                //---------------------------------------------------------------
                // don't add favourite
                scope.addnot = function() {
                    scope.add = false;
                    scope.addwww = '';
                }

                //---------------------------------------------------------------
                // update model
                function updateModel() {
                    var a = [];
                    angular.forEach(scope.favUrls, function (val, key) {
                        a.push(val.link);
                    })
                    ngModel.$setViewValue(a);
                }

                //---------------------------------------------------------------
                // converts urls to objects 
                function UrlsToObjs(value) {
                    var urls = [];
                    angular.forEach(value, function (val, key) {
                        var o = {};
                        o.link = val;
                        o.name = extractDomain(val);
                        urls.push(o);
                    })
                    return urls;
                }

                //---------------------------------------------------------------
                // extract domain urls
                function extractDomain(url) {
                    var domain;
                    //find & remove protocol (http, ftp, etc.) and get domain
                    if (url.indexOf("://") > -1) {
                        domain = url.split('/')[2];
                    }
                    else {
                        domain = url.split('/')[0];
                    }

                    //find & remove port number
                    domain = domain.split(':')[0];

                    return domain;
                }
            }
        }
    }])
    .factory('$localstorage', ['$window', function ($window) {
        return {
            set: function (key, value) {
                $window.localStorage[key] = value;
            },
            get: function (key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            setObject: function (key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function (key) {
                return JSON.parse($window.localStorage[key] || '{}');
            }
        }
    }])
    .provider("favourites", function () {
        var hl = 'Favourites';
        var hbgcolor = '#000000';
        return {
            setHeadline: function (value) {
                hl = value;
            },
            setBgColor: function (value) {
                hbgcolor = value;
            },
            $get: function () {
                return {
                    headline: hl,
                    BgColor: hbgcolor
                };
            }
        };
    })
})();