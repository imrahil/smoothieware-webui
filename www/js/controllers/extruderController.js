(function () {
    'use strict';

    angular
        .module('smoothieApp')
        .controller('ExtruderCtrl', ExtruderCtrl);

    ExtruderCtrl.$inject = ['DataService'];

    function ExtruderCtrl(DataService) {
        var vm = this;

        vm.secondExtruder = DataService.secondExtruderState();

        vm.filamenLength = 5;
        vm.velocity = 100;

        vm.onSecondExtruderSupportChange = onSecondExtruderSupportChange;
        vm.extrude = extrude;

        ////////////////

        function onSecondExtruderSupportChange() {
            DataService.updateSecondExtruder();
        }

        function extrude(extruder, direction) {
            console.log('Extruder: ' + extruder + ' | length: ' + vm.filamenLength + ' | speed: ' + vm.velocity);

            DataService.runCommand(extruder)
                .then(function (result) {
                    console.log('Extruder result: ' + result);
                });

            DataService.runCommand("G91 G0 E" + (vm.filamenLength * direction) + " F" + vm.velocity + " G90")
                .then(function (result) {
                    console.log('Command result: ' + result);
                });

        }
    }
}());
