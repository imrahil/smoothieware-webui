(function () {
    'use strict';

    angular
        .module('smoothieApp')
        .controller('TempCtrl', TempCtrl);

    TempCtrl.$inject = ['$interval', 'DataService'];

    function TempCtrl($interval, DataService) {
        var vm = this;

        vm.heaterT0SelectedTemp = 0;
        vm.heaterT0ActualTemp = "-";
        vm.heaterT1SelectedTemp = 0;
        vm.heaterT1ActualTemp = "-";
        vm.bedSelectedTemp = 0;
        vm.bedActualTemp = "-";

        vm.onTimeout = onTimeout;
        vm.heatOff = heatOff;
        vm.heatSet = heatSet;
        vm.getTemperatures = getTemperatures;

        activate();

        ////////////////

        function activate() {
            $interval(vm.onTimeout, 3000);

            vm.getTemperatures();
        }

        function onTimeout() {
            vm.getTemperatures();
        }

        function heatOff(heater) {
            console.log('HeatOff - heater: ' + heater);

            var isHeater = (heater != 'bed');
            var type = isHeater ? 104 : 140;

            var command = "M" + type + " S0";

            if (isHeater)
            {
                command += " " + heater;
            }

            DataService.runCommand(command)
                .then(function (result) {
                    //console.log('Result: ' + result);

                    vm.getTemperatures();
                });
        }

        function heatSet(heater, selectedTemp) {
            console.log('HeatSet - heater: ' + heater + ' | temp: ' + selectedTemp);

            var isHeater = (heater != 'bed');
            var type = isHeater ? 104 : 140;

            var command = "M" + type + " S" + selectedTemp;

            if (isHeater)
            {
                command += " " + heater;
            }

            DataService.runCommand(command)
                .then(function (result) {
                    //console.log('Result: ' + result);

                    vm.getTemperatures();
                });
        }

        function getTemperatures() {
            DataService.runCommand("M105")
                .then(function (result_data) {
                    //console.log('Result: ' + result_data);
                    DataService.broadcastItem(result_data);

                    var regex_temp = /(B|T(\d*)):\s*([+]?[0-9]*\.?[0-9]+)? (\/)([+]?[0-9]*\.?[0-9]+)?/gi;
                    var result;

                    while ((result = regex_temp.exec(result_data)) !== null) {
                        var tool = result[1];
                        var value = result[3] + "°C";
                        value += " | " + result[5] + "°C";

                        if (tool == "T") {
                            vm.heaterT0ActualTemp = value;
                        }
                        else if (tool == "T1") {
                            vm.heaterT1ActualTemp = value;
                        }
                        if (tool == "B") {
                            vm.bedActualTemp = value;
                        }
                    }
                }, function (error) {
                    console.error(error.statusText);
                });
        }
    }
}());
