(function () {

    var injectParams = ['$http', '$q'];

    var dataService = function ($http, $q) {
        var factory = {};

        factory.runCommand = function (cmd) {
            var url = "/command";
            cmd += "\n";

            return $http.post(url, cmd)
                .then(
                    function (results) {
                        return results.data;
                    }
                );
        };

        return factory;
    };

    dataService.$inject = injectParams;

    angular.module('smoothieApp').factory('dataService', dataService);
}());
