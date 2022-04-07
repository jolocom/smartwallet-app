import { cloneRepo, catFile, readEnv, writeEnv } from './utils'
import { useToasts } from '~/hooks/toasts'

const configureEnv = async () => {
  const path = await cloneRepo('dev@hetz1.jolocom.io', 'common-secrets')
  const sentryDSN = await catFile(path + '/sentry/dsn.txt')
  const sentryAuthToken = await catFile(path + '/sentry/auth-token.txt')
  const branchLiveKey = await catFile(path + '/branch/key-live.txt')

  console.log('Writing secrets to the environmental config (.env)')
  await writeEnv('.env', {
    SENTRY_DSN: sentryDSN,
    SENTRY_AUTH_TOKEN: sentryAuthToken,
    BRANCH_LIVE_KEY: branchLiveKey,
    BRANCH_URL: 'jolocom.app.link',
  })
}

const configureSentry = async () => {
  const { SENTRY_AUTH_TOKEN } = await readEnv('.env')

  if (!SENTRY_AUTH_TOKEN || !SENTRY_AUTH_TOKEN.length) {
    console.log(
      '\x1b[4;31m%s\x1b[0m',
      'Error! Could not find the Sentry Authentication token in the environmental config.',
    )
    return
  }

  const sentryProperties = {
    'defaults.url': 'https://sentry.io/',
    'defaults.org': 'jolocom',
    'defaults.project': 'smartwallet',
    'http.keepalive': 'false',
    'auth.token': SENTRY_AUTH_TOKEN,
  }

  console.log('Writing the Sentry config (sentry.properties) for Android')
  await writeEnv('./android/sentry.properties', sentryProperties)
  console.log('Writing the Sentry config (sentry.properties) for iOS')
  await writeEnv('./ios/sentry.properties', sentryProperties)
}

const main = async () => {
  if (process.argv.length === 2) {
    await configureEnv()
    await configureSentry()
  } else if (process.argv.includes('sentry')) {
    await configureSentry()
  }
}

main().catch((err) => console.log(err))
