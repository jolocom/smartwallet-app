#!/usr/bin/env node

import child_process from 'child_process'

const promisify = (
  fn: () => boolean,
): ((failureMsg: string) => Promise<boolean>) => {
  return (failureMsg) =>
    new Promise((res, rej) => {
      const result = fn()
      if (result) res(result)
      else rej(failureMsg)
    })
}

const checkStagedGradleProp = promisify(() => {
  // TODO: indicate process start
  // check that changes to android/gradle.properties have not been staged
  const gradlePropertiesDiff = child_process.execSync(
    'git diff --cached --raw ./android/gradle.properties',
  )
  if (gradlePropertiesDiff.toString() != '') {
    return false
  }
  return true
})

const formatFiles = promisify(() => {
  // TODO: indicate process start
  const filesStaged = child_process.execSync(
    `git diff --cached --name-only --diff-filter=ACMR | sed 's| |\\ |g'`,
  )
  // TODO: prompt if continue formatting staged files
  child_process.execSync(
    `echo "${filesStaged}" | xargs ./node_modules/.bin/prettier --ignore-unknown --write`,
  )
  child_process.execSync(`echo "${filesStaged}" | xargs git add`)
  return true
})

const main = async () => {
  try {
    await checkStagedGradleProp('Staged changes to gradle properties found')
    await formatFiles('Failed running prettier')
  } catch (e) {
    console.log('\x1b[0;33m%s\x1b[0m', e)
    console.log('\x1b[0;31m%s\x1b[0m', 'Aborting')

    // TODO: suggest skipping the file and continue with the rest of script;
    process.exit(1)
  }
}

;(async () => main())()
