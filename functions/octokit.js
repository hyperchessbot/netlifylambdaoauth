const Octokit = require("@octokit/rest")

const DEFAULT_OWNER     = "hyperchessbot"
const DEFAULT_REPO      = "discordlambda"

const octokit = Octokit({
    auth: process.env.HYPER_GITHUB_TOKEN,
    userAgent: "Hyper Chess"
})

function putfile(ownerOpt, repoOpt, path, content, sha, callback){
    let owner = ownerOpt || DEFAULT_OWNER
    let repo = repoOpt || DEFAULT_REPO

    console.log("put", owner, repo, path, "size", content.length, "sha", sha)

    let contentb64 = new Buffer.from(content).toString("base64")

    let req = {
        owner: owner,
        repo: repo,
        path: path,
        content: contentb64,        
        message: path,
        "commiter.name": "easychessanimations",
        "commiter.email": "chessbotroulette@gmail.com",        
    }

    if(sha){
        req.sha = sha
    }

    octokit.repos.createOrUpdateFile(req).then(
        res => {
            console.log("ok writing", owner, repo, path)            
            callback({
                error: false,
                status: `Written ${path} .`
            })
        },
        err => {
            console.log("failed writing", owner, repo, path)            
            callback({
                error: true,
                status: `Failed writing ${path} .`
            })
        }
    )
}

function getfile(ownerOpt, repoOpt, path, callback, errcallback){
    octokit.repos.getContents({
        owner: ownerOpt || DEFAULT_OWNER,
        repo: repoOpt || DEFAULT_REPO,
        path: path        
    }).then(
        res => callback(res),
        err => errcallback(err)
    )
}

function getrepo(ownerOpt, repoOpt){
    octokit.repos.get({
        owner: ownerOpt || DEFAULT_OWNER,
        repo: repoOpt || DEFAULT_REPO  
    }).then(
        res => console.log(res),
        err => console.log(err)
    )
}

function update(ownerOpt, repoOpt, UPDATE_PATH, content, callback){        
    getfile(ownerOpt, repoOpt, UPDATE_PATH,
        res => {
            putfile(ownerOpt, repoOpt, UPDATE_PATH, content, res.data.sha, callback)
        },
        _ => {
            putfile(ownerOpt, repoOpt, UPDATE_PATH, content, null, callback)
        }
    )
}

module.exports = {
    DEFAULT_REPO: DEFAULT_REPO,
    DEFAULT_OWNER: DEFAULT_OWNER,
    getrepo: getrepo,
    update: update
}