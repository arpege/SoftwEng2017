var GitHubApi = require("github");

var github = new GitHubApi({
    // optional
    debug: false,
    protocol: "https",
    host: "api.github.com", // should be api.github.com for GitHub
    //pathPrefix: "/api/v3", // for some GHEs; none for GitHub
    headers: {
        "user-agent": "My-Cool-GitHub-App" // GitHub is happy with a unique user agent
    },
    //Promise: require('bluebird'),
    followRedirects: false, // default: true; there's currently an issue with non-get redirects, so allow ability to disable follow-redirects
    timeout: 10000
});

var json2csv = require('json2csv');
var fs = require('fs');
var fields = ['Name', 'Stars', 'Forks', 'Open_issues', 'Subscribers'];
var json = [];
const csvFilePath='Liste_ProjetTravaisTorrent.csv'
const csv=require('csvtojson')
var taskToGo = 0;
var taskNotDone = 0;

function Repo(owner, repos) {

    this.owner = owner;
    this.repos = repos;
};

//basic
// github.authenticate({
    // type: "basic",
    // username: "USER",
    // password: "PASSWORD"
// });

var Repos = [];

function getRepo(thisOwner, thisRepo){
  github.repos.get({
  	owner: thisOwner,
  	repo: thisRepo
  }, function(err,res){
    console.log("taskToGo="+taskToGo);
    if(err!=null){
      console.log(err);
      if(err.code==504){
        getRepo(thisOwner,thisRepo);
      }
      else {
        taskNotDone++;
        if(--taskToGo === 0){
          onComplete();
        }
      }
      return;
    }

  	//Repo created date
  	var d = new Date(res.data.created_at)
      dformat = [d.getMonth()+1,
                 d.getDate(),
                 d.getFullYear()].join('/')+' '+
                [d.getHours(),
                 d.getMinutes(),
                 d.getSeconds()].join(':');
  	console.log(thisRepo + " was created on " + dformat);

  	//Repo last update
  	d = new Date(res.data.updated_at)
      dformat = [d.getMonth()+1,
                 d.getDate(),
                 d.getFullYear()].join('/')+' '+
                [d.getHours(),
                 d.getMinutes(),
                 d.getSeconds()].join(':');
  	console.log(thisRepo + " last update was on " + dformat);

  	//Number of stars
  	console.log(thisOwner + " has " + res.data.stargazers_count + " stars");

  	//Number of forks
  	console.log("and he has "+res.data.forks+" forks");

  	//Number of subscribers
  	console.log("and he has "+res.data.subscribers_count+" subscribers");

  	//Number of open issues
  	console.log("and finally he has "+res.data.open_issues+" open issues");

    //Creat JSON
    json.push({Name: thisRepo, Stars: res.data.stargazers_count, Forks: res.data.forks, Open_issues: res.data.open_issues, Subscribers: res.data.subscribers_count});
    if (--taskToGo === 0) {
                // No tasks left, good to go
                onComplete();
            }
   });
 }
 function onComplete(){
   //Write CSV data
   var tocsv = json2csv({ data: json, fields: fields, del: ', ' });

   fs.writeFile('Projet_Github_Travis.csv', tocsv, function(err) {
   if (err) throw err;
   console.log('file saved');
   console.log("taskNotDone:"+taskNotDone);
   });
 }
csv()
.fromFile(csvFilePath)
.on('json',(jsonObj)=>{
  Repos.push(new Repo(jsonObj.owner, jsonObj.repos))
})
.on('done',(error)=>{
  taskToGo = 230;//Repos.length;
  for(var i = Repos.length-230; i<Repos.length; i++){
      getRepo(Repos[i].owner,Repos[i].repos);
};
})
