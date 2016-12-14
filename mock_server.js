var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');

var app = express();
var port = process.env.PORT || 8080;
var dir = process.env.DIR || 'www';

app.use( express.static(dir) );
app.use( cors() );
app.use( bodyParser.text() );

var heaterT0SelectedTemp = 0;
var heaterT1SelectedTemp = 0;
var bedSelectedTemp = 0;

// routes will go here
app.post('/command', function(req, res) {
    var param = req.body.trim();
    var output = "";
    console.log('Request param: ' + param);

    var heaterT0ActualTemp = 30;
    var heaterT1ActualTemp = 25;
    var bedActualTemp = 22;

    if (param == "M105") {
        heaterT0ActualTemp = getRandomValue("T0");
        heaterT1ActualTemp = getRandomValue("T1");
        bedActualTemp = getRandomValue("bed");

        output = "ok T:" + heaterT0ActualTemp + " /" + heaterT0SelectedTemp + "@0 ";
        output += "T1:" + heaterT1ActualTemp + " /" + heaterT1SelectedTemp + "@0 ";
        output += "B:" + bedActualTemp + " /" + bedSelectedTemp + "@0 ";
        output += "P:29.7 /0.0 @0" + '\r\n';

    } else if (param == "M20") {
        rand = Math.floor((Math.random() * 2) * 10 + 1);

        output = "Begin file list\n" +
            "config.txt\n" +
            "web\n" +
            "web2\n" +
            "test" + (rand + 2) + ".gcode\n" +
            "test" + (rand - 2) + ".gcode\n" +
            "test" + (rand + 3) + ".gcode\n" +
            "End file list\n" +
            "ok" + '\r\n';

    } else if (param.indexOf("M104") > -1 || param.indexOf("M140") > -1) {
        var regex;
        var regexResult;
        if (param.indexOf("M104") > -1) {
            if (param.indexOf("T1")) {
                regex = /M104 S(.*) T(.*)/gi;
                regexResult = regex.exec(param);
                if (regexResult[2] == "0") {
                    heaterT0SelectedTemp = Number(regexResult[1]).toFixed(1);
                } else {
                    heaterT1SelectedTemp = Number(regexResult[1]).toFixed(1);
                }
            }
        } else {
            regex = /M140 S(.*)/gi;
            regexResult = regex.exec(param);
            bedSelectedTemp = Number(regexResult[1]).toFixed(1);
        }

    } else if (param == "progress") {
        output = "Nothing is printed" + '\r\n';
    } else if (param == "abort") {
        output = "Abort! Abort!" + '\r\n';
    } else {
        output = "ok" + '\r\n';
    }

    console.log('Response: ' + output);
    res.send(output);
});

app.options("/*", function(req, res, next){
    res.sendStatus(200);
});

function getRandomValue(target) {
    var min;
    var max;

    if (target == "bed") {
        min = 30;
        max = 32;
    } else {
        min = 200;
        max = 210;
    }

    var result = Math.random() * (max - min + 1) + min;
    return result.toFixed(1);
}

// start the server
app.listen(port);
console.log('Server started! At http://localhost:' + port);
