import { expect } from 'detox'

// https://github.com/wix/Detox/blob/master/docs/APIRef.Matchers.md#bytypenativeviewtype
const nativeTypesNames = ['Text', 'Image']
const buildTypeMap = (typeNameBuilder: (typeName: string) => string): {[k: string]: string} => {
  let ret = {}
  nativeTypesNames.forEach(typeName => ret[typeName] = typeNameBuilder(typeName))
  return ret
}
export const nativeTypes = device.getPlatform() == 'android' ?
  buildTypeMap(typeName => `android.widget.${typeName}View`) :
  buildTypeMap(typeName => `RCT${typeName}View`)

/**
 * @async
 * @desc Returns the visible text from the element with testID
 *       initially based on https://github.com/wix/detox/issues/445#issuecomment-514801808
 * @param testID the testID of a <Text> element or a parent of one or more
 *               <Text> elements. If more than one is found the result is
 *               concatted
 * @param index  index of <Text> element value to return, instead of all
 *               concatted children. Leave undefined for default behavior
 * @returns visibleText all text visible inside the element with testID
 */
export const readVisibleText = async (testID: string, index: number | undefined = undefined): Promise<string> => {
  let el = element(by.id(testID).and(by.type(nativeTypes.Text)))
  if (index !== undefined) {
    //console.error('with index', index)
    el = el.atIndex(index)
  }
  try {
    await expect(el).toBeVisible()
  } catch (err) {
    // try looking for a text child
    el = element(by.type(nativeTypes.Text).withAncestor(by.id(testID)))
    if (index !== undefined) {
      //console.error('with index with text child', index)
      el = el.atIndex(index)
    }

    try {
      //console.error('expect with child')
      await expect(el).toBeVisible()
    } catch (err) {
      const msg = err.message.toString()
      if (msg.indexOf('matches multiple views in the hierarchy') == -1) {
        // if it is any other error than matching multiple views, we raise it
        //console.error('expect with child error', err)
        throw err
      }

      // if there are multiple matching Text views, we try to get the
      // concatenated text
      const MAX_TEXT_CHILDREN = 100
      const texts = []
      for (let i = 0; i < MAX_TEXT_CHILDREN; i++) {
        try {
          const text = await readVisibleText(testID, i)
          texts.push(text)
        } catch (err) {
          // TODO how do we know there are no more children vs. some other
          //      error?
          break
        }
      }

      return texts.join('')
    }
  }

  try {
    await expect(el).toHaveText('_you_cant_possible_have_this_text_')
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
      let combineText = value.find((i: string) => i.includes('text='))
      if (!combineText) {
        throw new Error(
          `readVisibleText failed! '${testID}' must be a testID of a <Text> element (or a parent of one)`
        )
      } else {
        combineText = combineText.trim()
      }
      const [, elementText] = combineText.split('=')
      return elementText
    }
  }
}
