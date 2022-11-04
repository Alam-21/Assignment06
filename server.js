/*********************************************************************************
*  WEB322 – Assignment 04
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name:Alam Mohammed Student ID: 156506214 Date: 03-11-2022
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
const exphbs = require("express-handlebars");   

const storage = multer.diskStorage({
  destination: "./public/images/uploaded",
  filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({storage: storage});

app.engine('.hbs', exphbs.engine({ 
  extname: ".hbs", 
  defaultLayout: "main",
  helpers: {
      navLink: function(url, options){
          return '<li' + 
              ((url == app.locals.activeRoute) ? ' class="active" ' : '') + '><a href="' + url + '">' + options.fn(this) + '</a></li>'; },
      equal: function (lvalue, rvalue, options) {
          if (arguments.length < 3)
              throw new Error("Handlebars Helper equal needs 2 parameters");
          if (lvalue != rvalue) {
              return options.inverse(this);
          } else {
              return options.fn(this);
          }
      }           
  } 
}));

app.set('view engine', '.hbs');

function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
};


app.use(express.static('public')); 
app.use(express.urlencoded({extended:true}));
app.use(function(req,res,next) {
  let route = req.baseUrl+req.path;
  app.locals.activeRoute = (route == "/") ? "/":route.replace(/\/$/,"");
  next();
});

//--homepage
app.get('/', (req, res) => {
  res.render(path.join(__dirname + "/views/home.hbs"));
});
app.get('/home', (req, res) => {
  res.render(path.join(__dirname + "/views/home.hbs"));
});

//--about page
app.get('/about', (req, res) => {
  res.render(path.join(__dirname + "/views/about.hbs"));
});

app.get("/students/add", function(req,res){
  
  res.render(path.join(__dirname,"/views/addStudent.hbs"));
});

app.post('/students/add', (req,res) => {
  dataService.addStudent(req.body).then(() => {
      res.redirect("/students");
  })
});

app.post('/student/update', (req, res) => {
  dataService.updateStudent(req.body).then(() => {
      res.redirect("/students");
  })
});

app.get("/images/add", function(req,res){
  
  res.render(path.join(__dirname,"/views/addImage.hbs"));
});

app.post("/images/add", upload.single("imageFile"), (req,res) => {
  res.redirect("/images");
});

app.get("/images", (req,res) => {
  fs.readdir("./public/images/uploaded", function(err,items) {
      res.render("images",{data:items});
  })
});



app.get("/students", (req, res) => {
  if (req.query.status) {
      dataService.getStudentsByStatus(req.query.status).then((data) => {
        res.render("students",{students: data});
      }).catch((err) => {
        res.render({message: "no results"}); 
      })
  }
  else if (req.query.program) {
      dataService.getStudentsByProgramCode(req.query.program).then((data) => {
        res.render("students",{students: data});
      }).catch((err) => {
        res.render({message: "no results"}); 
      })
  }
  else if (req.query.expectedCredential) {
      dataService.getStudentsByExpectedCredential(req.query.expectedCredential).then((data) => {
        res.render("students",{students: data});
      }).catch((err) => {
        res.render({message: "no results"}); 
      })
  }
  else {
    dataService.getAllStudents().then((data)=>{
      res.render("students",{students: data}); 
    }).catch((err)=>{
      res.render({message: "no results"}); 
    })
  }
});

app.get('/students/:studentID', (req,res) => {
  dataService.getStudentById(req.params.value).then((data) => {
    res.render("student",{student: data});
  }).catch((err) => {
    res.render("student",{message: "no results"});
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
    res.render("programs",{programs: data});  
}).catch((err)=>{
  res.render({message: "no results"});
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