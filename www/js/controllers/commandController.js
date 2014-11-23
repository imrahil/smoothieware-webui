(function () {

    var injectParams = ['$scope', 'dataService', 'sharedService'];

    var CommandCtrl = function ($scope, dataService, sharedService) {

        $scope.log = [];

        $scope.command = "";
        $scope.commandOutput = "";
        $scope.cmdHistory = [];
        $scope.cmdHistoryIdx = -1;

        $scope.autoscrollEnabled = true;
        $scope.filterOutput = false;

        $scope.$on('handleBroadcast', function () {
            $scope.updateOutput(sharedService.message);
        });

        $scope.sendCommand = function () {
            if (!$scope.command) {
                return;
            }

            console.log('Command: ' + $scope.command);

            dataService.runCommand($scope.command)
                .then(function (result_data) {
                    $scope.updateOutput(result_data);

                    $scope.cmdHistory.push($scope.command);
                    $scope.cmdHistory.slice(-300); // just to set a sane limit to how many manually entered commands will be saved...
                    $scope.cmdHistoryIdx = $scope.cmdHistory.length;
                    $scope.command = "";
                });
        }

        $scope.handleKeyDown = function (keyEvent) {
            var keyCode = keyEvent.keyCode;

            if (keyCode == 38 || keyCode == 40) {
                if (keyCode == 38 && $scope.cmdHistory.length > 0 && $scope.cmdHistoryIdx > 0) {
                    $scope.cmdHistoryIdx--;
                } else if (keyCode == 40 && $scope.cmdHistoryIdx < $scope.cmdHistory.length - 1) {
                    $scope.cmdHistoryIdx++;
                }

                if ($scope.cmdHistoryIdx >= 0 && $scope.cmdHistoryIdx < $scope.cmdHistory.length) {
                    $scope.command = ($scope.cmdHistory[$scope.cmdHistoryIdx]);
                }

                // prevent the cursor from being moved to the beginning of the input field (this is actually the reason
                // why we do the arrow key handling in the keydown event handler, keyup would be too late already to
                // prevent this from happening, causing a jumpy cursor)
                return false;
            }

            // do not prevent default action
            return true;
        }

        $scope.handleKeyUp = function (keyEvent) {
            if (keyEvent.keyCode == 13) {
                $scope.sendCommand();
            }

            return true;
        }

        $scope.clear = function () {
            $scope.log = [];
            $scope.updateOutput();
        }

        $scope.onFilterChange = function () {
            $scope.updateOutput();
        };

        $scope.updateOutput = function (message) {
            if (!$scope.log)
                $scope.log = [];

            if (message) {
                $scope.log = $scope.log.concat(message);
                $scope.log = $scope.log.slice(-300);
            }

            var regex = /ok T:/g;

            var output = "";
            var logLength = $scope.log.length;
            for (var i = 0; i < logLength; i++) {
                if ($scope.filterOutput && $scope.log[i].match(regex)) continue;
                output += $scope.log[i] + "\n";
            }

            $scope.commandOutput = output;
        };
    };

    CommandCtrl.$inject = injectParams;

    angular.module('smoothieApp').controller('CommandCtrl', CommandCtrl);
}());
