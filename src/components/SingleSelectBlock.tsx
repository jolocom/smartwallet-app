import React, { useState } from 'react'

import Block from './Block'
import Option from '~/screens/LoggedIn/Settings/components/Option'
import ToggleIcon from './ToggleIcon'

export interface BlockSelection {
  value: string
  id: string
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
      {selection.map((item) => (
        <Option onPress={() => handleSelect(item)}>
          <Option.Title title={item.value} />
          <ToggleIcon selected={item.id === selected.id} />
        </Option>
      ))}
    </Block>
  )
}

export default SingleSelectBlock
