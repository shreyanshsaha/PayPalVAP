const {
  addToFile, getDataAsArray,
  updateData, deleteData, searchFile
} = require("./fileHandling");


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

  console.log(courseObj);

  if (["A", "B", "C", "D", "E", "F"].indexOf(courseObj.slot) < 0)
    throw new Error("Invalid course slot");

  courseObj.students = []
  courseObj.professors = []
  courseObj.createdBy = professorObj.username;

  return new Promise((resolve, reject) => {
    professorObj['courses'].push(courseObj['id']);
    courseObj['professors'].push(professorObj['username']);

    // The have to be in the same order because if 
    // course already exists then professor data
    // shouldnt be updated 
    // in short, there is a dependency
    addToFile("./data/course.dat", JSON.stringify(courseObj), true, 'courseID')
      .then(() => updateData("./data/professor.dat", JSON.stringify(professorObj)))
      .then((data)=>resolve(data))
      .catch((err) => {
        // revert all changes
        // TODO: revert all changes properly
        reject(new Error(err));
      });
  });

}

module.exports.addProfessor = addProfessor;
module.exports.createCourse = createCourse;