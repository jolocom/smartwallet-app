// @ts-expect-error no TS declarations
import { SENTRY_DSN as SentryDsn } from '@env'

export const SENTRY_DSN = SentryDsn || ''
