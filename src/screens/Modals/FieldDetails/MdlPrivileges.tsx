import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import JoloText, { JoloTextKind, JoloTextWeight } from '~/components/JoloText'
import { handleLayout } from './Field'
import BP from '~/utils/breakpoints'
import { Category } from './types'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import { MotorCycleIcon, PassengerCarIcon, TractorIcon } from '~/assets/svg'
import { DrivingPrivilegesKeys, VehicleTypes } from './types'

const GetVehicleIcon = (title: VehicleTypes) =>
  title && (
    <View style={styles.vehicleIconContainer}>
      {title === VehicleTypes.MopedAndMotorcycle && <MotorCycleIcon />}
      {title === VehicleTypes.PassengerCar && <PassengerCarIcon />}
      {title === VehicleTypes.TractorAndForklift && <TractorIcon />}
      {title === VehicleTypes.Truck && <PassengerCarIcon />}
      {title === VehicleTypes.Bus && <PassengerCarIcon />}
    </View>
  )

export const renderPrivileges = (categories: Category[]) => {
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

const styles = StyleSheet.create({
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
