import React, { useState } from 'react'

import { TextLayoutEvent, Test } from '~/types/props'
import JoloText, { IJoloTextProps } from './JoloText'

interface Props extends IJoloTextProps {
  text: string
  numOfLines: number
  suffix: string
}

const TruncateTextAfterNumOfLines: React.FC<Props> = ({
  text,
  numOfLines,
  suffix,
  ...rest
}) => {
  const [truncatedText, setTruncatedText] = useState('')

  const onTextLayout = (e: TextLayoutEvent) => {
    console.log('aaa', e.nativeEvent)
    const { lines } = e.nativeEvent

    if (lines.length > numOfLines) {
      const output = lines
        .splice(0, numOfLines)
        .map((line) => line.text)
        .join('')

      suffix
        ? setTruncatedText(output.slice(0, -4) + '...' + suffix)
        : setTruncatedText(output.slice(0, -3) + '...')
    }
  }

  return (
    <JoloText
      // @ts-expect-error
      onTextLayout={onTextLayout}
      {...rest}
    >
      {truncatedText ? truncatedText : text}
    </JoloText>
  )
}

export default TruncateTextAfterNumOfLines
