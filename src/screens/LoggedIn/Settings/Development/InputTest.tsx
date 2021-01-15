import React, { useState } from 'react'
import Input from '~/components/Input'
import JoloKeyboardAwareScroll from '~/components/JoloKeyboardAwareScroll'
import ScreenContainer from '~/components/ScreenContainer'
import Section from '../components/Section'

const InputTest = () => {
  const [val, setVal] = useState('')
  return (
    <ScreenContainer
      hasHeaderBack
      customStyles={{ justifyContent: 'flex-start' }}
    >
      <JoloKeyboardAwareScroll showsVerticalScrollIndicator={false}>
        <Section>
          <Section.Title>Block</Section.Title>
          <Input.Block
            placeholder="Write something"
            value={val}
            updateInput={setVal}
          />
        </Section>
        <Section>
          <Section.Title>Underline</Section.Title>
          <Input.Underline
            value={val}
            updateInput={setVal}
            placeholder="Write something"
          />
        </Section>
        <Section>
          <Section.Title>Text Area</Section.Title>
          <Input.TextArea value={val} updateInput={setVal} />
        </Section>
      </JoloKeyboardAwareScroll>
    </ScreenContainer>
  )
}

export default InputTest
