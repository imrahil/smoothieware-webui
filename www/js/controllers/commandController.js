(function () {
    'use strict';

    angular
        .module('smoothieApp')
        .controller('CommandCtrl', CommandCtrl);

    CommandCtrl.$inject = ['$scope', 'DataService'];

    function CommandCtrl($scope, DataService) {
        var vm = this;

        vm.log = [];

        vm.command = "";
        vm.commandOutput = "";
        vm.cmdHistory = [];
        vm.cmdHistoryIdx = -1;

        vm.autoscrollEnabled = true;
        vm.filterOutput = false;

        vm.sendCommand = sendCommand;
        vm.handleKeyDown = handleKeyDown;
        vm.handleKeyUp = handleKeyUp;
        vm.clear = clear;
        vm.onFilterChange = onFilterChange;
        vm.updateOutput = updateOutput;

        activate();

        ////////////////

        function activate() {
            DataService.registerOutput(vm);
        }

        function sendCommand() {
            if (!vm.command) {
                return;
            }

            console.log('Command: ' + vm.command);

            DataService.runCommand(vm.command)
                .then(function (result_data) {
                    vm.updateOutput(result_data);

                    vm.cmdHistory.push(vm.command);
                    vm.cmdHistory.slice(-300); // just to set a sane limit to how many manually entered commands will be saved...
                    vm.cmdHistoryIdx = vm.cmdHistory.length;
                    vm.command = "";
                });
        }

        function handleKeyDown(keyEvent) {
            var keyCode = keyEvent.keyCode;

            if (keyCode == 38 || keyCode == 40) {
                if (keyCode == 38 && vm.cmdHistory.length > 0 && vm.cmdHistoryIdx > 0) {
                    vm.cmdHistoryIdx--;
                } else if (keyCode == 40 && vm.cmdHistoryIdx < vm.cmdHistory.length - 1) {
                    vm.cmdHistoryIdx++;
                }

                if (vm.cmdHistoryIdx >= 0 && vm.cmdHistoryIdx < vm.cmdHistory.length) {
                    vm.command = (vm.cmdHistory[vm.cmdHistoryIdx]);
                }

                // prevent the cursor from being moved to the beginning of the input field (this is actually the reason
                // why we do the arrow key handling in the keydown event handler, keyup would be too late already to
                // prevent this from happening, causing a jumpy cursor)
                return false;
            }

            // do not prevent default action
            return true;
        }

        function handleKeyUp(keyEvent) {
            if (keyEvent.keyCode == 13) {
                vm.sendCommand();
            }

            return true;
        }

        function clear() {
            vm.log = [];
            vm.updateOutput();
        }

        function onFilterChange() {
            vm.updateOutput();
        }

        function updateOutput(message) {
            if (!vm.log)
                vm.log = [];

            if (message) {
                vm.log = vm.log.concat(message);
                vm.log = vm.log.slice(-300);
            }

            var regex = /ok T:/g;

            var output = "";
            var logLength = vm.log.length;
            for (var i = 0; i < logLength; i++) {
                if (vm.filterOutput && vm.log[i].match(regex)) continue;
                output += vm.log[i];
            }

            vm.commandOutput = output;
        }
    }
}());
