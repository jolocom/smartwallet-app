import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import JoloText, { JoloTextKind } from '~/components/JoloText'

import { strings } from '~/translations/strings'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import Option from './Option'

const INQUIRIES_LIST = [
  strings.POSSIBLE_PARTNERSHIP,
  strings.ISSUES_WITH_THE_APP,
  strings.I_LOST_MY_WALLET,
  strings.HOW_TO_BECOME_PART_OF_THE_PROJECT,
]

const Dropdown = () => {
  const [selectedOption, setSelectedOption] = useState(strings.SELECT_AN_OPTION)
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpanded = () => {
    setIsExpanded((prevState) => !prevState)
  }

  return (
    <View style={styles.container}>
      <View style={styles.optionContainer}>
        <Option onPress={toggleExpanded}>
          <Option.Title
            title={selectedOption}
            color={isExpanded ? Colors.white30 : Colors.white70}
          />
        </Option>
      </View>
      {isExpanded ? (
        <View style={[styles.optionContainer, styles.dropdownSpecificOptions]}>
          {INQUIRIES_LIST.map((option, idx) => (
            <Option>
              <Option.Title title={option} color={Colors.white} />
            </Option>
          ))}
        </View>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  // TODO: this has to be removed; this should be some kind of a styled component
  optionContainer: {
    backgroundColor: Colors.haiti,
    elevation: 15,
    width: '100%',
    borderRadius: 8,
  },
  dropdownSpecificOptions: {
    borderColor: Colors.white21,
    borderWidth: 1,
    marginTop: 15,
  },
})

export default Dropdown
