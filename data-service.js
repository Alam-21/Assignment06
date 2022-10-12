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

module.exports.addStudent = (studentData) => {
    studentData.isInternationalStudent==undefined ? studentData.isInternationalStudent = false : studentData.isInternationalStudent = true;
    let highest=0,integerID;
    for(let i=0;i<students.length;i++){
        integerID=parseInt(students[i].studentID);
        if(integerID>highest){
            highest=integerID;
        }
    }
    studentData.studentID = String(highest + 1);
    students.push(studentData);

    return new Promise((resolve,reject) => {
        if (students.length == 0) {
            reject ('no results');
        }
        else {
            resolve(students);
        }
    })
};

module.exports.getStudentsByStatus = (status) => {
    return new Promise((resolve,reject) => {
        var student_status = students.filter(student => student.status == status);
        if (student_status.length == 0) {
            reject('no results returned');
        }
        resolve(student_status);
    })
};

module.exports.getStudentsByProgramCode = (programCode) => {
    return new Promise((resolve,reject) => {
        var student_program = students.filter(student => student.program == programCode);
        if (student_program.length == 0) {
            reject('no results returned');
        }
        resolve(student_program);
    })
};

module.exports.getStudentsByExpectedCredential = (credential) => {
    return new Promise ((resolve,reject) => {
        var student_credential = students.filter(student => student.expectedCredential == credential);        
        if (student_credential.length == 0) {
            reject ('no results returned');
        }
        resolve(student_credential);
    })
};

module.exports.getStudentById = (sid) => {
    return new Promise((resolve,reject) => {
        var student_id = students.filter(student => student.studentID == sid);
        if (student_id.length == 0) {
            reject('no results returned');
        }
        resolve(student_id);
    })
};