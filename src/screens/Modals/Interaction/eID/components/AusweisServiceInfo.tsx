import { RouteProp, useRoute } from '@react-navigation/native'
import React from 'react'
import { LayoutAnimation, StyleSheet, View } from 'react-native'
import { useSafeArea } from 'react-native-safe-area-context'
import Block from '~/components/Block'
import Collapsible from '~/components/Collapsible'
import JoloText, { JoloTextKind, JoloTextWeight } from '~/components/JoloText'
import { NavHeaderType } from '~/components/NavigationHeader'
import ScreenContainer from '~/components/ScreenContainer'
import { MainStackParamList } from '~/screens/LoggedIn/Main'
import { FieldValue } from '~/screens/Modals/FieldDetails'
import { ScreenNames } from '~/types/screens'
import BP from '~/utils/breakpoints'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'

const AusweisServiceInfo = () => {
  const { top } = useSafeArea()
  const route =
    useRoute<RouteProp<MainStackParamList, ScreenNames.AusweisServiceInfo>>()

  const { eIdData, backgroundColor } = route.params

  const { title, fields } = eIdData

  const handleLayout = () => {
    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.linear,
      duration: 200,
    })
  }

  return (
    <View
      style={{
        paddingTop: top,
        backgroundColor,
        height: '100%',
      }}
    >
      <Collapsible
        renderHeader={() => (
          <Collapsible.Header
            customStyles={{ backgroundColor }}
            type={NavHeaderType.Close}
          />
        )}
        renderScroll={() => (
          <ScreenContainer.Padding>
            <Collapsible.Scroll disableScrollViewPanResponder>
              <Collapsible.Title text={title}>
                <View>
                  <JoloText
                    customStyles={{
                      ...styles.documentNameContainer,
                      lineHeight: BP({ xsmall: 24, default: 26 }),
                      marginLeft: 12,
                    }}
                    numberOfLines={2}
                    kind={JoloTextKind.title}
                    size={JoloTextSizes.middle}
                    color={Colors.white90}
                    weight={JoloTextWeight.medium}
                  >
                    {title}
                  </JoloText>
                </View>
              </Collapsible.Title>
              <Block
                customStyles={{
                  backgroundColor: Colors.white,
                  marginBottom: 16,
                  marginTop: 16,
                }}
              >
                {fields.map((field, i) => (
                  <React.Fragment key={i}>
                    <View style={styles.fieldContainer} onLayout={handleLayout}>
                      <JoloText
                        customStyles={styles.fieldText}
                        size={JoloTextSizes.mini}
                        color={Colors.osloGray}
                      >
                        {field.label}
                      </JoloText>
                      <FieldValue
                        value={field.value as string}
                        mime_type={field.mime_type}
                      />
                    </View>
                    {i !== Object.keys(fields).length - 1 && (
                      <View style={styles.divider} />
                    )}
                  </React.Fragment>
                ))}
              </Block>
            </Collapsible.Scroll>
          </ScreenContainer.Padding>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  fieldContainer: {
    paddingVertical: BP({
      default: 16,
      xsmall: 8,
    }),
    paddingHorizontal: 16,
    alignItems: 'flex-start',
    position: 'relative',
  },
  fieldText: {
    textAlign: 'left',
  },
  documentNameContainer: {
    textAlign: 'left',
    display: 'flex',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.genevaGray,
    width: '100%',
    opacity: 0.15,
  },
})

export default AusweisServiceInfo
