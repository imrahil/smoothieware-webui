'use strict';

/* Controllers */
angular.module('smoothieApp.controllers', [])

    .controller('BaseCtrl', function ($scope, gettextCatalog)
    {
        $scope.your_printer_name = "Topweight Hardware";

        // Language switcher
        $scope.languages = {
            current: gettextCatalog.currentLanguage,
            available: {
                'de': 'German',
                'en': 'English',
                'pl': 'Polski'
            }
        };

        $scope.setLanguage = function (item)
        {
            $scope.languages.current = item;
            gettextCatalog.setCurrentLanguage(item);
        };
    });
