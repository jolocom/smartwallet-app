import React, { useState } from 'react'

import Block from './Block'
import Option from '~/screens/LoggedIn/Settings/components/Option'
import { StyleSheet, View } from 'react-native'
import { Colors } from '~/utils/colors'
import { SuccessTickToggleIcon } from '~/assets/svg'

export interface BlockSelection {
  value: string
  id: string
  disabled?: boolean
}

interface Props {
  selection: BlockSelection[]
  onSelect: (selected: BlockSelection) => void
  initialSelect?: BlockSelection
}

const SingleSelectBlock: React.FC<Props> = ({
  selection,
  onSelect,
  initialSelect,
}) => {
  const [selected, setSelected] = useState(initialSelect ?? selection[0])

  const handleSelect = (selected: BlockSelection) => {
    setSelected(selected)
    onSelect(selected)
  }

  return (
    <Block>
      {selection.map((item, i) => (
        <Option
          key={item.id}
          disabled={item.disabled}
          onPress={() => handleSelect(item)}
          hasBorder={i !== selection.length - 1}
        >
          <Option.Title title={item.value} />
          {item.id === selected.id && !item.disabled ? (
            <SuccessTickToggleIcon />
          ) : (
            <View
              style={[styles.container, item.disabled && styles.disabled]}
            />
          )}
        </Option>
      ))}
    </Block>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 22,
    height: 22,
    borderRadius: 25,
    borderWidth: 0.6,
    borderStyle: 'solid',
    borderColor: Colors.sadGrey,
  },
  disabled: {
    backgroundColor: Colors.sadGrey,
  },
})

export default SingleSelectBlock
