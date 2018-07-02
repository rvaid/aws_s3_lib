
var AWS = require('aws-sdk');
var path = require('path')
var config = require('./config')
AWS.config.update({
    accessKeyId: config["aws"]["accessKeyId"],
    secretAccessKey: config["aws"]["secretAccessKey"],
    
});

var s3 = new AWS.S3();

var Bucket_name = config["aws"]["Bucket_Name"]



function getData(list, done){
    let results = []
    list.forEach(data => {
        
         let KeyParams = data["Key"].split('/').slice()
         if(KeyParams[KeyParams.length - 1] == ''){
                parent = KeyParams.length == 2 ? "" : KeyParams[KeyParams.length - 3]
                item = {"Name": KeyParams[KeyParams.length - 2]
                      , "Parent" : parent,"Path" : data["Key"]
                      , "IsDirectory" : 1, "LastModified" : data["LastModified"], "Size" : data["Size"]
                      , "extName" : null}
            }
         else{
             parent = KeyParams.length == 1 ? "" : KeyParams[KeyParams.length - 2] 
             item = {"Name": path.basename(KeyParams[KeyParams.length - 1], path.extname(path.basename(KeyParams[KeyParams.length - 1])))
                   ,"Parent" : parent,"Path" : data["Key"]
                   , "IsDirectory" : 0, "LastModified" : data["LastModified"], "Size" : data["Size"]
                   , "extName" : path.extname(data["Key"])}
        }
         results.push(item)
    });
    done(results)
     
 }

 function deleteKeys(keys, callback){
    
    var params = {
        Bucket: Bucket_name, 
        Delete: {
            Objects: keys, 
            Quiet: false
        }
       }

        s3.deleteObjects(params, function(err, data) {
         if (err) callback(err)
         else     callback(data)
       });
}

function renameSingleKey(OLD_KEY, NEW_KEY, callback){
    console.log("ol ",OLD_KEY)
    console.log(NEW_KEY)
    old = '/'+OLD_KEY
    
    s3.copyObject({
        Bucket: Bucket_name, 
        CopySource: `${Bucket_name}${old}`, 
        Key: NEW_KEY
       })
        .promise()
        .then(() => {
       
          // Delete the old object
          s3.deleteObject({Bucket: Bucket_name, 
                            Key: OLD_KEY
    
          }, function(err, data) {
            if (err) console.log("While delete"); // an error occurred
            else     console.log(1);  }).promise()
          callback()
        })
        // Error handling is left up to reader
        .catch((e) => console.error(e))


}

function doSynchronousLoop(data, processData, done) {
    if(data.length > 0) {
        var loop = function(data, i, processData, done) {
            processData(data[i], i, function() {
                if (++i < data.length) {
					loop(data, i, processData, done);
				} else {
					done();
				}
			});
		};
		loop(data, 0, processData, done);
	} else {
		done();
	}
}

function processRenames(item, index, callback){
    // console.log(params)
    console.log(item)
    // callback()
    renameSingleKey(item[0], item[1], function(){
        callback()
    })    
}



var awss3Functions = {
    // function to get all objects
    getAllObjects : function(callback){
        bucketParams = {
            Bucket : Bucket_name
        }
        s3.listObjects(bucketParams, function(err, data) {
            if (err) {
               throw err;
            } else {
                    getData(data.Contents,function(results){
                        callback(results)                   
        
                })
               
            }
         });
        },

    // function to create a file or a folder
    createObject : function(obj, callback){
        name = obj["IsDirectory"] == 1 ? obj["Name"] + '/' : obj["Name"]
        console.log(obj["Path"] + name)
        let params = {
            Bucket: Bucket_name,
            Key:  obj["Path"] + name,
            Body: "HelloWorld"
        };
        s3.putObject(params, function (err, res) {
            if (err) {
                console.log("Error uploading data: ", err);
            } else {
                console.log("Successfully uploaded data to myBucket/myKey");
                callback("Successfully uploaded data to myBucket/myKey")
            }
        });

    },

    deleteObjects : function(keyArr, callback){
        let keys=[]
        let sum = 0
        let count = 0

        keyArr.forEach(function(key){
            var params = {
                Bucket : Bucket_name, 
                Prefix : key["Path"]
               };
            
            s3.listObjects(params, function(err, data) {
                count += 1
                list = data.Contents                
                sum += list.length
                // console.log(sum)
                if (err) console.log("Error while listing"); 

                else{
                    list.forEach(function(item){
                        console.log(list)
                        keys.push({"Key" : item["Key"]})
                        if(keys.length == sum && keyArr.length == count){
                            console.log(keys)
                            deleteKeys(keys, function(data){
                                callback(data)
                            })

                        }
                    })
                    
            } 
            })

        })
    },


    renameObject : function(obj, callback){
        var params = {
            Bucket : Bucket_name, 
            Prefix : obj["Path"]
           };
        oldkey = obj["Path"].split('/')
        
        s3.listObjects(params, function(err, data) {
            if (err || data == null) console.log("Error while listing"); 

            else{
                list = data.Contents
                // console.log(list)
                var sortable = [];
                list.forEach(function(item){
                    console.log(obj)
                    console.log(item["Key"].replace(path.basename(obj["Path"]),obj["RenameTo"]))
                    sortable.push([item["Key"], item["Key"].replace(path.basename(obj["Path"]), obj["RenameTo"]), item["Key"].split('/').filter(Boolean).length])
                    // console.log(sortable)
                    if(sortable.length == list.length){
                        sortable.sort(function(a, b) {
                            return -(a[2] - b[2]);
                        });
                        // console.log(sortable)
                        doSynchronousLoop(sortable, processRenames, function(){ callback("Successfully Renamed") })
                    }
                    
                })
 

            } 
        })
    }




}

module.exports = awss3Functions

    