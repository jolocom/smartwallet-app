import React from 'react'
import { View, Image, StyleSheet, LayoutAnimation } from 'react-native'
import { RouteProp, useRoute } from '@react-navigation/native'

import { MainStackParamList } from '../../LoggedIn/Main'
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
import useDrivingPrivileges from '~/screens/Modals/DrivingPrivileges/hooks'
import { TouchableOpacity } from 'react-native-gesture-handler'
import getVehicleIcon from '~/screens/Modals/DrivingPrivileges/utils'
import { Icon } from '~/screens/Modals/FieldDetails'
import { Document } from '~/hooks/documents/types'
import { DrivingPrivilegesProps } from './types'

const DrivingPrivileges = () => {
  const route =
    useRoute<RouteProp<MainStackParamList, ScreenNames.DrivingPrivileges>>()

  const {
    title,
    portrait,
    issuerIcon,
    prefechedIcon,
    document,
    handleLayout,
    containerHeight,
    imageSize,
  } = route.params as DrivingPrivilegesProps

  const mdlDocument = document as Document

  const { mdlPrivileges } = useDrivingPrivileges(mdlDocument)
  const { top } = useSafeArea()
  const goBack = useGoBack()

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
            type={NavHeaderType.Back}
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
                  marginTop: portrait && issuerIcon ? 6 : 0,
                }}
              >
                <View
                  style={{
                    height: containerHeight(),
                    justifyContent: !issuerIcon ? 'center' : 'flex-start',
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
              {issuerIcon && (
                <View
                  style={{
                    ...styles.iconContainer,
                    paddingTop: !portrait ? 8 : 0,
                  }}
                >
                  {prefechedIcon && <Icon url={prefechedIcon} />}
                  {mdlDocument.style.contextIcons &&
                    mdlDocument.style.contextIcons.map((icon, i) => (
                      <Icon key={i} url={icon} />
                    ))}
                </View>
              )}
              {portrait && (
                <View>
                  <Image
                    source={{ uri: portrait }}
                    style={{
                      ...styles.photo,
                      width: imageSize,
                      height: imageSize,
                      borderRadius: imageSize / 2,
                    }}
                  />
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
