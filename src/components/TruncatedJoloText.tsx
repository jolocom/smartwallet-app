import React, { useState } from 'react'
import JoloText, { JoloTextKind, JoloTextWeight } from './JoloText'
import { Colors } from '~/utils/colors'

interface Props {
  text: string
  numOfLines: number
}

const TruncatedJoloText: React.FC<Props> = ({ text, numOfLines }) => {
  const [truncatedText, setTruncatedText] = useState('')

  const onTextLayout = (e) => {
    const { lines } = e.nativeEvent
    let output: string =
      lines.length <= numOfLines
        ? lines
            .splice(0, numOfLines)
            .map((line) => line.text)
            .join('')
        : lines
            .splice(0, numOfLines)
            .map((line) => line.text)
            .join('')
            .slice(0, -4) + '...?'
    setTruncatedText(output)
  }

  return (
    <JoloText // @ts-expect-error
      onTextLayout={onTextLayout}
      color={Colors.white90}
      kind={JoloTextKind.title}
      weight={JoloTextWeight.regular}
    >
      {truncatedText ? truncatedText : text}
    </JoloText>
  )
}

export default TruncatedJoloText
