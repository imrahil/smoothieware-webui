(function () {

    var injectParams = ['$scope', 'dataService', '$window', '$location'];

    var TempCtrl = function ($scope, dataService, $window, $location) {

        $scope.heaterT0SelectedTemp = 0;
        $scope.heaterT0ActualTemp = "-";
        $scope.heaterT1SelectedTemp = 0;
        $scope.heaterT1ActualTemp = "-";
        $scope.bedSelectedTemp = 0;
        $scope.bedActualTemp = "-";

        $scope.heatOff = function(heater) {
            console.log('HeatOff - heater: ' + heater);

            var ifHeat = (heater != 'bed');
            var type = ifHeat ? 104 : 140;

            if (ifHeat)
            {
                dataService.runCommand(heater);
            }

            dataService.runCommand("M" + type + " S0");
        }

        $scope.heatSet = function(heater, selectedTemp) {
            console.log('HeatSet - heater: ' + heater + ' | temp: ' + selectedTemp);

            var ifHeat = (heater != 'bed');
            var type = ifHeat ? 104 : 140;

            if (ifHeat)
            {
                dataService.runCommand(heater);
            }

            dataService.runCommand("M" + type + " S" + selectedTemp);
        }

        $scope.getTemperatures = function () {
            var loc = $location.host();

            if (loc == "localhost") {
                var rand = Math.floor((Math.random() * 30) * 10 + 1) / 10;
                $scope.heaterT0ActualTemp = (rand + 5) + "°C";
                $scope.heaterT1ActualTemp = (rand + 10) + "°C";
                $scope.bedActualTemp = (rand + 8) + "°C";
            } else {
                dataService.runCommand("M105")
                    .then(function (result_data) {
                        var regex_temp = /(B|T(\d*)):\s*([+]?[0-9]*\.?[0-9]+)?/gi;
                        var result;

                        while ((result = regex_temp.exec(result_data)) !== null) {
                            var tool = result[1];
                            var value = result[3] + "°C";

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
        }
    };

    TempCtrl.$inject = injectParams;

    angular.module('smoothieApp').controller('TempCtrl', TempCtrl);
}());
