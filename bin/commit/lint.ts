import childProcess from 'child_process'
import { abortScript, logStep } from './utils'

export const lintFiles = (files: string) => {
  logStep('Checking for linting errors')

  const rootDir = process.env.PWD
  const updatedFilePaths = files.split('\n').filter((f) => Boolean(f))
  const lintingProcess = childProcess.spawn(
    'npm',
    ['run', 'lint:files', ...updatedFilePaths],
    {
      cwd: rootDir,
    },
  )
  let data = ''
  lintingProcess.stdout.on('data', (chunk: Buffer) => {
    // writing all linter output
    data += chunk.toString()
  })
  lintingProcess.on('close', () => {
    const output = data.split('\n').filter((d) => Boolean(d))
    console.log(
      '\x1b[0;33m%s\x1b[0m',
      `You have ${output[output.length - 1]} linting errors`,
    )
    abortScript(`Fix linter errors before committing`)
  })
}
