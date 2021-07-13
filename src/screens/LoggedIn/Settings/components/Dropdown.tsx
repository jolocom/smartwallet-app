import React, { useEffect, useRef, useState } from 'react'
import { View, StyleSheet, Animated, LayoutAnimation } from 'react-native'
import { CaretDown } from '~/assets/svg'
import Block from '~/components/Block'
import {
  IOption,
  TOptionExtend,
  SelectableProvider,
  useSelectableState,
} from '~/components/Selectable'
import useTranslation from '~/hooks/useTranslation'

import { strings } from '~/translations/strings'
import { Colors } from '~/utils/colors'
import { debugView } from '~/utils/dev'
import Option from './Option'

const animateLayout = () => {
  LayoutAnimation.configureNext({
    ...LayoutAnimation.Presets.easeInEaseOut,
    duration: 200,
  })
}

const Dropdown = () => {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)

  const { selectedValue, setSelectedValue, options, onSelect } =
    useSelectableState()
  const selectedValueTruncated = selectedValue
    ? selectedValue.value.toString().length > 30
      ? selectedValue.value.toString().split('').splice(0, 30).join('') + '...'
      : selectedValue.value
    : selectedValue

  const toggleExpanded = () => {
    animateLayout()
    setIsExpanded((prevState) => !prevState)
  }

  const handleSelectOption = (option: IOption<TOptionExtend>) => {
    animateLayout()
    setSelectedValue(option)
    setIsExpanded(false)
    onSelect(option)
  }

  const animatedOpacity = useRef(new Animated.Value(0)).current

  const animate = (toValue: number) => {
    Animated.timing(animatedOpacity, {
      toValue,
      duration: 200,
      useNativeDriver: true,
    }).start()
  }

  useEffect(() => {
    if (isExpanded) {
      animate(1)
    } else {
      animate(0)
    }
  }, [isExpanded])

  return (
    <View style={styles.container}>
      <Block>
        <Option onPress={toggleExpanded}>
          <Option.Title
            title={selectedValueTruncated ?? t('ContactUs.issuePlaceholder')}
            color={isExpanded ? Colors.white30 : Colors.white70}
          />
          <Option.IconContainer>
            {!isExpanded ? (
              <CaretDown />
            ) : (
              <View style={{ transform: [{ rotate: '180deg' }] }}>
                <CaretDown />
              </View>
            )}
          </Option.IconContainer>
        </Option>
      </Block>
      {isExpanded ? (
        <Animated.View style={{ opacity: animatedOpacity }}>
          <Block customStyle={styles.dropdownSpecificOptions}>
            {options.map((option) => (
              <Option
                key={option.id}
                onPress={() => handleSelectOption(option)}
                hasBorder={false}
              >
                <Option.Title
                  title={option.value}
                  color={
                    option.value === selectedValue?.value
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
    paddingVertical: 8,
    // position: 'absolute', // TODO: display it on top of other elements
  },
})

export default ({
  options,
  onSelect,
}: {
  options: IOption<string>[]
  onSelect: (val: IOption<string>) => void
}) => {
  return (
    <SelectableProvider<string> options={options} onSelect={onSelect}>
      <Dropdown />
    </SelectableProvider>
  )
}
