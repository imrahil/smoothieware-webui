(function () {

    var injectParams = ['$scope', 'gettextCatalog'];

    var HeaderCtrl = function ($scope, gettextCatalog) {
        $scope.your_printer_name = "Topweight Hardware";

        // Language switcher
        $scope.languages = {
            current: gettextCatalog.currentLanguage,
            available: {
                //'de': 'German',
                'en': 'English',
                'pl': 'Polski'
            }
        };

        $scope.setLanguage = function (item)
        {
            $scope.languages.current = item;
            gettextCatalog.setCurrentLanguage(item);
        };
    };

    HeaderCtrl.$inject = injectParams;

    angular.module('smoothieApp').controller('HeaderCtrl', HeaderCtrl);
}());
