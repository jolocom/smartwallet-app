import { logStep, spawnProcess } from './utils'

export const lintFiles = (files: string[]) => {
  logStep('Checking for linting errors')
  // TODO: use tuple for types
  const handleProcessClose = (
    code: number | null,
    dataOutput: string,
    errorOuput: string,
  ) => {
    console.log('code: ', code)
    console.log('dataOutput: ', dataOutput)
    console.log('errorOuput: ', errorOuput)
  }
  spawnProcess(handleProcessClose, 'npm', ['run', 'lint:files', ...files])
}
