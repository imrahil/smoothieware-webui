(function () {
    'use strict';

    angular
        .module('smoothieApp')
        .controller('HeaderCtrl', HeaderCtrl);

    HeaderCtrl.$inject = ['gettextCatalog', 'localStorageService'];

    function HeaderCtrl(gettextCatalog, localStorageService) {
        var vm = this;

        vm.printerName = localStorageService.get('printerName') || 'Your printer name';

        // Language switcher
        vm.languages = {
            current: gettextCatalog.currentLanguage,
            available: {
                //'de': 'German',
                'en': 'English',
                'pl': 'Polski'
            }
        };

        vm.setLanguage = setLanguage;
        vm.updatePrinterName = updatePrinterName;

        ////////////////

        function setLanguage(item) {
            vm.languages.current = item;
            gettextCatalog.setCurrentLanguage(item);
            localStorageService.set('currentLanguage', vm.languages.current);
        }

        function updatePrinterName() {
            localStorageService.set('printerName', vm.printerName);
        }
    }
})();
