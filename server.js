/*********************************************************************************
*  WEB322 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy. 
*  No part of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Alam Mohammed Student ID:156506214 Date: 29-09-2022
*
*  Online (Cyclic) Link: 
*
********************************************************************************/ 

var express = require("express");
var app = express();

var HTTP_PORT = process.env.PORT || 8080;
var path = require("path");

const dataService = require('./data-service');


function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
};

app.use(express.static('public')); 

app.get("/", function(req,res){
  
  res.sendFile(path.join(__dirname,"/views/home.html"));
});

app.get("/about", function(req,res){
  
  res.sendFile(path.join(__dirname,"/views/about.html"));
});

app.get("/students", (req,res) => {
  dataService.getAllStudents().then((data)=>{
      res.json(data); 
  }).catch((err)=>{
      res.send(err);
  });
});


app.get("/intlstudents", (req,res) => {
  dataService.getInternationalStudents().then((data)=>{
      res.json(data); 
  }).catch((err)=>{
      res.send(err);
  });
});

  
app.get("/programs",function(req,res){
  dataService.getAllPrograms().then((data)=>{
    res.json(data); 
}).catch((err)=>{
    res.send(err);
});
});

app.use((req, res) => {
  res.status(404).send("<h2>404</h2><p>Page Not Found</p>");
});


dataService.initialize()
.then(()=>{
    app.listen(HTTP_PORT, onHttpStart);
}).catch((err)=>{
    console.log("Error: ", err)
})