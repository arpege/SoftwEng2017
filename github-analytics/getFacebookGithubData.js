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
    Promise: require('bluebird'),
    followRedirects: false, // default: true; there's currently an issue with non-get redirects, so allow ability to disable follow-redirects
    timeout: 10000
});

var json2csv = require('json2csv');
var fs = require('fs');
var fields = ['Name', 'Stars', 'Forks', 'Open_issues'];
var json = [];

function getAllOrgRepos(orgName) {
  var repos = [];

  function pager(res) {
    repos = repos.concat(res);
    if (github.hasNextPage(res)) {
      return github.getNextPage(res)
        .then(pager);
    }
    return repos;
  }

  return github.repos.getForOrg({ org: orgName})
    .then(pager);
}


function commits_count(res){
  var commits_counter = 0;

  function pager_commit(res) {
    for(var i=0; i<res.data.length; i++){
      commits_counter += res.data[i].contributions;
    }
    //console.log("Commits counter: "+commits_counter);
    if (github.hasNextPage(res)) {
      //console.log("Has next page: true");
      return github.getNextPage(res).then(pager_commit);
    }

    return commits_counter;
  }

  return pager_commit(res);

}

function test(orgRepos){
  var cnt = 0;

  for(var r=0; r<orgRepos.data.length; r++){
    github.repos.getContributors({owner: orgRepos.data[r].owner.login, repo: orgRepos.data[r].name, anon: 1},
    function(err,res){
      //console.log(res);
      for(var i=0; i<res.data.length; i++){
        cnt += res.data[i].contributions;
      }
      if(github.hasNextPage(res)){
        github.getNextPage({res},test(res));
      }
      return cnt;
    });

    console.log("Repo: " + orgRepos.data[r].name+"Commits count: "+cnt);
  }
  return cnt;
}

function writeCSV(){
  //Write CSV data
  var csv = json2csv({ data: json, fields: fields, del: ', ' });

  fs.writeFile('file.csv', csv, function(err) {
    if (err) throw err;
    console.log('file saved');
  });
}

getAllOrgRepos("facebook")
  .then(function(orgRepos) {
    for(var i=0; i<orgRepos.length; i++){
      for(var j=0; j<orgRepos[i].data.length; j++){
        //Display repo name
        console.log(orgRepos[i].data[j].name);

        //Number of stars
      	console.log(orgRepos[i].data[j].stargazers_count+" stars");

      	//Number of forks
      	console.log(orgRepos[i].data[j].forks+" forks");

      	//Number of subscribers
      	//console.log(orgRepos[i].data[j].subscribers_count+" subscribers");

      	//Number of open issues
      	console.log(orgRepos[i].data[j].open_issues+" open issues");

        //Number of commits
        //github.repos.getContributors({ owner: orgRepos[i].data[j].owner.login, repo: orgRepos[i].data[j].name, anon: 1 }).then(commits_count).then(function(res){console.log("Total Commit: "+res);});

        //test(orgRepos[i].data[j].owner.login, orgRepos[i].data[j].name);

        //Creat JSON
        json.push({Name: orgRepos[i].data[j].name, Stars: orgRepos[i].data[j].stargazers_count, Forks: orgRepos[i].data[j].forks, Open_issues: orgRepos[i].data[j].open_issues});

      }

    }
    // //Display repo name
    // console.log(orgRepos[0].data[1].name);
    // var com;
    // github.repos.getContributors({ owner: orgRepos[0].data[1].owner.login, repo: orgRepos[0].data[1].name, anon: 1 }).then(commits_count).then(function(res){console.log("Total Commit: "+res);});


  }).then(writeCSV);

/*  github.repos.get({
	owner: "mikedeboer",
	repo: "node-github"
}, function(err,res){
	//console.log(err, res);

	//Repo created date
	var d = new Date(res.data.created_at)
    dformat = [d.getMonth()+1,
               d.getDate(),
               d.getFullYear()].join('/')+' '+
              [d.getHours(),
               d.getMinutes(),
               d.getSeconds()].join(':');
	console.log("node-github was created on "+dformat);

	//Repo last update
	d = new Date(res.data.updated_at)
    dformat = [d.getMonth()+1,
               d.getDate(),
               d.getFullYear()].join('/')+' '+
              [d.getHours(),
               d.getMinutes(),
               d.getSeconds()].join(':');
	console.log("node-github last update was on "+dformat);

	//Number of stars
	console.log("mikedeboer has "+res.data.stargazers_count+" stars");

	//Number of forks
	console.log("and he has "+res.data.forks+" forks");

	//Number of subscribers
	console.log("and he has "+res.data.subscribers_count+" subscribers");

	//Number of open issues
	console.log("and finally he has "+res.data.open_issues+" open issues");


 }); */
