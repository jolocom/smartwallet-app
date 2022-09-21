import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import JoloText, { JoloTextKind, JoloTextWeight } from '~/components/JoloText'
import { handleLayout } from './Field'
import BP from '~/utils/breakpoints'
import { Category } from './types'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import { T } from '~/assets/svg/mdl'
import { DrivingPrivilegesKeys, VehicleTypes } from './types'
import getVehicleIcon from './utils'

export const renderPrivileges = (categories: Category[]) => {
  if (categories.length) {
    return categories.map(
      (field, i) =>
        field['Vehicle Code'] !== 'ALL' && (
          <React.Fragment key={i}>
            {console.log({ field })}
            <TouchableOpacity
              style={styles.privilegesContainer}
              onLayout={handleLayout}
              activeOpacity={1}
            >
              <View style={styles.vehicleIconContainer}>
                {getVehicleIcon(field['Vehicle Code'])}
              </View>
              <JoloText
                customStyles={(styles.fieldText, { width: 'auto' })}
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
                {Object.keys(field).map(
                  (key, i) =>
                    key !== 'title' && (
                      <View
                        style={{
                          ...styles.vehicleFieldsContainer,
                          ...(i !== Object.keys(field).length - 1 && {
                            borderBottomColor: Colors.genevaGray15,
                            borderBottomWidth: 1,
                          }),
                        }}
                        key={i}
                      >
                        {console.log({ key })}
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
                          {field[key]}
                        </JoloText>
                      </View>
                    ),
                )}
              </View>
            </TouchableOpacity>
            {i !== categories.length - 1 && (
              <View style={styles.privilegesDivider} />
            )}
          </React.Fragment>
        ),
    )
  }
}

const styles = StyleSheet.create({
  fieldText: {
    textAlign: 'left',
    width: 101,
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
