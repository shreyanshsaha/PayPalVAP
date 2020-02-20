var express = require("express");
var router = express.Router();
const middleware = require("../middleware");
const { debugPrint, errorPrint, infoPrint } = require("../printFunction")
const { authenticateStudent, addStudent, registerCourse, deleteStudent, dropCourse } = require("../student");
const { addProfessor, createCourse, deregisterCourse, deleteProfessor, authenticateProfessor } = require("../professor");
const { searchFile, getDataAsArray } = require("../fileHandling");
const { createMessage } = require("../utility");
const { getSlots } = require("../course");

function hashPassword(str) {
  return escape(str);
}

router.get("/login/professor", function (req, res) {
  res.render("login", {
    loginType: "Professor Login",
  });
});

router.post("/login/professor", function (req, res) {
  authenticateProfessor(escape(req.body.username), hashPassword(req.body.password))
    .then(async (userDetails) => {
      userDetails.courseDetails = [];
      // Fill Course Details
      for (let i = 0; i < userDetails.courses.length; i++) {
        let course = await searchFile("./data/course.dat", userDetails.courses[i], '_id');
        console.log(course);
        userDetails.courseDetails.push(course);
      }
      req.session.user = userDetails;
      console.log(userDetails);

      res.redirect("/professor");
    })
    .catch((err) => {
      errorPrint(err.stack);
      req.session.mesage = err.message;
      res.redirect("/professor");
    })
});


router.get("/professor", function (req, res) {
  if (!req.session.user)
    return res.redirect("/");
  message = req.session.message;
  delete req.session.message;
  console.log(req.session.user);
  return res.render("professor", {
    professor: req.session.user,
    message: message,
  });
})


module.exports = router;