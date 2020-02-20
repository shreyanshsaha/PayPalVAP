const _ = require("lodash");

const {
  addToFile, getDataAsArray,
  updateData, deleteData, searchFile
} = require("./fileHandling");

const { dropCourse } = require("./student");
const { debugPrint, errorPrint, infoPrint } = require("./printFunction")


function hashPassword(str) {
  return escape(str);
}

function addProfessor(professorObj) {
  if (!professorObj.username || !professorObj.password)
    throw new Error("Username & password cannot be empty");
  return new Promise((resolve, reject) => {
    addToFile("./data/professor.dat", JSON.stringify(professorObj), "username")
      .then((newProfessorObj) => {
        return resolve(newProfessorObj);
      })
      .catch((err) => {
        reject(new Error(err));
      });
  });
}

function createCourse(professorObj, courseObj) {
  if (!professorObj || !courseObj)
    throw new Error("All params required!");

  if (!professorObj._id)
    throw new Error("Professor obj missing _id!");

  if (
    !courseObj.courseID ||
    !courseObj.name ||
    !courseObj.slot
  )
    throw new Error("CourseObj missing required properties");


  if (!/^[A-Za-z]{3}[0-4]{4}$/.test(courseObj.courseID))
    throw new Error("Invalid courseID format");

  if (["A", "B", "C", "D", "E", "F"].indexOf(courseObj.slot) < 0)
    throw new Error("Invalid course slot");


  if (professorObj.courses.includes(courseObj.courseID.toLowerCase()))
    throw new Error("Professor already taking course " + courseObj.courseID);

  // clone the object
  professorObj = {
    "username": professorObj.username,
    "name": professorObj.name,
    "password": professorObj.password,
    "courses": professorObj.courses,
    "type": professorObj.type,
    "_id": professorObj._id,
  }

  courseObj.students = [];
  courseObj.professor = professorObj._id;


  return addToFile("./data/course.dat", JSON.stringify(courseObj))
    .then((newCourseObj) => {
      professorObj['courses'].push(newCourseObj['_id']);
      updateData("./data/professor.dat", JSON.stringify(professorObj))
      return newCourseObj;
    })
}

function deregisterCourse(professorObj, courseID) {
  if (!professorObj || !courseID || !professorObj.username){
    console.log(professorObj, courseID);
    throw new Error("Professor and CourseID cannot be empty");
  }
  else {
    return searchFile("./data/course.dat", courseID, '_id')
      .then(async (courseObj) => {

        if (!courseObj)
          throw new Error("Cannot get courseObj from file: " + courseID);

        if (courseObj.professor != professorObj._id)
          throw new Error("Professor not authorized to delete course");

        infoPrint("Degeristering course: " + courseObj.courseID);
        // drop course for all students
        infoPrint("Dropping course: " + courseObj.courseID + " for all students");
        for (let i = 0; i < courseObj.students.length; i++) {
          let studentObj = await searchFile("./data/student.dat", courseObj.students[i], '_id');
          if (studentObj)
            await dropCourse(studentObj, courseObj._id);
        }
        // then delete course
        return courseObj;
      })
      .then((courseObj) => deleteData("./data/course.dat", JSON.stringify(courseObj)))
      .then(() => {
        //remove course from professor
        _.remove(professorObj.courses, (element) => {
          return element == courseID;
        });

        _.remove(professorObj.courseDetails, (element)=>{
          return element._id == courseID;
        });

        return professorObj;
      })
      .then(async (professorObj) => {
        // clone the object
        updatedProfessorObj = {
          "username": professorObj.username,
          "name": professorObj.name,
          "password": professorObj.password,
          "courses": professorObj.courses,
          "type": professorObj.type,
          "_id": professorObj._id,
        }
        await updateData("./data/professor.dat", JSON.stringify(updatedProfessorObj))
        return professorObj;
      })
      .catch((err) => { throw new Error(err.stack) });
  }
}

function deleteProfessor(professorObj) {
  if (!professorObj.username || !professorObj.password)
    throw new Error("Username & password cannot be empty");

  // deregister all courses of professor
  // delete professor
  let promise = new Promise(async (resolve, reject) => {
    infoPrint("Deleting professor: " + professorObj.username);
    for (let i = 0; i < professorObj.courses.length; i++) {

      try {
        await deregisterCourse(professorObj, professorObj.courses[i]);
      }
      catch (err) {
        return reject(new Error(err.stack));
      }
    }
    resolve(professorObj)
  });

  return promise
    .then(professorObj => deleteData("./data/professor.dat", JSON.stringify(professorObj)))
    .catch((err) => { throw new Error(err.stack) });
}

function authenticateProfessor(username, password) {
  if (!username || !password)
    throw new Error("Username or password empty");
  else if (username.length < 5 || password.length < 6)
    throw new Error("Invalid length input");

  return getDataAsArray("./data/professor.dat")
    .then((professorArray) => {
      let userDetails = _.find(professorArray, { 'username': username.toLowerCase(), 'password': password });
      if (!userDetails)
        throw new Error("Username and password not found");
      debugPrint("Authenticated user: " + userDetails.username);
      return userDetails;
    });
}


module.exports.addProfessor = addProfessor;
module.exports.createCourse = createCourse;
module.exports.deregisterCourse = deregisterCourse;
module.exports.deleteProfessor = deleteProfessor;
module.exports.authenticateProfessor = authenticateProfessor;