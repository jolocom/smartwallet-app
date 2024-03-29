#!/usr/bin/env node

import { abortScript, listStagedFiles } from './commit/utils'
import EventEmitter from 'events'
import { Table } from 'console-table-printer'

type ChildProcessVariants = 'local.properties'
type ResultOption = { isFinished: boolean; passed: boolean; cmd: string }
type Result = Record<ChildProcessVariants, ResultOption>

const result: Result = {
  ['local.properties']: {
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
    console.log('\x1b[0;33m%s\x1b[0m', `Finished running ${processName}`)
    const allFinished = Object.keys(result).every(
      (k) => result[k as ChildProcessVariants].isFinished,
    )
    if (allFinished) {
      const allPassed = Object.keys(result).every(
        (k) => result[k as ChildProcessVariants].passed,
      )

      if (!allPassed) {
        const t = new Table({
          columns: [
            {
              name: 'index',
              title: 'Process',
              alignment: 'right',
              color: 'blue',
            },
            { name: 'isFinished', title: 'Has finished?', alignment: 'right' },
            { name: 'passed', title: 'Did check pass?', alignment: 'right' },
            {
              name: 'cmd',
              title: 'Fix it by the following instruction',
              alignment: 'left',
            }, // with Title as separate Text
          ],
        })
        Object.keys(result).forEach((p) => {
          const process = p as ChildProcessVariants
          t.addRow(
            { index: p, ...result[process] },
            { color: result[process].passed ? 'green' : 'red' },
          )
        })
        t.printTable()
        abortScript('Not all checks passed')
      } else {
        console.log('')
        console.log('\x1b[0;42m%s\x1b[0m', 'All checks passed')
        console.log('')
      }
    }
  },
)

const checkStagedLocalProp = (files: string[]) => {
  const localPropertiesFiles = files.filter((p) =>
    /(local\.properties)/.exec(p),
  )
  eventEmmiter.emit(
    'process-finished',
    'local.properties',
    !localPropertiesFiles.length,
    !localPropertiesFiles.length
      ? ''
      : `Remove local.properties file from staged area`,
  )
}

const main = () => {
  try {
    console.log('\x1b[0;34m%s\x1b[0m', 'Running check for:')
    console.log('\x1b[0;34m%s\x1b[0m', '\t - staged local.propeties')
    const stagedFiles = listStagedFiles().toString('utf-8')
    if (stagedFiles === '') {
      throw new Error('No files staged')
    }
    const formattedStagedFiles = stagedFiles
      .split('\n')
      .filter((path) => Boolean(path))

    checkStagedLocalProp(formattedStagedFiles)
  } catch (e: unknown) {
    if (e instanceof Error) {
      abortScript(e.message)
    }
  }
}

main()
