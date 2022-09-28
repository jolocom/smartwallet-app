import React from 'react'
import { View, Text, Image, StyleSheet, LayoutAnimation } from 'react-native'
import { RouteProp, useRoute } from '@react-navigation/native'

import { MainStackParamList } from '../../Main'
import { Colors } from '~/utils/colors'
import { ScreenNames } from '~/types/screens'
import { useSafeArea } from 'react-native-safe-area-context'
import Collapsible from '~/components/Collapsible'
import { NavHeaderType } from '~/components/NavigationHeader'
import { useGoBack } from '~/hooks/navigation'
import ScreenContainer from '~/components/ScreenContainer'
import JoloText, { JoloTextKind, JoloTextWeight } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import BP from '~/utils/breakpoints'
import Block from '~/components/Block'
import useDrivingPrivileges from '~/screens/Modals/FieldDetails/hooks'
import { TouchableOpacity } from 'react-native-gesture-handler'
import getVehicleIcon from '~/screens/Modals/FieldDetails/utils'

const IMAGE_SIZE = BP({ large: 104, default: 90 })
const ICON_SIZE = BP({ large: 40, default: 30 })

const Icon = ({ url }: { url: string }) => {
  return (
    <View
      style={{
        width: ICON_SIZE,
        height: ICON_SIZE,
        marginRight: 12,
      }}
    >
      <Image
        source={{ uri: url }}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 6,
          overflow: 'hidden',
        }}
      />
    </View>
  )
}

const DrivingPrivileges = () => {
  const route =
    useRoute<RouteProp<MainStackParamList, ScreenNames.DrivingPrivileges>>()

  const { title, portrait, icons, prefechedIcon, document } = route.params

  const { mdlPrivileges } = useDrivingPrivileges(document)

  const getDocumentNameContainerHeight = () => {
    if (!icons.length && portrait) {
      return IMAGE_SIZE
    } else if (icons.length && portrait) {
      return IMAGE_SIZE - ICON_SIZE
    } else {
      return 'auto'
    }
  }

  const handleLayout = () => {
    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.linear,
      duration: 200,
    })
  }

  const { top } = useSafeArea()

  const goBack = useGoBack()

  console.log({ route })

  return (
    <View
      style={{
        paddingTop: top,
        backgroundColor: Colors.mainDark,
        height: '100%',
      }}
    >
      <Collapsible
        renderHeader={() => (
          <Collapsible.Header
            customStyles={{ backgroundColor: Colors.mainDark }}
            type={NavHeaderType.Close}
            onPress={goBack}
          />
        )}
        renderScroll={() => (
          <ScreenContainer.Padding>
            <Collapsible.Scroll>
              <Collapsible.Title
                text={title}
                customContainerStyles={{
                  width: portrait ? '68%' : '100%',
                  marginTop: portrait && icons.length ? 6 : 0,
                }}
              >
                <View
                  style={{
                    height: getDocumentNameContainerHeight(),
                    justifyContent: !icons.length ? 'center' : 'flex-start',
                  }}
                >
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
              {icons.length && (
                <View
                  style={{
                    ...styles.iconContainer,
                    paddingTop: !portrait ? 8 : 0,
                  }}
                >
                  {prefechedIcon && <Icon url={prefechedIcon} />}
                  {document.style.contextIcons &&
                    document.style.contextIcons.map((icon, i) => (
                      <Icon key={i} url={icon} />
                    ))}
                </View>
              )}
              {portrait && (
                <View>
                  <Image source={{ uri: portrait }} style={styles.photo} />
                </View>
              )}
              <Block
                customStyles={{
                  backgroundColor: Colors.white,
                  marginBottom: 16,
                  marginTop: 16,
                }}
              >
                {mdlPrivileges.map((p, i) => (
                  <React.Fragment key={i}>
                    <TouchableOpacity
                      style={styles.privilegesContainer}
                      onLayout={handleLayout}
                      activeOpacity={1}
                    >
                      <View style={styles.vehicleIconContainer}>
                        {getVehicleIcon(p.data[0].vehicle_category_code)}
                      </View>
                      <JoloText
                        customStyles={(styles.fieldText, { width: 'auto' })}
                        size={JoloTextSizes.mini}
                        color={Colors.osloGray}
                      >
                        {p.title}
                      </JoloText>
                      <View
                        style={{
                          width: '100%',
                        }}
                      >
                        {p.data.map((category, i) => {
                          return (
                            <View
                              style={{
                                ...styles.vehicleFieldsContainer,
                                ...(i !== Object.keys(p.data).length - 1 && {
                                  borderBottomColor: Colors.genevaGray15,
                                  borderBottomWidth: 1,
                                }),
                              }}
                              key={i}
                            >
                              <JoloText
                                kind={JoloTextKind.subtitle}
                                color={Colors.black}
                                weight={JoloTextWeight.medium}
                              >
                                {category.title}
                              </JoloText>
                              <JoloText
                                color={Colors.black}
                                customStyles={styles.fieldText}
                              >
                                {category.vehicle_category_code ||
                                  category.expiry_date ||
                                  category.issue_date ||
                                  category.codes[0].code}
                              </JoloText>
                            </View>
                          )
                        })}
                      </View>
                    </TouchableOpacity>
                    {i !== mdlPrivileges.length - 1 && (
                      <View style={styles.privilegesDivider} />
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
  photo: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: IMAGE_SIZE / 2,
    position: 'absolute',
    right: 12,
    bottom: 0,
  },
  documentNameContainer: {
    textAlign: 'left',
    display: 'flex',
  },
  iconContainer: {
    flexDirection: 'row',
    marginLeft: 12,
  },
  fieldText: {
    textAlign: 'left',
    width: 100,
  },
  privilegesDivider: {
    height: 6,
    backgroundColor: Colors.genevaGray,
    width: '100%',
    opacity: 0.15,
  },
  privilegesContainer: {
    paddingVertical: BP({
      default: 8,
      xsmall: 4,
    }),
    paddingHorizontal: 16,
    alignItems: 'flex-start',
    position: 'relative',
  },
  vehicleFieldsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'relative',
  },
  vehicleIconContainer: {
    position: 'absolute',
    right: 16,
    top: BP({
      default: 8,
      xsmall: 4,
    }),
  },
})

export default DrivingPrivileges
