API documentation :
1 Configuration :
  Use config.js file to configure and swap between aws s3 and filesystem. Set mode = 'aws' to use S3 as storage or mode = 'filesystem' along with rootpath of the folder whose contents
  you want to view as library. The config.js file has aws IAM credentials with read/write access.
  mode = aws uses aws.js file and mode = filesystem uses filesystem.js file

2. Installing and running the application
   "npm install" will install the node modules and "npm start" will run the server on port 3000. Use http://localhost:3000/ to view the library.

3. API reference : 
   a. http://localhost:3000/getData/ - method : GET
      Returns the full hierarchy of the library
   
   b. http://localhost:3000/createObject/ - method : POST
      Creates an object
      JSON input : {"Path":"<path from rootpath>","Name":"<name of file with extension or folder>","IsDirectory":<1(Folder) or 0(File)>}
      Eg : {"Path":"","Name":"a.pdf","IsDirectory":0} --Creates a pdf file inside root directory
           {"Path":"abc/","Name":"folder1","IsDirectory":1} -- Creates a folder inside another folder abc

   c. http://localhost:3000/renameObject  - method : POST
      Renames an object
      Eg JSON input : {"Path":"myFolder/New Folder", "RenameTo":"folder2"} -- renames New Folder inside myFolder to folder2

   
   d. http://localhost:3000/deleteObjects  - method : POST
      Deletes an array of objects 
      Eg JSON input : [{"Path":"Sherlock/a.txt","IsDirectory":0},{"Path":"qwerty/abc/","IsDirectory":1}] -- deletes a file a.txt inside Sherlock folder and a folder abc inside qwerty folder


4. UI Reference :
   a. Navigation using folders and breadcrumb.
   b. To rename double click the text, delete it and add your name. Then press pencil icon to save.
   c. Create folder, Create file and delete folder are self explanatory.
    
      