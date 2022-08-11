import React, { useState } from 'react'
import { TextLayoutEvent } from '~/types/props'
import JoloText, { IJoloTextProps } from './JoloText'

interface Props extends IJoloTextProps {
  text: string
  numOfLines: number
  showAsQuestion?: boolean
}

const TruncateAfterFourLines: React.FC<Props> = ({
  text,
  numOfLines,
  color,
  kind,
  weight,
  showAsQuestion,
}) => {
  const [truncatedText, setTruncatedText] = useState('')

  const onTextLayout = (e) => {
    const { lines } = e.nativeEvent

    if (lines.length > numOfLines) {
      const output = lines
        .splice(0, numOfLines)
        .map((line) => line.text)
        .join('')

      showAsQuestion
        ? setTruncatedText(output.slice(0, -4) + '...?')
        : setTruncatedText(output.slice(0, -3) + '...')
    }
  }

  return (
    <JoloText
      // @ts-expect-error
      onTextLayout={onTextLayout}
      color={color}
      kind={kind}
      weight={weight}
    >
      {truncatedText ? truncatedText : text}
    </JoloText>
  )
}

export default TruncateAfterFourLines
