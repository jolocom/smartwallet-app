// https://stackoverflow.com/a/65348832
import 'react-i18next'

declare module 'react-i18next' {
  export interface Resources {
    en: typeof import('./en.json')
    de: typeof import('./de.json')
  }
}
