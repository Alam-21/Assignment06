let students = [];
let programs = [];

module.exports.initialize = () => {
    return new Promise ((resolve, reject) => {
        const fs = require('fs'); 
        fs.readFile('./data/students.json', (err,data) => {
            if (err) {
                reject ('unable to read file');
            }
            else {
                students = JSON.parse(data);
            }
        });

        fs.readFile('./data/programs.json', (err,data)=> {
            if (err) {
                reject ('unable to read file');
            }
            else {
                programs = JSON.parse(data);
            }
        })
        resolve();
    })
};

module.exports.getAllStudents = function(){
    return new Promise((resolve,reject)=>{
        if (students.length == 0) {
            reject("no results returned"); return;
        }

        resolve(students);
    })
}

module.exports.getInternationalStudents = function(){ 
    return new Promise((resolve,reject)=>{
        let i,internationals=[];
        for(i=0;i<students.length;i++){
            if(students[i].isInternationalStudent==true){
                internationals.push(students[i])
            }
            
        }
        if (internationals.length == 0) {
            reject("no results returned"); return;
        }

        resolve(internationals);
    })
}

module.exports.getAllPrograms = function(){
    return new Promise((resolve,reject)=>{
        if (programs.length == 0) {
            reject("no results returned"); return;
        }

        resolve(programs);
    })
}