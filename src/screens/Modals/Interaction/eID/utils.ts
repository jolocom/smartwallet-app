export const attachRedirectUrl = (baseUrl: string, redirectUrl: string) => {
  const url = new URL(baseUrl)
  url.searchParams.append('redirectUrl', encodeURIComponent(redirectUrl))

  return url.href
}
