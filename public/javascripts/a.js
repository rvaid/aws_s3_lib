$(document).ready(function() {
    console.log("script_included");
    $("input[name='foldername']").hide();
    $("#createfol").hide();
    $("input[name='filename']").hide();
    $("#createfil").hide();
    var serverName = "http://localhost:3000"
    // dataarray = [{
    //         "Name": "burumontu",
    //         "Parent": "",
    //         "Path": "burumontu.txt",
    //         "IsDirectory": 0,
    //         "LastModified": "2018-06-30T15:46:12.000Z",
    //         "Size": 10,
    //         "extName": ".txt"
    //     },
    //     {
    //         "Name": "montu",
    //         "Parent": "",
    //         "Path": "montu.txt",
    //         "IsDirectory": 0,
    //         "LastModified": "2018-06-30T15:46:41.000Z",
    //         "Size": 10,
    //         "extName": ".txt"
    //     },
    //     {
    //         "Name": "montuuu",
    //         "Parent": "",
    //         "Path": "montuuu.pdf",
    //         "IsDirectory": 0,
    //         "LastModified": "2018-06-30T16:09:19.000Z",
    //         "Size": 10,
    //         "extName": ".pdf"
    //     },
    //     {
    //         "Name": "qwer",
    //         "Parent": "",
    //         "Path": "qwer/",
    //         "IsDirectory": 1,
    //         "LastModified": "2018-06-30T15:47:14.000Z",
    //         "Size": 0,
    //         "extName": null
    //     },
    //     {
    //         "Name": "rini",
    //         "Parent": "",
    //         "Path": "rini/",
    //         "IsDirectory": 1,
    //         "LastModified": "2018-06-30T13:41:35.000Z",
    //         "Size": 10,
    //         "extName": null
    //     },
    //     {
    //         "Name": "qwer",
    //         "Parent": "rini",
    //         "Path": "rini/qwer/",
    //         "IsDirectory": 1,
    //         "LastModified": "2018-06-30T15:44:48.000Z",
    //         "Size": 0,
    //         "extName": null
    //     },
    //     {
    //         "Name": "qwe",
    //         "Parent": "qwer",
    //         "Path": "rini/qwer/qwe/",
    //         "IsDirectory": 1,
    //         "LastModified": "2018-06-30T15:44:48.000Z",
    //         "Size": 0,
    //         "extName": null
    //     },
    //     {
    //         "Name": "rini",
    //         "Parent": "qwer",
    //         "Path": "rini/qwer/rini.txt",
    //         "IsDirectory": 0,
    //         "LastModified": "2018-06-30T15:48:17.000Z",
    //         "Size": 8,
    //         "extName": ".txt"
    //     },
    //     {
    //         "Name": "rahul",
    //         "Parent": "rini",
    //         "Path": "rini/rahul.txt",
    //         "IsDirectory": 0,
    //         "LastModified": "2018-06-30T15:45:33.000Z",
    //         "Size": 8,
    //         "extName": ".txt"
    //     }
    // ]
    location.hash = "" + 0;
    currentloc = location.hash;
    currentlevel = parseInt(currentloc.substring(currentloc.length - 1));
    currentfolder = currentloc.substring(0, currentloc.length);
    parent = "";
    
    $(".breadcrumbs").append("<a href='" + currentloc + "'<span class='folderName'>root</span>");

    function parsepath(currentlevel, Parent) {
        // body...
        //alert(currentlevel);
        status = "none";
        $(jQuery.parseJSON(dataarray)).each(function() {
            var name = this.Name;
            var path = this.Path;
            var parentcheck = this.Parent;
            //console.log(this.Name);
            //console.log(path);
            if (parent == parentcheck || parent == "") {
                patharray = path.split("/");
                patharray = $.grep(patharray, function(n) {
                    return (n);
                });
                if (patharray.length == currentlevel) {
                    createFolder(currentlevel, name, this.IsDirectory);
                }
            } //parentcheck
        }); //jsonparse
    }; //parsepath func
    function createFolder(level, foldername, IsDirectory) {
        // body...
        status = "creating";
        //console.log(foldername);
        currentloc = location.hash;
        idname = foldername.replace(/ /g, "-") + level;
        if (document.getElementById(idname)) {
            //console.log("folder exists");
        } else {
            //console.log("folder does not exist");
            $(".card-deck").append("<div class='card' style='min-width:45%;margin-bottom:48px;' id='" + idname + "' click='openfolder()'></div>");
            $("#" + idname).append("<div class='card-body row'></div>");
            if (IsDirectory == 1) {
                $("#" + idname + " .card-body").append("<div class='col-md-3'><i class='material-icons' style='font-size: 50px'>folder</i> </div>");
            } else {
                $("#" + idname + " .card-body").append("<div class='col-md-3'><i class='material-icons' style='font-size: 50px'>assignment</i> </div>");
            }
            $("#" + idname + " .card-body").append("<div class='col-md-9'><span style'text-align:center'>" + foldername + "</span></div>");

        }
    }; //func_create_folder



    $.ajax({
        url: serverName+'/getData',
        data: {
           format: 'json'
        },
        error: function(err) {
           console.log(err)
        },
        contentType: 'application/json',
        success: function(data) {
            dataarray = data
            // console.log(dataarray)
            
            
        },
        complete : function(data){
            parsepath(currentlevel + 1, parent);
            console.log("on load" + currentlevel);
            breadcrumbsarray = ["root"];

        },
        type: 'GET'
     });

    $(".filemanager").on('click', '.card', function(e) {
        e.preventDefault();

        var currentloc = $(this).attr('id');
        var currentfolder = $(this).attr('id').slice(0, -1);
        var currentlevel = parseInt(currentloc.substring(currentloc.length - 1));
        location.hash = currentfolder + currentlevel;
        ifexists = currentlevel + 1;
        //console.log($("[id$='"+ifexists+"']"));


        if ($("[id$='" + ifexists + "']").length == 0) {

            if ($(this).find("i").text() == "folder") {
                $(".breadcrumbs").append("<span class='arrow'>/</span><a href='" + location.hash + "''><span class='folderName'>" + currentfolder.replace(/-/g, " ") + "</span>");
                $("[id$='" + currentlevel + "']").hide();
                parsepath(currentlevel + 1, currentfolder);
            }
        } else {
            console.log("navigate");
        }

        //alert($(this).attr('id').slice(0,-1));

    }); //func openfolder
    /*$(".i").dblclick(function(e){
      e.preventDefault();
      alert("doubleclick");
      });*/
    $(window).on('hashchange', function() {
        //alert(status);
        if (status == "navigate") {
            navigate_folder();
        }
        // We are triggering the event. This will execute 
        // this function on page load, so that we show the correct folder:

    }).trigger('hashchange');
    $(".breadcrumbs").on('click', 'a', function() {
        var elemant = $(this).attr('href').slice(1, -1);
        $(this).nextAll().remove();
        status = "navigate";
    })

    function navigate_folder() {
        var toloc = location.hash;
        var tolevel = parseInt(toloc.substring(toloc.length - 1));
        var tofolder = toloc.substring(0, toloc.length);
        //alert(toloc);

        $(".card").each(function() {
            $(this).hide();
            var folderloc = $(this).attr('id');

            var folderlevel = parseInt(folderloc.substring(folderloc.length - 1));
            //console.log(folderloc,tolevel,folderlevel);
            if (tolevel + 1 == folderlevel) {
                $(this).show();
            }
        })

    } //navigate_func
    $("button").on('click', function() {
        //alert("buttonclick");
        if ($(this).attr('id').indexOf("folder") >= 0) {
            $("input[name='foldername']").show();
            $("#createfol").show();
        } else if ($(this).attr('id').indexOf("file") >= 0) {
            $("input[name='filename']").show();
            $("#createfil").show();
        } else if ($(this).attr('id') == "createfol") {
            createloc = location.hash;
            var folname = $("input[name='foldername']").val();
            createlevel = parseInt(createloc.substring(createloc.length - 1)) + 1;
            createpath = createloc.substring(1, createloc.length - 1);
            createFolder(createlevel, folname, 1);
            var path = $(".breadcrumbs").text().substring(5, ).length == 0 ? "" : $(".breadcrumbs").text().substring(5, ) + '/';
            $("input[name='foldername']").hide();
            $("#createfol").hide();
            folderobj = {
                "Name": folname,
                "Parent": createpath,
                "Path": path,
                "IsDirectory": 1
            };
            //dataarray.push(folderobj);
            $.ajax({
                url: serverName+'/createObject',
                data: JSON.stringify(folderobj),
                error: function(err) {
                   console.log(err)
                },
                contentType: 'application/json',
                success: function(data) {
                    dataarray = data
                    // console.log(dataarray)
                    
                    
                },
                complete : function(data){
                    parsepath(currentlevel + 1, parent);
                    console.log("on load" + currentlevel);
                    breadcrumbsarray = ["root"];
        
                },
                type: 'POST'
             });
        } else if ($(this).attr('id') == "createfil") {
            createloc = location.hash;
            var folname = $("input[name='filename']").val();
            createlevel = parseInt(createloc.substring(createloc.length - 1)) + 1;
            createpath = createloc.substring(0, createloc.length);
            createFolder(createlevel, $("input[name='filename']").val(), 0);
            var path = $(".breadcrumbs").text().substring(5, ).length == 0 ? "" : $(".breadcrumbs").text().substring(5, ) + '/';
            $("input[name='filename']").hide();
            $("#createfil").hide();
            folderobj = {
                "Name": folname,
                "Parent": createpath,
                "Path": path,
                "IsDirectory": 0
            };
            console.log(folderobj);
            $.ajax({
                url: serverName+'/createObject',
                data: JSON.stringify(folderobj),
                error: function(err) {
                   console.log(err)
                },
                contentType: 'application/json',
                success: function(data) {
                    dataarray = data
                    // console.log(dataarray)
                    
                    
                },
                complete : function(data){
                    parsepath(currentlevel + 1, parent);
                    console.log("on load" + currentlevel);
                    breadcrumbsarray = ["root"];
        
                },
                type: 'POST'
             });
        }

    }) //button click
}); //document