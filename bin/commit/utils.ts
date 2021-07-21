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
  childProcess.execSync(
    // `git diff --cached --name-only --diff-filter=ACMR | sed 's| |\\ |g'`,
    `git diff --cached --name-only --diff-filter=ACMR`,
  )

export const stageModifiedFiles = (stagedFiles: string) =>
  childProcess.execSync(`echo "${stagedFiles}" | xargs git add`)

export const abortScript = (msg: string) => {
  console.log('\x1b[0;33m%s\x1b[0m', `Instruction: ${msg}`)
  console.log('\x1b[0;31m%s\x1b[0m', 'Aborting')
  process.exit(1)
}

export const logStep = (msg: string) => {
  console.log('\x1b[0;34m%s\x1b[0m', `- ${msg}`)
}
