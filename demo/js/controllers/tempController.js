(function () {

    var injectParams = ['$scope', '$timeout', 'dataService', '$window'];

    var TempCtrl = function ($scope, $timeout, dataService, $window) {

        $scope.heaterT0SelectedTemp = 0;
        $scope.heaterT0ActualTemp = "-";
        $scope.heaterT1SelectedTemp = 0;
        $scope.heaterT1ActualTemp = "-";
        $scope.bedSelectedTemp = 0;
        $scope.bedActualTemp = "-";

        var counter = 0;

        $scope.onTimeout = function () {
            counter++;

            if (counter == 5) {
                $scope.getTemperatures();
                counter = 0;
            }

            mytimeout = $timeout($scope.onTimeout, 1000);
        }

        var mytimeout = $timeout($scope.onTimeout, 1000);

        $scope.heatOff = function(heater) {
            console.log('HeatOff - heater: ' + heater);

            var isHeater = (heater != 'bed');
            var type = isHeater ? 104 : 140;

            var command = "M" + type + " S0";

            if (isHeater)
            {
                command += " " + heater;
            }

            dataService.runCommand(command)
                .then(function (result) {
                    console.log('Result: ' + result);

                    $scope.getTemperatures();
                });
        }

        $scope.heatSet = function(heater, selectedTemp) {
            console.log('HeatSet - heater: ' + heater + ' | temp: ' + selectedTemp);

            var isHeater = (heater != 'bed');
            var type = isHeater ? 104 : 140;

            var command = "M" + type + " S" + selectedTemp;

            if (isHeater)
            {
                command += " " + heater;
            }

            dataService.runCommand(command)
                .then(function (result) {
                    console.log('Result: ' + result);

                    $scope.getTemperatures();
                });
        }

        $scope.getTemperatures = function () {
            dataService.runCommand("M105")
                .then(function (result_data) {
                    var regex_temp = /(B|T(\d*)):\s*([+]?[0-9]*\.?[0-9]+)? (\/)([+]?[0-9]*\.?[0-9]+)?/gi;
                    var result;

                    while ((result = regex_temp.exec(result_data)) !== null) {
                        var tool = result[1];
                        var value = result[3] + "°C";
                        value += " | " + result[5] + "°C";

                        if (tool == "T") {
                            $scope.heaterT0ActualTemp = value;
                        }
                        else if (tool == "T1") {
                            $scope.heaterT1ActualTemp = value;
                        }
                        if (tool == "B") {
                            $scope.bedActualTemp = value;
                        }
                    }
                }, function (error) {
                    $window.alert(error.statusText);
                });
        }
    };

    TempCtrl.$inject = injectParams;

    angular.module('smoothieApp').controller('TempCtrl', TempCtrl);
}());
