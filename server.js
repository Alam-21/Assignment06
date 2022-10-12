/*********************************************************************************
*  WEB322 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name:Alam Mohammed Student ID: 156506214 Date: ________________
*
*  Online (Cyclic) Link: 
*
********************************************************************************/

var express = require("express");
var app = express();

var HTTP_PORT = process.env.PORT || 8080;
var path = require("path");
const fs = require('fs'); 
const multer = require('multer');
const dataService = require('./data-service');

const storage = multer.diskStorage({
  destination: "./public/images/uploaded",
  filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({storage: storage});

function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
};


app.use(express.static('public')); 
app.use(express.urlencoded({extended:true}));

//--homepage
app.get("/", function(req,res){
  
  res.sendFile(path.join(__dirname,"/views/home.html"));
});

//--about page
app.get("/about", function(req,res){
  
  res.sendFile(path.join(__dirname,"/views/about.html"));
});

app.get("/students/add", function(req,res){
  
  res.sendFile(path.join(__dirname,"/views/addStudent.html"));
});

app.post('/students/add', (req,res) => {
  dataService.addStudent(req.body).then(() => {
      res.redirect("/students");
  })
});

app.get("/images/add", function(req,res){
  
  res.sendFile(path.join(__dirname,"/views/addImage.html"));
});

app.post("/images/add", upload.single("imageFile"), (req,res) => {
  res.redirect("/images");
});

app.get("/images", (req,res) => {
  fs.readdir("./public/images/uploaded", function(err,items) {
      res.json({images:items});
  })
});



app.get("/students", (req, res) => {
  if (req.query.status) {
      dataService.getStudentsByStatus(req.query.status).then((data) => {
          res.json({data});
      }).catch((err) => {
          res.json({message: err});
      })
  }
  else if (req.query.program) {
      dataService.getStudentsByProgramCode(req.query.program).then((data) => {
          res.json({data});
      }).catch((err) => {
          res.json({message: err});
      })
  }
  else if (req.query.expectedCredential) {
      dataService.getStudentsByExpectedCredential(req.query.expectedCredential).then((data) => {
          res.json({data});
      }).catch((err) => {
          res.json({message: err});
      })
  }
  else {
    dataService.getAllStudents().then((data)=>{
      res.json(data); 
    }).catch((err)=>{
      res.send(err);
    })
  }
});

app.get('/students/:value', (req,res) => {
  dataService.getStudentById(req.params.value).then((data) => {
      res.json({data});
  }).catch((err) => {
      res.json({message: err});
  })
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