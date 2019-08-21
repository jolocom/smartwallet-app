import { expect } from 'detox'

/**
 * @async
 * @desc Given a testID of a <Text> element, returns the visible text in it
 *       courtsey of https://github.com/wix/detox/issues/445#issuecomment-514801808
 */
export const readVisibleText = async (testID: string) => {
  try {
    await expect(element(by.id(testID))).toHaveText('_you_cant_possible_have_this_text_')
    throw 'are you kidding me?'
  } catch (error) {
    if (device.getPlatform() === 'ios') {
      const start = `accessibilityLabel was "`
      const end = '" on '
      const errorMessage = error.message.toString()
      const [, restMessage] = errorMessage.split(start)
      const [label] = restMessage.split(end)
      return label
    } else {
      const start = 'Got:';
      const end = '}"';
      const errorMessage = error.message.toString();
      const [, restMessage] = errorMessage.split(start);
      const [label] = restMessage.split(end);
      const value = label.split(',');
      var combineText = value.find((i: string) => i.includes('text=')).trim();
      const [, elementText] = combineText.split('=');
      return elementText;
    }
  }
}
