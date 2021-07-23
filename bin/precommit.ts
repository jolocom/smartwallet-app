#!/usr/bin/env node

import childProcess from 'child_process'
import {
  abortScript,
  listStagedFiles,
  logStep,
  promisify,
  spawnProcess,
} from './commit/utils'
import { lintFiles } from './commit/lint'

const checkStagedGradleProp = (files: string[]) => {
  logStep('Checking for gradle.properties file')

  const gradlePropertiesFiles = files.filter((p) =>
    /(gradle\.properties)/.exec(p),
  )
  if (gradlePropertiesFiles.length) {
    process.exit(1)
  }
}

const prettifyFiles = (files: string[]) => {
  logStep('Prettifying staged files')

  const handleProcessClose = (
    code: number | null,
    dataOutput: string,
    errorOutput: string,
  ) => {
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
    const formattedStagedFiles = stagedFiles
      .split('\n')
      .filter((path) => Boolean(path))

    checkStagedGradleProp(formattedStagedFiles)
    prettifyFiles(formattedStagedFiles)
    lintFiles(formattedStagedFiles)
  } catch (e: unknown) {
    if (e instanceof Error) {
      abortScript(e.message)
    }
  }
}

;(async () => main())()
