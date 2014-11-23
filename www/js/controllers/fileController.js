(function () {

    var injectParams = ['$scope', 'dataService', 'sharedService'];

    var FileCtrl = function ($scope, dataService, sharedService) {

        $scope.fileList = [];

        $scope.refreshFiles = function () {
            console.log('RefreshFiles');

            dataService.runCommand("M20")
                .then(function (result_data) {
                    $scope.parseFilelist(result_data);
                }, function (error) {
                    console.error(error.statusText);
                });
        }

        $scope.parseFilelist = function (rawdata) {
            $scope.fileList = [];
            var list = rawdata.split('\n');
            angular.forEach(list, function(value, key) {
                value = value.trim();
                if (value.match(/\.g(code)?$/)) {
                    $scope.fileList.push(value);
                }
            });
        }

        $scope.print = function (file) {
            dataService.runCommand("play /sd/" + file)
                .then(function (result) {
                    console.log('Result: ' + result);
                });
        }

        $scope.progress = function () {
            dataService.runCommand("progress")
                .then(function (result_data) {
                    sharedService.prepForBroadcast(result_data);
                }, function (error) {
                    console.error(error.statusText);
                });
        }

        $scope.abort = function () {
            dataService.runCommand("abort")
                .then(function (result_data) {
                    sharedService.prepForBroadcast(result_data);
                }, function (error) {
                    console.error(error.statusText);
                });
        }
    };

    FileCtrl.$inject = injectParams;

    angular.module('smoothieApp').controller('FileCtrl', FileCtrl);
}());
