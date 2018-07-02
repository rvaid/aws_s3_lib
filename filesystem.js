const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf')
var config = require('./config')

const rootPath = config["filesystem"]["rootPath"]


function filewalker(dir, done) {
    let results = [];
    let folderCount = 0;
    let fileCount = 0;

    fs.readdir(dir, function(err, list) {
        if (err) return done(err);

        var pending = list.length;

        if (!pending) return done(null, results);

        list.forEach(function(file){
            // count = 0
            // console.log(list.length)
            file = path.resolve(dir, file)
            
            fs.stat(file, function(err, stat){
                item = {Name : path.basename(file,path.extname(path.basename(file))), "Parent": dir.split(rootPath).slice(-1)[0].split('\\').join('/')
                        , "Path" : file.split(rootPath).slice(-1)[0].split('\\').join('/')
                        , "IsDirectory" : 0, "LastModified" : stat.mtime, "Size" : stat.size
                        , "extName" : null}
            
                if (stat && stat.isDirectory()) {
                    item["IsDirectory"] = 1
                    item["Path"] = item["Path"] + '/'
                    results.push(item);

                    filewalker(file, function(err, res){
                        results = results.concat(res);
                        if (!--pending) done(null, results);
                    });
                } else {
                    // console.log(stat.size)
                    item["extName"] = path.extname(item["Path"])
                    results.push(item);

                    if (!--pending) done(null, results);
                }
            });
        });
    });
};


var fileFunctions = {
    
    // function to get all objects
    getAllObjects : function(callback){
        filewalker(rootPath,function(err, data){
        if(err){
            throw err;
        }
        callback(data)
    });
    },

    // function to create a file or a folder
    createObject : function(obj, callback){
        if(obj["IsDirectory"] == 1){
            mkdirp(path.join(rootPath, obj["Path"], obj ["Name"]), function (err) {
                 if (err) throw err
                 else callback(true)
            });
        }
     
        else{
             fs.writeFile(path.join(rootPath, obj["Path"], obj ["Name"]), 'This is my text', function (err) {
                 if (err) throw err;
                 else callback(true)
               });
        }

    },

    // function to rename a file or a folder
    renameObject : function(obj, callback){
        console.log(obj["Path"])
        // obj["path"].split()
        fs.rename(path.join(rootPath, obj["Path"]), path.join(rootPath, path.dirname(obj["Path"]), obj["RenameTo"]), function(err) {
            if ( err ) throw err
            else callback(true)
        });
    },

    // function to delete a file or a folder
    deleteObjects : function(objs, callback){
        successObjs = []
        errorObjs = []
        objs.forEach(function(obj){
            if(obj["IsDirectory"] == 1){
                rimraf(path.join(rootPath, obj["Path"]), function (err) {
                     if (err) errorObjs.push({"Obj" : obj["Path"], "Error" : err});
                     else successObjs.push({"Obj" : obj["Path"]})

                     if(successObjs.length + errorObjs.length == objs.length){
                        callback(successObjs.concat(errorObjs))
                    }
             });
                 
            }
         
            else{
                console.log(path.join(rootPath, obj["Path"]))
                 fs.unlink(path.resolve(path.join(rootPath, obj["Path"])), function (err) {
                     if (err) errorObjs.push({"Obj" : obj["Path"], "Error" : err});
                     else successObjs.push({"Obj" : obj["Path"]})

                     if(successObjs.length + errorObjs.length == objs.length){
                         callback(successObjs.concat(errorObjs))
                     }
                   });
            }

        })
       

    }
}



// fileFunctions.getAllObjects()


    


//   createObject({Path:"myNewFolder\\",Name:"file.txt",IsDirectory:0})



//    deleteObject({"Path":"\\myNewFolder\\file.txt",IsDirectory:0})



// renameObject({"Path":"\\myNewFolder", "RenameTo":"qwerty"})

module.exports = fileFunctions

  