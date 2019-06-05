include CLA (ContributorLicenseAgreement)

## Branching Model

inspired by http://nvie.com/posts/a-successful-git-branching-model/

### Development
- General development takes place on `develop` branch.
- Features are branched off and merged back by the developer
- Naming convention `feature/#{issue-id}-{name-of-feature}`
- Merging back to `develop` may occur in form of a pull request requiring a code review.
- Pull request is mandatory for external developers
- at all times the tests on `develop` branch should pass. The developer that brakes the tests is responsible to resolve as soon as possible

### Testing
- When the developer has successfully tested his feature on `develop` branch (environment: `dev.littlesister.jolocom.com`) he can merge it to `testing` branch (environment: `test.littlesister.jolocom.com`) and assign the related issue to a tester.
- The `testing` branch shall pass at all times
- If the tester finds a bug he will reassign the issue to the original developer who will then fix it on the `testing` branch with a direct commit or as part of a feature branch

### Release
<!-- - When the sprint ends and stakeholder/product owner decide for release an seperate `release` branch is created and deployed (environment: `staging.wallet.jolocom.com`). -->
- This branch is still open for minor changes (i.e. updating the changelog)
- For release the `release` branch is merged into the `master` branch (environment: `littlesister.jolocom.com)
- The commit on the master branch should be tagged.
- Do not forget to merge back to `develop` branch

### Production Bug
- Bugs on `master` branch are fixed in a seperate `hotfix` branch.
- Do not forget to merge back to `develop` branch


## Conventions

### Coding standards

- We use standardsjs (http://standardjs.com/) with a couple of exceptions:
  - Space after ES6 method names is not required `noSpaceRequired() {}`

- Use ESlint for checking syntax consistency automatically.
  - Preferably setup your editor to run ESlint on file save.
  - Use a git pre-commit hook
    1. Rename `.git/hooks/pre-commit.sample` to `pre-commit`
    2. Replace contents by https://github.com/jolocom/little-sister/wiki/ESLint-pre-commit-hook

### Documentation  
- https://en.wikipedia.org/wiki/JSDoc

### Commit messages
  - title is short and references github issue #
  - description is as descriptive as necessary so there is nothing unexpected introduced in commit
### Issue description
  - when and in which environment did the issue occur
  - what was the expected behaviour
  - what was the actual behaviour
  - how to replicate
  - any additional logs that may help debug (yes, maybe even screenshots)
