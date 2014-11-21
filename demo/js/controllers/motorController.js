(function () {

    var injectParams = ['$scope', 'dataService', '$window'];

    var MotorCtrl = function ($scope, dataService, $window) {

        $scope.elementId = "";
        $scope.xy_velocity = 3000;
        $scope.z_velocity = 200;

        $scope.homeAxis = function (axis) {
            console.log('Home axis: ' + axis);
        }

        $scope.motorsOff = function () {
            console.log('MotorsOff');

            dataService.runCommand("M18")
                .then(function (result) {
                    console.log('Motors turned off! - Result: ' + result);
                }, function (error) {
                    $window.alert(error.statusText);
                });
        }

        $scope.jogButtonClick = function (cmd)
        {
            console.log('jogButtonClick - ' + cmd);

            dataService.runCommand(cmd)
                .then(function (result) {
                    console.log('Result: ' + result)
                }, function (error) {
                    $window.alert(error.statusText);
                });
        };

        $scope.jogXYClick = function (cmd)
        {
            console.log('jogXYClick - ' + cmd);

            dataService.runCommand("G91 G0 " + cmd + " F" + $scope.xy_velocity + " G90")
                .then(function (result) {
                    console.log('Result: ' + result);
                }, function (error) {
                    $window.alert(error.statusText);
                });
        };

        $scope.jogZClick = function (cmd)
        {
            console.log('jogZClick - ' + cmd);

            dataService.runCommand("G91 G0 " + cmd + " F" + $scope.z_velocity + " G90")
                .then(function (result) {
                    console.log('Result: ' + result);
                }, function (error) {
                    $window.alert(error.statusText);
                });
        };
    };

    MotorCtrl.$inject = injectParams;

    angular.module('smoothieApp').controller('MotorCtrl', MotorCtrl);
}());
