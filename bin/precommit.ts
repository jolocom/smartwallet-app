#!/usr/bin/env node

import {
  abortScript,
  formatOutput,
  listStagedFiles,
  logStep,
  spawnProcess,
} from './commit/utils'
import EventEmitter from 'events'

type ChildProcessVariants = 'gradle.properties' | 'prettier' | 'linter'
type ResultOption = { isFinished: boolean; passed: boolean; cmd: string }
type Result = Record<ChildProcessVariants, ResultOption>

const result: Result = {
  ['gradle.properties']: {
    isFinished: false,
    passed: false,
    cmd: '',
  },
  ['prettier']: {
    isFinished: false,
    passed: false,
    cmd: '',
  },
  ['linter']: {
    isFinished: false,
    passed: false,
    cmd: '',
  },
}

const eventEmmiter = new EventEmitter()
eventEmmiter.on(
  'process-finished',
  (processName: ChildProcessVariants, passed: boolean, cmd: string) => {
    result[processName].isFinished = true
    result[processName].passed = passed
    result[processName].cmd = cmd
    const allFinished = Object.keys(result).every(
      (k) => result[k as ChildProcessVariants].isFinished,
    )
    if (allFinished) {
      const allPassed = Object.keys(result).every(
        (k) => result[k as ChildProcessVariants].passed,
      )

      if (!allPassed) {
        console.log({ result })
        abortScript('Not all checks passed')
      } else {
        console.log('All checks passed')
      }
    }
  },
)

const checkStagedGradleProp = (files: string[]) => {
  logStep('Checking for gradle.properties file')

  const gradlePropertiesFiles = files.filter((p) =>
    /(gradle\.properties)/.exec(p),
  )
  eventEmmiter.emit(
    'process-finished',
    'gradle.properties',
    !gradlePropertiesFiles.length,
    !gradlePropertiesFiles.length
      ? ''
      : `Remove gradle.properties file from staged area`,
  )
}

const prettifyFiles = (files: string[]) => {
  logStep('Prettifying staged files')
  const handleProcessClose = (
    code: number | null,
    dataOutput: string,
    errorOutput: string,
  ) => {
    if (code === 1) {
      const erroredFiles = formatOutput(errorOutput)
        .slice(0, -1)
        .map((o) => o.replace(/^\[warn]/, '').trim())
        .join(' ')
      eventEmmiter.emit(
        'process-finished',
        'prettier',
        false,
        `yarn prettier:format ${erroredFiles}`,
      )
    } else if (code === 2) {
      abortScript('Prettier check failed. Something is wrong with prettier')
    } else {
      eventEmmiter.emit('process-finished', 'prettier', true, '')
    }
  }
  spawnProcess(handleProcessClose, 'npm', ['run', 'prettier:check', ...files])
}

const lintFiles = (files: string[]) => {
  logStep('Checking for linting errors')
  const handleProcessClose = (
    code: number | null,
    dataOutput: string,
    errorOutput: string,
  ) => {
    const output = formatOutput(dataOutput)
    let erroredFiles: string
    if (output.length > 2) {
      erroredFiles = output[output.length - 1]
        .split(' ')
        .filter((f) => Boolean(f))
        .join(' ')
      console.log({ erroredFiles })

      eventEmmiter.emit(
        'process-finished',
        'linter',
        false,
        `yarn lint:fix ${erroredFiles}`,
      )
    } else {
      eventEmmiter.emit('process-finished', 'linter', true, '')
    }
  }
  spawnProcess(handleProcessClose, 'npm', ['run', 'lint:check', ...files])
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
