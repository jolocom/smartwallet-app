const yargs = require('yargs')
const yaml = require('js-yaml')
const fs = require('fs')
const GitHubApi = require('github')

function parseArgs() {
  const args = yargs
    .usage(
      'Usage: GITHUB_ACCESS_TOKEN=<token> $0 --owner <username> ' +
      '--repo <repo> --issues <file.yaml>'
    )
    .argv
  args.accessToken = process.env.GITHUB_ACCESS_TOKEN

  return args
}

function parseIssues(path) {
  return yaml.safeLoad(fs.readFileSync(path).toString())
}

function setupGithubAPI(args) {
  const github = new GitHubApi({
    debug: true,
    protocol: 'https',
    host: 'api.github.com',
    headers: {
      'user-agent': 'little-sister'
    },
    Promise: require('bluebird'),
    // default: true; there's currently an issue with non-get redirects,
    // so allow ability to disable follow-redirects
    followRedirects: false,
    timeout: 5000
  })
  github.authenticate({
    type: 'token',
    token: args.accessToken
  })
  return github
}

function main(args) {
  const issues = parseIssues(args.issues)
  const github = setupGithubAPI(args)
  const promises = issues.forEach((issue) => {
    return github.issues.create({
      owner: args.owner,
      repo: args.repo,
      title: issue.title,
      body: issue.body,
      labels: issue.labels
    })
  })
  Promise.all(promises)
}

if (require.main === module) {
  main(parseArgs())
}
