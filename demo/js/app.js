'use strict';

/* App Module */
var smoothieApp = angular.module('smoothieApp', [
    'ui.bootstrap',
    'gettext',
    'ngMockE2E',
    'ngSanitize'
]);

smoothieApp.run(function (gettextCatalog, $httpBackend) {
    gettextCatalog.setCurrentLanguage('pl');
    gettextCatalog.debug = true;

    $httpBackend.whenPOST('/command').respond(function(method, url, data) {
        //console.log('Received these data:', method, url, data);

        var result = "ok";
        data = data.replace(/(\r\n|\n|\r)/gm,"");
        var rand;

        if (data == "M105") {
            rand = Math.floor((Math.random() * 30) * 10 + 1) / 10;
            var heaterT0ActualTemp = (rand + 5);
            var heaterT1ActualTemp = (rand + 10);
            var bedActualTemp = (rand + 8);

            result = "ok T:" + heaterT0ActualTemp + " /0.0 @0 T1:" + heaterT1ActualTemp + " /0.0 @0 B:" + bedActualTemp + " /0.0 @0 P:29.7 /0.0 @0"
        } else if (data == "M20") {
            rand = Math.floor((Math.random() * 2) * 10 + 1);

            result = "Begin file list\n" +
            "config.txt\n" +
            "web\n" +
            "web2\n" +
            "test" + (rand + 2) + ".gcode\n" +
            "test" + (rand - 2) + ".gcode\n" +
            "test" + (rand + 3) + ".gcode\n" +
            "End file list\n" +
            "ok";
        }


        return [200, result, {}];
    });

    $httpBackend.whenGET(/^img\//).passThrough();
});