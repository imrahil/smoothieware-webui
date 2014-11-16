(function () {

    var injectParams = ['$scope', 'dataService'];

    var TempCtrl = function ($scope, dataService) {

        $scope.getTemperatures = function () {
            dataService.runCommand("M105").then(function (result) {
                var regex_temp = /(B|T(\d*)):\s*([+]?[0-9]*\.?[0-9]+)?/gi;

                while ((result = regex_temp.exec(data)) !== null)
                {
                    var tool = result[1];
                    var value = result[3];

                    if (tool == "T")
                    {
                        $("#heat_actual_t0").html(value + "&deg;C");
                    }
                    else if (tool == "T1")
                    {
                        $("#heat_actual_t1").html(value + "&deg;C");
                    }
                    if (tool == "B")
                    {
                        $("#heat_actual_bed").html(value + "&deg;C");
                    }
                }

            });
        }
    };

    TempCtrl.$inject = injectParams;

    angular.module('smoothieApp').controller('TempCtrl', TempCtrl);
}());
