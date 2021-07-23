#!/usr/bin/env node

import childProcess from 'child_process'
import {
  abortScript,
  listStagedFiles,
  logStep,
  promisify,
  spawnProcess,
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

const prettifyFiles = (files: string[]) => {
  logStep('Prettifying staged files')

  const handleProcessClose = (code: number) => {
    if (code === 1) {
      // TODO: format error and display its output process.stderr.write(formattedError>)
      abortScript('Prettier check failed. Fix Prettier errors')
    } else if (code === 2) {
      abortScript('Prettier check failed. Something is wrong with prettier')
    }
  }
  spawnProcess(handleProcessClose, 'npm', ['run', 'prettier:check', ...files])
}

const main = async () => {
  try {
    const stagedFiles = listStagedFiles().toString('utf-8')

    if (stagedFiles === '') {
      throw new Error('No files staged')
    }

    await promisify(checkStagedGradleProp)(undefined)
    prettifyFiles(stagedFiles.split('\n').filter((path) => Boolean(path)))
    // lintFiles(stagedFiles.split('\n').filter((path) => Boolean(path)))
  } catch (e: unknown) {
    if (e instanceof Error) {
      abortScript(e.message)
    }
  }
}

;(async () => main())()
