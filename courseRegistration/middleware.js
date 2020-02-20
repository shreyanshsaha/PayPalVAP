const url = require("url");

middleware = {};
const { debugPrint, errorPrint, infoPrint } = require("./printFunction")
middleware.urlStatus = function (req, res, next) {
  infoPrint('Requested: ' + req.method + " " + req.url);
  if (req.method == "post")
    infoPrint('Data sent using post: ' + JSON.stringify(req.body));
  next();
}

middleware.isStudent = function (req, res, next) {
  if (!req.session.user)
    return res.redirect("/login/student");
  if (req.session.user.type != "student")
    return res.redirect(url.format({
      pathname: "/",
      query: {
        "regError": "User type is not a student!",
      }
    }));
  next();
}

middleware.isProfessor = function (req, res, next) {
  if (!req.session.user)
    return res.redirect("/login/professor");
  if (req.session.user.type != "professor")
    return res.redirect(url.format({
      pathname: "/",
      query: {
        "regError": "User type is not a professor!",
      }
    }));
  next();
}

module.exports = middleware;