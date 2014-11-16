(function () {

    var injectParams = ['$http', '$q'];

    var dataService = function ($http, $q) {
        var factory = {};

        factory.runCommand = function (cmd) {
            var url = "/command";

            cmd += "\n";

            var test_data = "ok T:10.3 /0.0 @0 T1:23.4 /0.0 @0 B:40.8 /0.0 @0 P:29.4 /0.0 @0";

            //url = "http://localhost:63342/smoothieware-webui/webui/www/index.html";
            return $http.post(url, cmd)
                .then(
                    function (results) {
                        return results.data;
                        //return test_data;
                    }
                );
        };

        return factory;
    };

    dataService.$inject = injectParams;

    angular.module('smoothieApp').factory('dataService', dataService);
}());
