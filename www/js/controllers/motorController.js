(function () {
    'use strict';

    angular
        .module('smoothieApp')
        .controller('MotorCtrl', MotorCtrl);

    MotorCtrl.$inject = ['DataService'];

    function MotorCtrl(DataService) {
        var vm = this;

        vm.elementId = "";
        vm.xy_velocity = 3000;
        vm.z_velocity = 200;

        vm.homeAxis = homeAxis;
        vm.motorsOff = motorsOff;
        vm.jogButtonClick = jogButtonClick;
        vm.jogXYClick = jogXYClick;
        vm.jogZClick = jogZClick;

        ////////////////

        function homeAxis(axis) {
            console.log('Home axis: ' + axis);
        }

        function motorsOff() {
            console.log('MotorsOff');

            DataService.runCommand("M18")
                .then(function (result) {
                    console.log('Motors turned off! - Result: ' + result);
                }, function (error) {
                    console.error(error.statusText);
                });
        }

        function jogButtonClick(cmd) {
            console.log('jogButtonClick - ' + cmd);

            DataService.runCommand(cmd)
                .then(function (result) {
                    console.log('Result: ' + result);
                }, function (error) {
                    console.error(error.statusText);
                });
        }

        function jogXYClick(cmd) {
            console.log('jogXYClick - ' + cmd);

            DataService.runCommand("G91 G0 " + cmd + " F" + vm.xy_velocity + " G90")
                .then(function (result) {
                    console.log('Result: ' + result);
                }, function (error) {
                    console.error(error.statusText);
                });
        }

        function jogZClick(cmd) {
            console.log('jogZClick - ' + cmd);

            DataService.runCommand("G91 G0 " + cmd + " F" + vm.z_velocity + " G90")
                .then(function (result) {
                    console.log('Result: ' + result);
                }, function (error) {
                    console.error(error.statusText);
                });
        }
    }
}());
