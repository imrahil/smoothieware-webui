'use strict';

/* App Module */
var smoothieApp = angular.module('smoothieApp', [
    'smoothieApp.controllers',
    'smoothieApp.services',
    'ui.bootstrap',
    'gettext'
]);

smoothieApp.run(function (gettextCatalog) {
    gettextCatalog.setCurrentLanguage('pl');
    gettextCatalog.debug = true;
});