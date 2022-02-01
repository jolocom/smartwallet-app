import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import DraggableFlatList from 'react-native-draggable-flatlist'

import { IDndProps } from './types'
import WordPill from './components/WordPill'
import { ArrowDown } from '~/assets/svg'
import BP from '~/utils/breakpoints'

const Dnd: React.FC<IDndProps> = ({ tags, updateTags }) => {
  return (
    <>
      <DraggableFlatList
        data={tags}
        // NOTE: allows the pill size to be based on the content, as opposed
        // to being of fixed size
        contentContainerStyle={{
          alignItems: 'center',
        }}
        renderItem={({ item, index, drag, isActive }) => (
          <TouchableOpacity activeOpacity={1} onPressIn={drag}>
            <WordPill.Repeat key={index} active={isActive}>
              {item}
            </WordPill.Repeat>
          </TouchableOpacity>
        )}
        renderPlaceholder={() => <WordPill.Placeholder />}
        keyExtractor={(item, index) => `pill-${item}-${index}`}
        onDragEnd={({ data }) => updateTags(data)}
      />
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          right: BP({ default: -60, small: -40, xsmall: -40 }),
          top: 0,
          bottom: 0,
        }}
      >
        <ArrowDown />
      </View>
    </>
  )
}

export default Dnd
