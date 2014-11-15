angular.module('gettext').run(['gettextCatalog', function (gettextCatalog) {
/* jshint -W100 */
    gettextCatalog.setStrings('de', {"Hello World!":"Herzlich willkommen!"});
    gettextCatalog.setStrings('pl', {"Hello World!":"Witaj świecie!"});
/* jshint +W100 */
}]);