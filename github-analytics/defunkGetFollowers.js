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

// user token
github.authenticate({
    type: "token",
    token: "779c238ab38c25e54c68e84529ba2123393a6a17",
});

// get user followers
github.users.getFollowingForUser({
    username: "defunkt"
}, function(err, res) {

  console.log("defunkt has " + res.data.length + " followers:");
  for(var i=0; i<res.data.length; i++){
    console.log(res.data[i].login);
  }

});
