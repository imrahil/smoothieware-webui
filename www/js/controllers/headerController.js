(function () {
    'use strict';

    angular
        .module('smoothieApp')
        .controller('HeaderCtrl', HeaderCtrl);

    HeaderCtrl.$inject = ['gettextCatalog'];

    function HeaderCtrl(gettextCatalog) {
        var vm = this;

        vm.your_printer_name = "Topweight Hardware";

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

        ////////////////

        function setLanguage(item) {
            vm.languages.current = item;
            gettextCatalog.setCurrentLanguage(item);
        }
    }
})();
