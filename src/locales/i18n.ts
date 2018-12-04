const RNLanguages = require('react-native-languages');
import I18n from 'i18n-js';

const de = require('./de').default;
const nl = require('./nl').default;

I18n.locale = RNLanguages.language.split('-')[0];
I18n.defaultLocale = 'en'
I18n.fallbacks = true;
I18n.missingTranslation = scope => scope;
I18n.translations = {
  de,
  nl
};

export const getI18nImage = (fileName: String) : File => {
  const locale = Object.keys(I18n.translations).includes(I18n.locale)
    ? I18n.locale
    : I18n.defaultLocale;

  const image = require(`src/resources/img/${locale}/${fileName}`);

  return image;
}

export default I18n;
