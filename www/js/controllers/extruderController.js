(function () {

    var injectParams = ['$scope', 'dataService'];

    var ExtruderCtrl = function ($scope, dataService) {

        $scope.filamenLength = 5;
        $scope.velocity = 100;

        $scope.extrude = function (extruder, direction) {
            console.log('Extruder: ' + extruder + ' | length: ' + $scope.filamenLength + ' | speed: ' + $scope.velocity);

            dataService.runCommand(extruder)
                .then(function (result) {
                    console.log('Extruder result: ' + result);
                });

            dataService.runCommand("G91 G0 E" + ($scope.filamenLength * direction) + " F" + $scope.velocity + " G90")
                .then(function (result) {
                    console.log('Command result: ' + result);
                });

        }
    };

    ExtruderCtrl.$inject = injectParams;

    angular.module('smoothieApp').controller('ExtruderCtrl', ExtruderCtrl);
}());
