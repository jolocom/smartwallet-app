#!/usr/bin/env node

import childProcess from 'child_process'
import {
  abortScript,
  listStagedFiles,
  logStep,
  promisify,
  stageModifiedFiles,
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

const prettifyFiles = (stagedFiles: string) => {
  logStep('Prettifying staged files')
  childProcess.execSync(
    `echo "${stagedFiles}" | xargs ./node_modules/.bin/prettier --ignore-unknown --write`,
  )
  stageModifiedFiles(stagedFiles)
}

const main = async () => {
  try {
    const stagedFiles = listStagedFiles().toString('utf-8')
    if (stagedFiles === '') {
      throw new Error('No files staged')
    }

    await promisify(checkStagedGradleProp)(undefined)
    await promisify(prettifyFiles)(stagedFiles)
    await promisify(lintFiles)(stagedFiles)
  } catch (e: unknown) {
    if (e instanceof Error) {
      abortScript(e.message)
    }
  }
}

;(async () => main())()
