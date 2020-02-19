const _ = require("lodash");

const {
  addToFile, getDataAsArray,
  updateData, deleteData, searchFile
} = require("./fileHandling");

const { dropCourse } = require("./student");
const { debugPrint, errorPrint, infoPrint } = require("./printFunction")

function addProfessor(professorObj) {
  if (!professorObj.username || !professorObj.password)
    throw new Error("Username & password cannot be empty");
  return new Promise((resolve, reject) => {
    addToFile("./data/professor.dat", JSON.stringify(professorObj))
      .then(() => {
        resolve(professorObj);
      })
      .catch((err) => {
        reject(new Error(err));
      });
  });
}

function createCourse(professorObj, courseObj) {
  if (!professorObj || !courseObj)
    throw new Error("All params required!");
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

  if (professorObj.courses.include(courseObj.courseID))
    throw new Error("Professor already taking course " + courseID);

  courseObj.students = []
  courseObj.professor = professorObj.username;

  return new Promise((resolve, reject) => {
    professorObj['courses'].push(courseObj['id']);

    // The have to be in the same order because if 
    // course already exists then professor data
    // shouldnt be updated 
    // in short, there is a dependency
    addToFile("./data/course.dat", JSON.stringify(courseObj), false)
      .then(() => updateData("./data/professor.dat", JSON.stringify(professorObj)))
      .then(resolve)
      .catch((err) => {
        // revert all changes
        // TODO: revert all changes properly
        reject(new Error(err));
      });
  });

}

function deregisterCourse(professorObj, courseID) {
  if (!professorObj.username || !courseID)
    throw new Error("Username and CourseID cannot be empty");

  return searchFile("./data/course.dat", courseID, 'courseID')
    .then(async (courseObj) => {

      if (!courseObj)
        throw new Error("Cannot get courseObj from file: " + courseID);
      infoPrint("Degeristering course: " + courseObj.courseID);
      // drop course for all students
      infoPrint("Dropping course: " + courseObj.courseID + " for all students");
      for (let i = 0; i < courseObj.students.length; i++) {
        let studentObj = await searchFile("./data/student.dat", courseObj.students[i]);
        if (studentObj)
          await dropCourse(studentObj, courseID);
      }

      // then delete course
      return courseObj;
    })
    .then((courseObj) => deleteData("./data/course.dat", JSON.stringify(courseObj), 'courseID'))
    .then(() => {
      //remove course from professor
      _.remove(professorObj.courses, (element) => {
        return element == courseID;
      });
      return professorObj;

    })
    .then(professorObj => updateData("./data/professor.dat", JSON.stringify(professorObj)))
    .catch((err) => { throw new Error(err.stack) });
}

function deleteProfessor(professorObj) {
  if (!professorObj.username || !professorObj.password)
    throw new Error("Username & password cannot be empty");

  // deregister all courses of professor
  // delete professor
  let promise = new Promise(async (resolve, reject) => {
    infoPrint("Deleting professor: " + professorObj.username);
    for (let i = 0; i < professorObj.courses.length; i++){
      
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
    .then(professorObj=>deleteData("./data/professor.dat", JSON.stringify(professorObj)))
    .catch((err) => { throw new Error(err.stack) });
}

module.exports.addProfessor = addProfessor;
module.exports.createCourse = createCourse;
module.exports.deregisterCourse = deregisterCourse;
module.exports.deleteProfessor = deleteProfessor;