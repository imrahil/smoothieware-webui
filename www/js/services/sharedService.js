(function () {

    var injectParams = ['$rootScope'];

    var sharedService = function ($rootScope) {
        var sharedService = {};

        sharedService.message = '';

        sharedService.prepForBroadcast = function (msg) {
            this.message = msg;
            this.broadcastItem();
        };

        sharedService.broadcastItem = function () {
            $rootScope.$broadcast('handleBroadcast');
        };

        return sharedService;
    };

    sharedService.$inject = injectParams;

    angular.module('smoothieApp').factory('sharedService', sharedService);
}());
