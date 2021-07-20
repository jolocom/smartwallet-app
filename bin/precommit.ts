#!/usr/bin/env node

import childProcess from 'child_process'
import {
  abortScript,
  listStagedFiles,
  logStep,
  promisify,
} from './commit/utils'
import { lintFiles } from './commit/lint'

const checkStagedGradleProp = () => {
  logStep('Checking for gradle.properties file')

  const gradlePropertiesDiff = childProcess.execSync(
    'git diff --cached --raw ./android/gradle.properties',
  )
  if (gradlePropertiesDiff.toString() !== '') {
    throw new Error('Remove ./android/gradle.properties from staging area')
  }
}

const formatFiles = (stagedFiles: string) => {
  logStep('Prettifying staged files')
  childProcess.execSync(
    `echo "${stagedFiles}" | xargs ./node_modules/.bin/prettier --ignore-unknown --write`,
  )
  childProcess.execSync(`echo "${stagedFiles}" | xargs git add`)
}

const main = async () => {
  try {
    await promisify(checkStagedGradleProp)(undefined)

    const stagedFiles = listStagedFiles().toString('utf-8')
    await promisify(formatFiles)(stagedFiles)

    // lintFiles(stagedFiles)
  } catch (e: unknown) {
    if (e instanceof Error) {
      abortScript(e.message)
    }
  }
}

;(async () => main())()
