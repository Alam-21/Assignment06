const Sequelize = require('sequelize');
var sequelize = new Sequelize('wvzinyki', 'wvzinyki', 'C4gNurd3nsRiJ-FVx5kOcllM68hMIoPB', {
    host: 'peanut.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    }
    , query: { raw: true }
});

const Student = sequelize.define('student', {
    studentID: {
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    firstName:Sequelize.STRING,
    lastName:Sequelize.STRING,
    email:Sequelize.STRING,
    phone:Sequelize.STRING,
    addressStreet:Sequelize.STRING,
    addressCity:Sequelize.STRING,
    addressState:Sequelize.STRING,
    addressPostal:Sequelize.STRING,
    isInternationalStudent:Sequelize.BOOLEAN,
    expectedCredential:Sequelize.STRING,
    status:Sequelize.INTEGER,
    registrationDate:Sequelize.STRING
});

const Program = sequelize.define('program', {
    programCode: {
        type:Sequelize.STRING,
        primaryKey:true,
        
    },
    programName:Sequelize.STRING
})

sequelize.authenticate().then(()=>console.log("Connection Success."))
                        .catch((err)=>console.log("Unable to connect to DB."));

Program.hasMany(Student, {foreignKey: 'program'});

module.exports.initialize = () => {
    return new Promise((resolve,reject) => {
        sequelize.sync()
        .then(resolve('database synced'))
        .catch(reject('unable to sync the database'));
    })
};

module.exports.getAllStudents = () =>{
    return new Promise((resolve,reject) => {
        Student.findAll().then(data => {
            resolve(data)
        }).catch(err => reject("no results returned"))
        
    })
}

module.exports.getStudentsByStatus = (status) => {
    return new Promise((resolve,reject) => {
        Student.findAll({
            where:{
                status: status
            }
        })
        .then(data => resolve(data))
        .catch(err=>reject('no results returned'))
    })
};

module.exports.getStudentsByProgramCode = (programCode) => {
    return new Promise((resolve,reject) => {
        Student.findAll({
            where: {
                program:program
            }
        })
        .then(data => resolve(data))
        .catch(err => reject(err))
    })
};

module.exports.getStudentsByExpectedCredential = (credential) => {
    return new Promise((resolve,reject) => {
        Student.findAll({
            where: {
                expectedCredential: credential
            }
        })
        .then(resolve(Student.findAll({ where: { expectedCredential: credential }})))
        .catch(reject('no results returned'))
    })
};


module.exports.getStudentById = (sid) => {
    return new Promise((resolve,reject) => {
        Student.findAll({
            where: {
                studentID:sid
            }
        })
        .then(data => resolve(data[0]))
        .catch(err=>reject('no results returned'))
    })
};

module.exports.addStudent = (studentData) => {
    return new Promise((resolve,reject) => {
        studentData.isInternationalStudent = studentData.isInternationalStudent ? true : false;
        for (var i in studentData) {
            if (studentData[i] == "") { studentData[i] = null; }
        }

        Student.create(studentData)
        .then(resolve(Student.findAll()))
        .catch(err => reject('unable to create student'))
    })
};

module.exports.updateStudent = (studentData) => {
    return new Promise((resolve,reject) => {
        studentData.isInternationalStudent = (studentData.isInternationalStudent) ? true : false;

        for (var i in studentData) {
            if (studentData[i] == "") { studentData[i] = null; }
        }

        Student.update(studentData,{
            where:{
                studentID:studentData.studentID
            }
        })
        
        .then(resolve(Student.findAll()))
        .catch((err)=>{
            res.status(500).send("Unable to Update Student");
      });
      
    })
};

module.exports.deleteStudentById = id => {
    return new Promise((resolve,reject) => {
        Student.destroy({
            where: {
                studentID: id
            }
        })
        .then(resolve('destroyed'))
        .catch(reject('unable to delete student'))
    })
};

module.exports.getPrograms = function(){
    return new Promise((resolve, reject) => {
        Program.findAll()
        .then(data => { resolve(data); })
        .catch(err => { reject('no results returned'); })
    })
};

module.exports.addProgram = (programData) => {
    return new Promise((resolve,reject) => {
        for (var i in programData) {
            if (programData[i] == "") { programData[i] = null; }
        }

        Program.create(programData)
        .then(resolve(Program.findAll()))
        .catch(reject('unable to create program'))
    })
};

module.exports.updateProgram = (programData) => {
    return new Promise((resolve,reject) => {
        for (var i in programData) {
            if (programData[i] == "") { programData[i] = null; }
        }

        Program.update(programData,{
            where:{
                programCode:programData.programCode
            }
        })
        .then(resolve(Program.findAll()))
        .catch(err =>{
            res.status(500).send("Unable to Update Program");
      });
    })  
};

module.exports.getProgramByCode = pcode => {
    return new Promise((resolve,reject) => {
        Program.findAll({
            where: {
                programCode:pcode
            }
        })
        .then(data => resolve(data))
        .catch(err=>reject('no results returned'))
    })
};

module.exports.deleteProgramByCode = pcode => {
    return new Promise((resolve,reject) => {
        Program.destroy({
            where: {
                programCode: pcode
            }
        })
        .then(resolve('destroyed'))
        .catch(reject('unable to delete program'))
    })
};





module.exports.getInternationalStudents = function(){ 
    return new Promise((resolve,reject)=>{
        reject();
    })
};













