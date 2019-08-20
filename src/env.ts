const env = process.env['NODE_ENV'] || 'development'
const isDev = env === 'development'
// @ts-ignore unused so far
const isTest = env === 'test'
const isTestE2E = env === 'test-e2e'

export const SKIP_ENTROPY_COLLECTION = isDev || isTest || isTestE2E
export const SKIP_IDENTITY_REGISTRATION = isDev || isTestE2E
