(function () {
    'use strict';

    angular
        .module('smoothieApp')
        .factory('DataService', DataService);

    DataService.$inject = ['$http', '$rootScope'];

    function DataService($http, $rootScope) {
        var url = "/command";

        var service = {
            runCommand: runCommand,
            broadcastItem: broadcastItem
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

        function broadcastItem(msg) {
            $rootScope.$broadcast('handleBroadcast', msg);
        }
    }
})();
