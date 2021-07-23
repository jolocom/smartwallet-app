import childProcess from 'child_process'

export const promisify =
  <T>(fn: (args: T) => void) =>
  (args: T): Promise<void> =>
    new Promise((res, rej) => {
      try {
        fn(args)
        res()
      } catch (e) {
        rej(e)
      }
    })

export const listStagedFiles = () =>
  childProcess.execSync(`git diff --cached --name-only --diff-filter=ACMR`)

export const stageModifiedFiles = (stagedFiles: string) =>
  childProcess.execSync(`echo "${stagedFiles}" | xargs git add`)

export const abortScript = (msg: string) => {
  console.log('')
  console.log('\x1b[0;33m%s\x1b[0m', msg)
  console.log('\x1b[0;31m%s\x1b[0m', 'Aborting')
  process.exit(1)
}

export const logStep = (msg: string) => {
  console.log('\x1b[0;34m%s\x1b[0m', `${msg}`)
}

export const spawnProcess = (
  onClose: (
    code: number | null,
    dataOutput: string,
    errorOutput: string,
  ) => void,
  cmd: string,
  args?: readonly string[],
  options?: childProcess.SpawnOptionsWithoutStdio,
) => {
  const spawnedProcess = childProcess.spawn(cmd, args, options)

  let dataOutput = ''
  let errorOutput = ''

  spawnedProcess.stdout.on('data', (data) => {
    dataOutput += data.toString() + '\n'
  })
  spawnedProcess.stderr.on('data', (error: Buffer) => {
    errorOutput += error.toString() + '\n'
  })

  spawnedProcess.stderr.pipe(process.stderr)
  spawnedProcess.stdout.pipe(process.stdout)

  spawnedProcess.on('close', (code) => onClose(code, dataOutput, errorOutput))

  return spawnedProcess
}
