(function () {

    var injectParams = ['$scope', 'dataService'];

    var CommandCtrl = function ($scope, dataService) {

        $scope.command = "";
        $scope.commandOutput = "";
        $scope.cmdHistory = [];
        $scope.cmdHistoryIdx = -1;

        $scope.sendCommand = function () {
            if (!$scope.command) {
                return;
            }

            console.log('Command: ' + $scope.command);

            dataService.runCommand($scope.command)
                .then(function (result_data) {
                    $scope.commandOutput += result_data + "\n";
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
    };

    CommandCtrl.$inject = injectParams;

    angular.module('smoothieApp').controller('CommandCtrl', CommandCtrl);
}());
