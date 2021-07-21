import childProcess from 'child_process'
import { abortScript, logStep } from './utils'

const showLintErrors = (files: string) => {
  const rootDir = process.env.PWD
  const updatedFilePaths = files.split('\n').filter((f) => Boolean(f))
  const lintingProcess = childProcess.spawn(
    'npm',
    ['run', 'lint:showErrors', ...updatedFilePaths],
    {
      cwd: rootDir,
    },
  )
  lintingProcess.stdout.pipe(process.stdout)
  lintingProcess.on('close', () => {
    abortScript('Fix linter errors before committing')
  })
}

export const lintFiles = (files: string) => {
  logStep('Checking for linting errors')
  const updatedFilePaths = files
    .split('\n')
    .filter((f) => Boolean(f))
    .join(' ')
  childProcess.exec(`npm run lint:files ${updatedFilePaths}`, (_, stdout) => {
    const output = stdout.split('\n').filter((d) => Boolean(d))
    /**
     * NOTE: logs at indexes
     * SmartWallet@2.0.0 lint:files - log at index 0
     * eslint --ext .js,.jsx,.ts,.tsx -f ./bin/commit/formatter.js --fix <files> - log at index 1
     * <number_of_errors> - log at index 2
     */
    if (output.length === 2) {
      // no linting errors
    } else {
      console.log(
        '\x1b[0;33m%s\x1b[0m',
        `You have ${output[output.length - 1]} linting error(s)`,
      )
      /**
       * NOTE: abort is delegated to the process below
       */
      showLintErrors(files)
    }
  })
}
