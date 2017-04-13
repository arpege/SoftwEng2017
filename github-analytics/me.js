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
    timeout: 5000
});
 
 github.repos.get({
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
	
	
 });