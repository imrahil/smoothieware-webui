(function () {
    'use strict';

    angular
        .module('smoothieApp')
        .controller('FileCtrl', FileCtrl);

    FileCtrl.$inject = ['DataService', 'Upload'];

    function FileCtrl(DataService, Upload) {
        var vm = this;

        vm.fileList = [];
        vm.currentUploadedFile = {};

        vm.refreshFiles = refreshFiles;
        vm.print = print;
        vm.progress = progress;
        vm.abort = abort;
        vm.uploadFile = uploadFile;
        vm.deleteFile = deleteFile;

        activate();

        ////////////////

        function activate() {
            refreshFiles();
        }

        function refreshFiles() {
            console.log('RefreshFiles');

            DataService.runCommand("M20")
                .then(function (result_data) {
                    parseFilelist(result_data);
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
                    var file = {filename: value, uploading: false, percentage: 0};
                    vm.fileList.push(file);
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
                    DataService.broadcastCommand(result_data);
                }, function (error) {
                    console.error(error.statusText);
                });
        }

        function abort() {
            DataService.runCommand("abort")
                .then(function (result_data) {
                    DataService.broadcastCommand(result_data);
                }, function (error) {
                    console.error(error.statusText);
                });
        }

        function uploadFile(file) {
            if (file) {
                DataService.broadcastCommand("Uploading: " + file.name + "\n");

                vm.currentUploadedFile = {filename: file.name, uploading: true, percentage: 0};
                vm.fileList.push(vm.currentUploadedFile);

                Upload.http({
                    url: '/upload',
                    headers: {
                        'X-Filename': file.name
                    },
                    data: file
                }).then(function (resp) {
                    DataService.broadcastCommand('Upload successful. Response: ' + resp.data);
                    vm.currentUploadedFile.uploading = false;

                    vm.refreshFiles();
                }, function (resp) {
                    DataService.broadcastCommand('Error status: ' + resp.status + "\n");
                }, function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    vm.currentUploadedFile.percentage = progressPercentage;
                    console.log('Progress: ' + progressPercentage + '%');
                });
            }
        }

        function deleteFile(file) {
            DataService.runCommand("M30 " + file.filename)
                .then(function (result_data) {
                    DataService.broadcastCommand("Deleted file: " + file.filename + "\n");
                    vm.refreshFiles();
                }, function (error) {
                    console.error(error.statusText);
                });
        }
    }
}());
