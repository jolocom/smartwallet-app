import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

import { PrivilegesData, SinglePrivilegesFieldKeys } from './types'
import getVehicleIcon from './utils'

import JoloText, { JoloTextKind, JoloTextWeight } from '~/components/JoloText'
import BP from '~/utils/breakpoints'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'

export const renderPrivileges = (
  privileges: PrivilegesData[],
  handleLayout: () => void,
) => {
  if (privileges.length) {
    return privileges.map((p, i) => {
      const VehicleIcon = getVehicleIcon(p.data.vehicleCode)

      return (
        <React.Fragment key={i}>
          <TouchableOpacity
            style={styles.privilegesContainer}
            onLayout={handleLayout}
            activeOpacity={1}
          >
            <View style={styles.vehicleIconContainer}>
              {/* <VehicleIcon /> */}
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
              {Object.keys(p.data).map((key, i) => (
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
                  {/* {console.log({ p })}
                  {console.log({ key })} */}
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
                    {p.data[key]}
                  </JoloText>
                </View>
              ))}
            </View>
          </TouchableOpacity>
          {i !== privileges.length - 1 && (
            <View style={styles.privilegesDivider} />
          )}
        </React.Fragment>
      )
    })
  }
}

const styles = StyleSheet.create({
  fieldText: {
    textAlign: 'left',
    width: 90,
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
