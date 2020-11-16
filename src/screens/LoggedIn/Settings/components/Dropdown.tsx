import React, { useEffect, useMemo, useRef, useState } from 'react'
import { View, StyleSheet, Animated } from 'react-native'
import Block from '~/components/Block'
import { SelectableProvider, useSelectableState } from '~/components/Selectable'

import { strings } from '~/translations/strings'
import { Colors } from '~/utils/colors'
import Option from './Option'

const INQUIRIES_LIST = [
  strings.POSSIBLE_PARTNERSHIP,
  strings.ISSUES_WITH_THE_APP,
  strings.I_LOST_MY_WALLET,
  strings.HOW_TO_BECOME_PART_OF_THE_PROJECT,
]

const Dropdown = () => {
  const [isExpanded, setIsExpanded] = useState(false)

  const { selectedValue, setSelectedValue } = useSelectableState()

  const options = useMemo(
    () =>
      INQUIRIES_LIST.map((el) => ({ id: el.split(' ').join(''), value: el })),
    [],
  )

  const toggleExpanded = () => {
    setIsExpanded((prevState) => !prevState)
  }

  const handleSelectOption = (option: string) => {
    setSelectedValue(option)
    setIsExpanded(false)
  }

  const animatedOpacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (isExpanded) {
      Animated.timing(animatedOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start()
    } else {
      Animated.timing(animatedOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start()
    }
  }, [isExpanded])

  return (
    <View style={styles.container}>
      <Block>
        <Option onPress={toggleExpanded}>
          <Option.Title
            title={selectedValue ?? strings.SELECT_AN_OPTION}
            color={isExpanded ? Colors.white30 : Colors.white70}
          />
          {!isExpanded ? <Option.RightIcon /> : null}
        </Option>
      </Block>
      {isExpanded ? (
        <Animated.View style={{ opacity: animatedOpacity }}>
          <Block
            customStyle={{
              ...styles.dropdownSpecificOptions,
            }}
          >
            {options.map((option: { id: string; value: string }) => (
              <Option onPress={() => handleSelectOption(option.value)}>
                <Option.Title
                  title={option.value}
                  color={
                    option.value === selectedValue
                      ? Colors.success
                      : Colors.white
                  }
                />
              </Option>
            ))}
          </Block>
        </Animated.View>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  dropdownSpecificOptions: {
    borderColor: Colors.white21,
    borderWidth: 1,
    marginTop: 15,
    position: 'absolute',
  },
})

export default () => {
  return (
    <SelectableProvider<string>>
      <Dropdown />
    </SelectableProvider>
  )
}
