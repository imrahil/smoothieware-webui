'use strict';

/* Controllers */
angular.module('smoothieApp.controllers', [])

    .controller('BaseCtrl', function ($scope, gettextCatalog)
    {
        // Language switcher
        $scope.languages = {
            current: gettextCatalog.currentLanguage,
            available: {
                'de': 'German',
                'pl': 'Polski',
                'en': 'English'
            }
        };

        $scope.$watch('languages.current', function (lang)
        {
            if (!lang)
            {
                return;
            }

            gettextCatalog.setCurrentLanguage(lang);
        });
    });
