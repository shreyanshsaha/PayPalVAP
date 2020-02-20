const fetch = require("node-fetch");
const _ = require("lodash");
const url = "https://www.google.com";

var fetchObj = fetch(url);
fetchObj.then((data)=>console.log(data));