const _ = require("lodash");
const {
  addToFile, getDataAsArray,
  updateData, deleteData, searchFile
} = require("./fileHandling");

async function getSlots(courses) {
  if (!(courses instanceof Array))
    throw new Error("Expected input to be array");

  if (courses.length <= 0)
    return [];
  let courseDetails = await getDataAsArray("./data/course.dat");

  let studentCourses = _.filter(courseDetails, (eachCourse) => {
    return courses.includes(eachCourse._id);
  })
  let slots = _.map(studentCourses, (element) => {
    return element.slot;
  });
  slots = _.uniq(slots);

  return slots;
}

module.exports.getSlots = getSlots;