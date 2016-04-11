(function () {
    'use strict';

    angular
        .module('smoothieApp')
        .controller('FileCtrl', FileCtrl);

    FileCtrl.$inject = ['DataService'];

    function FileCtrl(DataService) {
        var vm = this;

        vm.fileList = [];

        vm.refreshFiles = refreshFiles;
        vm.parseFilelist = parseFilelist;
        vm.print = print;
        vm.progress = progress;
        vm.abort = abort;
        vm.upload = upload;

        activate();

        ////////////////

        function activate() {
            refreshFiles();
        }

        function refreshFiles() {
            console.log('RefreshFiles');

            DataService.runCommand("M20")
                .then(function (result_data) {
                    vm.parseFilelist(result_data);
                }, function (error) {
                    console.error(error.statusText);
                });
        }

        function parseFilelist(rawdata) {
            vm.fileList = [];
            var list = rawdata.split('\n');
            angular.forEach(list, function(value, key) {
                value = value.trim();
                if (value.match(/\.g(code)?$/)) {
                    vm.fileList.push(value);
                }
            });
        }

        function print(file) {
            console.log('print file - ' + file);

            DataService.runCommand("play /sd/" + file)
                .then(function (result) {
                    console.log('Result: ' + result);
                });
        }

        function progress() {
            DataService.runCommand("progress")
                .then(function (result_data) {
                    DataService.broadcastItem(result_data);
                }, function (error) {
                    console.error(error.statusText);
                });
        }

        function abort() {
            DataService.runCommand("abort")
                .then(function (result_data) {
                    DataService.broadcastItem(result_data);
                }, function (error) {
                    console.error(error.statusText);
                });
        }

        function upload() {
        }
    }
}());
