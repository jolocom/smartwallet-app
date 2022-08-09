import React, { useState } from 'react'
import JoloText, { IJoloTextProps } from './JoloText'

interface Props extends IJoloTextProps {
  text: string
  numOfLines: number
}

const TruncatedJoloText: React.FC<Props> = ({
  text,
  numOfLines,
  color,
  kind,
  weight,
}) => {
  const [truncatedText, setTruncatedText] = useState('')

  const onTextLayout = (e) => {
    const { lines } = e.nativeEvent

    if (lines.length > numOfLines) {
      const output =
        lines
          .splice(0, numOfLines)
          .map((line) => line.text)
          .join('')
          .slice(0, -4) + '...?'

      setTruncatedText(output)
    }
  }

  return (
    <JoloText // @ts-expect-error
      onTextLayout={onTextLayout}
      color={color}
      kind={kind}
      weight={weight}
    >
      {truncatedText ? truncatedText : text}
    </JoloText>
  )
}

export default TruncatedJoloText
