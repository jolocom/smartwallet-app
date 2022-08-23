import React, { useState } from 'react'
import JoloText, { IJoloTextProps } from './JoloText'

interface Props extends IJoloTextProps {
  text: string
  numOfLines: number
  suffix: string
}

const TruncateAfterNumberOfLines: React.FC<Props> = ({
  text,
  numOfLines,
  suffix,
  ...rest
}) => {
  const [truncatedText, setTruncatedText] = useState('')

  const onTextLayout = (e) => {
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

export default TruncateAfterNumberOfLines
