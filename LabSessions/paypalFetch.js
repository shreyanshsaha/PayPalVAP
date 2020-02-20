const fetch = require("node-fetch");
const _ = require("lodash");
const url = "https://api.github.com/orgs/paypal";

var fetchObj = fetch(url);

function fetchUrl(url) {
  console.log("URL: " + url);
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((res) => {
        resolve(res.json())
      })
      .catch((err) => reject(err));
  });
}

// fetchUrl(url)
//   .then((data) =>
//     fetchUrl(data['repos_url'])
//   )
//   .then((data) => {
//     console.log("\n\nRepo List: ");
//     for(let i=0; i<5; i++)
//       console.log(data[i]['html_url'])
//   })
//   .catch((err) => console.log(err));

// fetchUrl(url)
//   .then((data) => {
//     member_url = /https:\/\/[a-zA-Z\/\.]*/.exec(data['members_url'])[0]
//     console.log(member_url);
//     return fetchUrl(member_url);
//   })
//   .then((data) => {
//     console.log("\n\nMembers List: ");
//     for(let i=0; i<5; i++)
//     console.log(data[i]['login'])
//   })
//   .catch((err) => console.log(err));

var openIssuesList = [];

fetchUrl(url)
  .then((data) =>{
    console.log(data)
    return fetchUrl(data['repos_url']);
  })
  .then((data) => {
    for(let i=0; i<5; i++){
      issues_url = /https:\/\/[a-zA-Z\/\.\-]*/.exec(data[i]['issues_url'])[0]
      console.log(issues_url);
      fetchUrl(issues_url)
      .then((data)=>{
        console.log(data);
        // openIssuesList.push(data[i]); 
        // for(let i=0; i<data.length; i++)
        // if(data[i]['state']=='open')
        // console.log(data);
      });
    }
    return openIssuesList
      // console.log(data)
      // fetchUrl(data["issues_url"])
      //   .then((issues)=>{
      //     console.log(issues);
      //   })
      //   .catch((err)=>console.log(err));
  }).then((data)=>console.log(data))
  .catch((err) => console.log(err));


// /*
// List of courses
// create a screen which will let us
//   add courses (by professors), students,
//   subscribe student to course
//   login mandatory
//   professors



// */