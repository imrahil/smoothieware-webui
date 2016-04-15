(function () {
    'use strict';

    angular
        .module('smoothieApp')
        .factory('DataService', DataService);

    DataService.$inject = ['$http', 'localStorageService'];

    function DataService($http, localStorageService) {
        var url = "/command";

        var extruderState = {
            supportEnabled: localStorageService.get('secondExtruderSupportEnabled') == "true"
        }

        var output = [];

        var service = {
            runCommand: runCommand,
            registerOutput: registerOutput,
            broadcastCommand: broadcastCommand,
            secondExtruderState: secondExtruderState,
            updateSecondExtruder: updateSecondExtruder
        };

        return service;

        ////////////

        function runCommand(cmd) {
            cmd += "\n";

            return $http.post(url, cmd)
                .then(function (response) {
                    return response.data;
                });
        }

        function registerOutput(out) {
            output.push(out);
        }

        function broadcastCommand(msg) {
            for (var index = 0; index < output.length; ++index)
                output[index].updateOutput(msg);
        }

        function secondExtruderState() {
             return extruderState;
        }

        function updateSecondExtruder() {
            localStorageService.set('secondExtruderSupportEnabled', extruderState.supportEnabled ? "true" : "false");
        }
    }
})();
