function runCommand(cmd, silent)
{
    //// Get some values from elements on the page:
    //var $form = $("#commandForm");
    //cmd += "\n";
    //url = silent ? "/command_silent" : "/command"; // $form.attr( "action" );
    //// Send the data using post
    //var posting = $.post(url, cmd);
    //// Put the results in a div
    //if (!silent)
    //{
    //    posting.done(function (data)
    //    {
    //        $("#result").empty();
    //        $.each(data.split('\n'), function (index)
    //        {
    //            $("#result").append(this + '<br/>');
    //        });
    //    });
    //}
}

function runCommandSilent(cmd)
{
    console.log('test');
    //runCommand(cmd, true);
}

function runCommandCallback(cmd, callback)
{
//    var url = "/command";
//    cmd += "\n";
//    var posting = $.post(url, cmd, callback);
}

function jogXYClick(cmd)
{
    //runCommand("G91 G0 " + cmd + " F" + document.getElementById("xy_velocity").value + " G90", true)
}

function jogZClick(cmd)
{
    //runCommand("G91 G0 " + cmd + " F" + document.getElementById("z_velocity").value + " G90", true)
}

function extrude(event, a, b)
{
    //var length = document.getElementById("extrude_length").value;
    //var velocity = document.getElementById("extrude_velocity").value;
    //
    //var isT0 = (event.currentTarget.id == 'extrude_t0' || event.currentTarget.id == 'reverse_t0');
    //var direction = (event.currentTarget.id == 'extrude_t0' || event.currentTarget.id == 'extrude_t1') ? 1 : -1;
    //
    //runCommand("T" + (isT0 ? "0" : "1"), true);
    //runCommand("G91 G0 E" + (length * direction) + " F" + velocity + " G90", true);
}

function motorsOff(event)
{
    //runCommand("M18", true);
}

function heatSet(event)
{
    //var ifHeat = (event.currentTarget.id == 'heat_set_t0' || event.currentTarget.id == 'heat_set_t1');
    //var isT0 = (event.currentTarget.id == 'heat_set_t0');
    //var type = ifHeat ? 104 : 140;
    //var temperature = (ifHeat) ? document.getElementById((isT0) ? "heat_value_t0" : "heat_value_t1").value : document.getElementById("bed_value").value;
    //if (ifHeat)
    //{
    //    runCommand("T" + (isT0 ? "0" : "1"), true);
    //}
    //runCommand("M" + type + " S" + temperature, true);
}

function heatOff(event)
{
    //var ifHeat = (event.currentTarget.id == 'heat_off_t0' || event.currentTarget.id == 'heat_off_t1');
    //var isT0 = (event.currentTarget.id == 'heat_off_t0');
    //var type = ifHeat ? 104 : 140;
    //if (ifHeat)
    //{
    //    runCommand("T" + (isT0 ? "0" : "1"), true);
    //}
    //runCommand("M" + type + " S0", true);
}

function getTemperature()
{
//    //runCommand("M105", false);
//    var regex_temp = /(B|T(\d*)):\s*([+]?[0-9]*\.?[0-9]+)?/gi;
//
////    var test_data = "ok T:23.3 /0.0 @0 T1:23.4 /0.0 @0 B:24.8 /0.0 @0 P:29.4 /0.0 @0";
//    var posting = $.post("/command", "M105\n");
//    posting.done(function (data)
//    {
//        while ((result = regex_temp.exec(data)) !== null)
//        {
//            var tool = result[1];
//            var value = result[3];
//
//            if (tool == "T")
//            {
//                $("#heat_actual_t0").html(value + "&deg;C");
//            }
//            else if (tool == "T1")
//            {
//                $("#heat_actual_t1").html(value + "&deg;C");
//            }
//            if (tool == "B")
//            {
//                $("#heat_actual_bed").html(value + "&deg;C");
//            }
//        }
//    });
}

function handleFileSelect(evt)
{
    var files = evt.target.files; // handleFileSelectist object

    // files is a FileList of File objects. List some properties.
    var output = [];
    for (var i = 0, f; f = files[i]; i++)
    {
        output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
            f.size, ' bytes, last modified: ',
            f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
            '</li>');
    }
    document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
}

function upload()
{
    $("#progress").empty();
    $("#uploadresult").empty();

    // take the file from the input
    var file = document.getElementById('files').files[0];
    var reader = new FileReader();
    reader.readAsBinaryString(file); // alternatively you can use readAsDataURL
    reader.onloadend = function (evt)
    {
        // create XHR instance
        xhr = new XMLHttpRequest();

        // send the file through POST
        xhr.open("POST", 'upload', true);
        xhr.setRequestHeader('X-Filename', file.name);

        // make sure we have the sendAsBinary method on all browsers
        XMLHttpRequest.prototype.mySendAsBinary = function (text)
        {
            var data = new ArrayBuffer(text.length);
            var ui8a = new Uint8Array(data, 0);
            for (var i = 0; i < text.length; i++)
            {
                ui8a[i] = (text.charCodeAt(i) & 0xff);
            }

            if (typeof window.Blob == "function")
            {
                var blob = new Blob([data]);
            }
            else
            {
                var bb = new (window.MozBlobBuilder || window.WebKitBlobBuilder || window.BlobBuilder)();
                bb.append(data);
                var blob = bb.getBlob();
            }

            this.send(blob);
        }

        // let's track upload progress
        var eventSource = xhr.upload || xhr;
        eventSource.addEventListener("progress", function (e)
        {
            // get percentage of how much of the current file has been sent
            var position = e.position || e.loaded;
            var total = e.totalSize || e.total;
            var percentage = Math.round((position / total) * 100);

            // here you should write your own code how you wish to proces this
            $("#progress").empty().append('uploaded ' + percentage + '%');
        });

        // state change observer - we need to know when and if the file was successfully uploaded
        xhr.onreadystatechange = function ()
        {
            if (xhr.readyState == 4)
            {
                if (xhr.status == 200)
                {
                    // process success
                    $("#uploadresult").empty().append('Uploaded Ok');
                }
                else
                {
                    // process error
                    $("#uploadresult").empty().append('Uploaded Failed');
                }
            }
        };

        // start sending
        xhr.mySendAsBinary(evt.target.result);
    };
}

function playFile(filename)
{
    runCommandSilent("play /sd/" + filename);
}

function refreshFiles()
{
    document.getElementById('fileList').innerHTML = '';
    runCommandCallback("M20", function (data)
    {
        $.each(data.split('\n'), function (index)
        {
            var item = this.trim();
            if (item.match(/\.g(code)?$/))
            {
                var list = document.getElementById('fileList');
                var li = document.createElement("li");
                li.className = "list-group-item";

                var text = document.createTextNode(item);
                var btn = document.createElement("button");
                btn.className = "btn btn-xs btn-default pull-right";
                btn.innerHTML = "Drukuj";

                li.appendChild(text);
                li.appendChild(btn);

                btn.onclick = function ()
                {
                    playFile(item)
                };
                list.appendChild(li);
            }
            //$( "#result" ).append( this + '<br/>' );
        });
    });
}
