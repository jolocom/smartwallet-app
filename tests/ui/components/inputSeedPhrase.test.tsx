// import React from 'react'
// import { shallow } from 'enzyme'
// import InputSeedPhraseComponent from '../../../src/ui/recovery/components/inputSeedPhrase'
// import { WordState } from '../../../src/ui/recovery/container/inputSeedPhrase'
// 
// describe('inputSeedPhrase component', () => {
//   const makeProps = (
//     input: string = '',
//     suggestions: string[] = [],
//     isLoading: boolean = false,
//   ) => ({
//     inputValue: input,
//     markedWord: 0,
//     suggestions,
//     isMnemonicValid: false,
//     inputState: WordState.editing,
//     mnemonic: [],
//     isLoading,
//     handleTextInput: jest.fn(),
//     selectWord: jest.fn(),
//     handleButtonPress: jest.fn(),
//     inputRef: jest.fn(),
//     handleDoneButton: jest.fn(),
//     handleNextWord: jest.fn(),
//     handlePreviousWord: jest.fn(),
//     handleBackButton: jest.fn(),
//   })
// 
//   it('matches the snapshot at start', () => {
//     const props = makeProps()
//     const rendered = shallow(<InputSeedPhraseComponent {...props} />)
//     expect(rendered).toMatchSnapshot()
//   })
// 
//   it('matches the snapshot while inputting', () => {
//     const props = makeProps('in', ['insert', 'input'])
//     const rendered = shallow(<InputSeedPhraseComponent {...props} />)
//     expect(rendered).toMatchSnapshot()
//   })
//   it('matches the snapshot when loading', () => {
//     const props = makeProps('', [], true)
//     const rendered = shallow(<InputSeedPhraseComponent {...props} />)
//     expect(rendered).toMatchSnapshot()
//   })
// })
