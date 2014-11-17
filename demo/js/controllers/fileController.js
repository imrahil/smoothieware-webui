(function () {

    var injectParams = ['$scope', 'dataService', '$location'];

    var FileCtrl = function ($scope, dataService, $location) {

        $scope.fileList = [];

        $scope.refreshFiles = function () {
            var loc = $location.host();

            if (loc == "localhost" || loc == "http://imrahil.github.io") {
                var list = "Begin file list\n" +
                "config.txt\n" +
                "web\n" +
                "web2\n" +
                "test1.gcode\n" +
                "test2.gcode\n" +
                "test3.gcode\n" +
                "End file list\n" +
                "ok";
                $scope.parseFilelist(list);
            } else {
                dataService.runCommand("M20")
                    .then(function (result_data) {
                        $scope.parseFilelist(result_data);
                    }, function (error) {
                        $window.alert(error.statusText);
                    });
            }
        }

        $scope.parseFilelist = function (rawdata) {
            var list = rawdata.split('\n');
            angular.forEach(list, function(value, key) {
                value = value.trim();
                if (value.match(/\.g(code)?$/)) {
                    $scope.fileList.push(value);
                }
            });
        }

        $scope.print = function (file) {
            dataService.runCommand("play /sd/" + file);
        }

        $scope.progress = function () {
            dataService.runCommand("progress");
        }

        $scope.abort = function () {
            dataService.runCommand("abort");
        }
    };

    FileCtrl.$inject = injectParams;

    angular.module('smoothieApp').controller('FileCtrl', FileCtrl);
}());
