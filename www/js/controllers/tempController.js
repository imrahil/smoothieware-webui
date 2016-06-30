(function () {
    'use strict';

    angular
        .module('smoothieApp')
        .controller('TempCtrl', TempCtrl);

    TempCtrl.$inject = ['$interval', 'DataService', 'localStorageService'];

    function TempCtrl($interval, DataService, localStorageService) {
        var vm = this;

        vm.secondExtruder = DataService.secondExtruderState();

        vm.labels = [];
        vm.seriesHeater = ["Heater T0"];
        vm.dataHeater = [[]];
        vm.heaterColours = [{
            backgroundColor: "rgba(77, 83, 96, 0.2)",
            borderColor: "rgba(77, 83, 96, 0.5)"
        }];

        vm.seriesBed = ["Bed"];
        vm.dataBed = [[]];
        vm.bedColours = [{
            backgroundColor: "rgba(247, 70, 74, 0.2)",
            borderColor: "rgba(247, 70, 74, 0.5)"
        }];

        Chart.defaults.global.elements.point.radius = 0;
        Chart.defaults.global.legend.position = "bottom";
        Chart.defaults.global.animation.duration = 0;
        Chart.defaults.global.elements.line.borderWidth = 1;

        vm.options = {
            tooltips: {
                enabled: false
            },
            scales: {
                xAxes: [{
                    gridLines: {
                        display: false
                    }
                }]
            }
        };

        vm.localTempInterval = {};
        vm.tempInterval = localStorageService.get('tempInterval') || 3;
        vm.autoCheckEnabled = localStorageService.get('autoCheckEnabled') == "true";

        vm.heaterT0SelectedTemp = 0;
        vm.heaterT0ActualTemp = "-";
        vm.heaterT0DisplayTemp = "";
        vm.heaterT1SelectedTemp = 0;
        vm.heaterT1ActualTemp = "-";
        vm.heaterT1DisplayTemp = "";
        vm.bedSelectedTemp = 0;
        vm.bedActualTemp = "-";
        vm.bedDisplayTemp = "";

        vm.onTimeout = onTimeout;
        vm.heatOff = heatOff;
        vm.heatSet = heatSet;
        vm.handleKeyUp = handleKeyUp;
        vm.onAutoCheckChange = onAutoCheckChange;
        vm.onTempIntervalChange = onTempIntervalChange;
        vm.getTemperatures = getTemperatures;

        activate();

        ////////////////

        function activate() {
            if (vm.autoCheckEnabled) {
                vm.localTempInterval = $interval(vm.onTimeout, vm.tempInterval * 1000);
                vm.getTemperatures();
            }
        }

        function onTimeout() {
            vm.getTemperatures();
        }

        function heatOff(heater) {
            console.log('HeatOff - heater: ' + heater);

            switch (heater) {
                case 'T0':
                    vm.heaterT0SelectedTemp = 0;
                    break;
                case 'T1':
                    vm.heaterT1SelectedTemp = 0;
                    break;
                case 'bed':
                    vm.bedSelectedTemp = 0;
                    break;
            }

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

        function heatSet(heater) {
            console.log('HeatSet - heater: ' + heater);

            var selectedTemp = 0;
            switch (heater) {
                case 'T0':
                    selectedTemp = vm.heaterT0SelectedTemp;
                    break;
                case 'T1':
                    selectedTemp = vm.heaterT1SelectedTemp;
                    break;
                case 'bed':
                    selectedTemp = vm.bedSelectedTemp;
                    break;
            }

            console.log('Temp: ' + selectedTemp);

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

        function handleKeyUp(keyEvent, heater) {
            if (keyEvent.keyCode == 13) {
                vm.heatSet(heater);
            }

            return true;
        }

        function onAutoCheckChange() {
            if (vm.autoCheckEnabled) {
                vm.localTempInterval = $interval(vm.onTimeout, vm.tempInterval * 1000);
                localStorageService.set('autoCheckEnabled', "true");

                vm.getTemperatures();
            } else {
                if (angular.isDefined(vm.localTempInterval))
                    $interval.cancel(vm.localTempInterval);
                localStorageService.set('autoCheckEnabled', "false");
            }
        }

        function onTempIntervalChange() {
            localStorageService.set('tempInterval', vm.tempInterval);

            if (angular.isDefined(vm.localTempInterval))
                $interval.cancel(vm.localTempInterval);

            vm.localTempInterval = $interval(vm.onTimeout, vm.tempInterval * 1000);
        }

        function getTemperatures() {
            DataService.runCommand("M105")
                .then(function (result_data) {
                    //console.log('Result: ' + result_data);
                    DataService.broadcastCommand(result_data);

                    var regex_temp = /(B|T(\d*)):\s*([+]?[0-9]*\.?[0-9]+)? (\/)([+]?[0-9]*\.?[0-9]+)?/gi;
                    var result;

                    while ((result = regex_temp.exec(result_data)) !== null) {
                        var tool = result[1];
                        var value = result[3] + "°C";
                        value += " | " + result[5] + "°C";

                        if (tool == "T") {
                            vm.heaterT0ActualTemp = result[3];
                            vm.heaterT0DisplayTemp = value;
                        }
                        else if (tool == "T1") {
                            vm.heaterT1ActualTemp = result[3];
                            vm.heaterT1DisplayTemp = value;
                        }
                        if (tool == "B") {
                            vm.bedActualTemp = Number(result[3]);
                            vm.bedDisplayTemp = value;
                        }
                    }

                    if (vm.labels.length) {
                        vm.labels = vm.labels.slice(1);
                        vm.dataHeater[0] = vm.dataHeater[0].slice(1);
                        vm.dataBed[0] = vm.dataBed[0].slice(1);
                    }

                    while (vm.labels.length < 20) {
                        vm.labels.push('');
                        vm.dataHeater[0].push(vm.heaterT0ActualTemp);
                        vm.dataBed[0].push(vm.bedActualTemp);
                    }
                }, function (error) {
                    console.error(error.statusText);
                });
        }
    }
}());
