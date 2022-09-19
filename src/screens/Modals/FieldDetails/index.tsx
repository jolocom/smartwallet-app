import { RouteProp, useRoute } from '@react-navigation/native'
import React, { useState } from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import { useSafeArea } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'
import Block from '~/components/Block'
import Collapsible from '~/components/Collapsible'
import JoloText, { JoloTextKind, JoloTextWeight } from '~/components/JoloText'
import { NavHeaderType } from '~/components/NavigationHeader'
import ScreenContainer from '~/components/ScreenContainer'
import { useDocuments } from '~/hooks/documents'
import useImagePrefetch from '~/hooks/useImagePrefetch'
import { renderField, handleLayout } from './Field'
import { getDocumentById } from '~/modules/credentials/selectors'
import { TextLayoutEvent } from '~/types/props'
import { ScreenNames } from '~/types/screens'
import BP from '~/utils/breakpoints'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import { MainStackParamList } from '../../LoggedIn/Main'
import { MotorCycleIcon, PassengerCarIcon, TractorIcon } from '~/assets/svg'
import {
  DrivingPrivilegesKeys,
  VehicleTypes,
} from '~/screens/LoggedIn/Documents/DrivingLicenseDemo/data'
import { useGoBack } from '~/hooks/navigation'
import useDrivingPrivileges from './hooks'

const IMAGE_SIZE = BP({ large: 104, default: 90 })

const Icon = ({ url }: { url: string }) => {
  return (
    <View style={{ width: 40, height: 40, marginRight: 12 }}>
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

const FieldDetails = () => {
  const route =
    useRoute<RouteProp<MainStackParamList, ScreenNames.FieldDetails>>()

  const { id, backgroundColor = Colors.mainBlack } = route.params

  const document = useSelector(getDocumentById(id))!

  const { mdlFields, categories, togglePrivileges, showPrivileges } =
    document.type[1] === 'DrivingLicenseCredential' &&
    useDrivingPrivileges(document)

  const goBack = useGoBack()

  const { getHolderPhoto, getExtraProperties } = useDocuments()

  const [numOfLines, setNumOfLines] = useState(1)

  const fields = [...document.properties, ...getExtraProperties(document)]

  const prefechedIcon = useImagePrefetch(document.issuer.icon)

  const holderPhoto = getHolderPhoto(document)

  const showIconContainer =
    Boolean(document.issuer.icon) ||
    Boolean(document.style.contextIcons?.length)

  const { top } = useSafeArea()

  const getNumOfLines = (e: TextLayoutEvent) => {
    const { lines } = e.nativeEvent
    setNumOfLines(lines.length)
  }

  const GetVehicleIcon = (title: VehicleTypes) => (
    <View style={styles.vehicleIconContainer}>
      {title === VehicleTypes.MopedAndMotorcycle && <MotorCycleIcon />}
      {title === VehicleTypes.PassengerCar && <PassengerCarIcon />}
      {title === VehicleTypes.TractorAndForklift && <TractorIcon />}
      {title === VehicleTypes.Truck && <TractorIcon />}
    </View>
  )

  const renderPrivileges = (categories) => {
    return categories.map((field, i) => {
      if (field.data[DrivingPrivilegesKeys.VehicleCode].length) {
        return (
          <React.Fragment key={i}>
            <TouchableOpacity
              style={styles.privilegesContainer}
              onLayout={handleLayout}
              activeOpacity={1}
            >
              {GetVehicleIcon(field.title)}
              <JoloText
                customStyles={styles.fieldText}
                size={JoloTextSizes.mini}
                color={Colors.osloGray}
              >
                {field.title}
              </JoloText>
              <View
                style={{
                  width: '100%',
                }}
              >
                {Object.keys(field.data).map((key, i) => (
                  <View
                    style={{
                      ...styles.vehicleFieldsContainer,
                      ...(i !== Object.keys(field.data).length - 1 && {
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
                      {key}
                    </JoloText>
                    <JoloText
                      color={Colors.black}
                      customStyles={styles.fieldText}
                    >
                      {key === DrivingPrivilegesKeys.VehicleCode
                        ? field.data[key].join(', ')
                        : field.data[key]}
                    </JoloText>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
            {i !== categories.length - 1 && (
              <View style={styles.privilegesDivider} />
            )}
          </React.Fragment>
        )
      }
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
            type={!showPrivileges ? NavHeaderType.Close : NavHeaderType.Back}
            onPress={() => {
              !showPrivileges ? goBack() : togglePrivileges()
            }}
          />
        )}
        renderScroll={() => (
          <ScreenContainer.Padding>
            <Collapsible.Scroll disableScrollViewPanResponder>
              <Collapsible.Title
                text={showPrivileges ? 'Driving Privileges' : document.name}
                customContainerStyles={{
                  width: holderPhoto ? '68%' : '100%',
                  ...(holderPhoto && numOfLines === 1 && { marginTop: 26 }),
                }}
              >
                <JoloText
                  customStyles={{
                    ...styles.fieldText,
                    lineHeight: BP({ xsmall: 24, default: 28 }),
                    marginLeft: 12,
                    top: holderPhoto && numOfLines === 1 && -24,
                  }}
                  numberOfLines={2}
                  // @ts-expect-error
                  onTextLayout={getNumOfLines}
                  kind={JoloTextKind.title}
                  size={JoloTextSizes.middle}
                  color={Colors.white90}
                  weight={JoloTextWeight.medium}
                >
                  {showPrivileges ? 'Driving Privileges' : document.name}
                </JoloText>
              </Collapsible.Title>
              {showIconContainer && (
                <View
                  style={{
                    paddingBottom: 24,
                    flexDirection: 'row',
                    marginLeft: 12,
                    bottom: -8,
                  }}
                >
                  {prefechedIcon && <Icon url={prefechedIcon} />}
                  {document.style.contextIcons &&
                    document.style.contextIcons.map((icon, i) => (
                      <Icon key={i} url={icon} />
                    ))}
                </View>
              )}
              {holderPhoto && (
                <View>
                  <Image source={{ uri: holderPhoto }} style={styles.photo} />
                </View>
              )}
              <Block
                customStyles={{
                  backgroundColor: Colors.white,
                  marginBottom: 16,
                }}
              >
                {showPrivileges
                  ? renderPrivileges(categories)
                  : mdlFields
                  ? renderField(mdlFields, togglePrivileges)
                  : renderField(fields)}
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
    bottom: 16,
  },

  fieldText: {
    textAlign: 'left',
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

export default FieldDetails
