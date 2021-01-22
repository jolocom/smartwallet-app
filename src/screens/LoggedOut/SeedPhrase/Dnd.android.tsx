import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import DraggableFlatList from 'react-native-draggable-flatlist'

import { IDndProps } from './SeedPhraseRepeat'
import WordPill from './components/WordPill'

const Dnd: React.FC<IDndProps> = ({ tags, updateTags }) => {
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <DraggableFlatList
        data={tags}
        // NOTE: the padding compensates for the active pill's border, which
        // may distort the content of the pill otherwise
        style={{ paddingHorizontal: 1.7 }}
        // NOTE: allows the pill size to be based on the content, as opposed
        // to being of fixed size
        contentContainerStyle={{ alignItems: 'center' }}
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
    </View>
  )
}

export default Dnd
