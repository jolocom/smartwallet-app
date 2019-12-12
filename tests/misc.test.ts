describe('Miscellaneous tests', () => {
  it('should ensure react-native-screens has the required bug fixes', () => {
    const RNScreensPacakgeJson = require('react-native-screens/package.json')
    try {
      expect(RNScreensPacakgeJson.version).toBe('1.0.0-alpha.24')
    } catch (err) {
      throw new Error(
`${err}

We currently use a fork of react-native-screens:
  https://github.com/jolocom/react-native-screens/tree/1.0.0-alpha.24
This is due to this bug/issue:
  https://github.com/kmagiera/react-native-screens/issues/89#issuecomment-559102195
If/when react-native-screens is updated, make sure that this is not an issue any more:
  https://github.com/jolocom/smartwallet-app/pull/1492#issuecomment-54548557

It should probably be fixed in later versions, but it was reported to be re-occurring....

Delete this test when fixed
`,
      )
    }
  })
})
