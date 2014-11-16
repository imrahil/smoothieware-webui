(function () {

    var injectParams = ['$scope', 'dataService', '$window'];

    var ExtruderCtrl = function ($scope, dataService, $window) {

        $scope.filamenLength = 5;
        $scope.velocity = 100;

        $scope.extrude = function (extruder, direction) {
            console.log('Extruder: ' + extruder + ' | length: ' + $scope.filamenLength + ' | speed: ' + $scope.velocity);

            dataService.runCommand(extruder);
            dataService.runCommand("G91 G0 E" + ($scope.filamenLength * direction) + " F" + $scope.velocity + " G90");

        }
    };

    ExtruderCtrl.$inject = injectParams;

    angular.module('smoothieApp').controller('ExtruderCtrl', ExtruderCtrl);
}());
