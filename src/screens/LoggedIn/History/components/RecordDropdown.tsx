import React from 'react'
import { View } from 'react-native'
import Dash from 'react-native-dash'

import { IRecordDetails, IRecordSteps } from '~/hooks/history/types'
import { debugView } from '~/utils/dev'
import { Colors } from '~/utils/colors'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'

const RecordStep: React.FC<IRecordSteps> = ({ title, description }) => {
  return (
    <View
      style={{
        width: '100%',
        paddingVertical: 14,
      }}
    >
      <View style={{ width: '100%', flexDirection: 'row' }}>
        <View
          style={{
            flex: 0.25,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              width: 7,
              height: 7,
              borderRadius: 4,
              backgroundColor: Colors.white,
            }}
          />
        </View>
        <View style={{ flex: 0.75 }}>
          <JoloText
            kind={JoloTextKind.title}
            size={JoloTextSizes.mini}
            customStyles={{ textAlign: 'left' }}
          >
            {title}
          </JoloText>
        </View>
      </View>
      <View style={{ width: '100%', paddingLeft: '25%', marginTop: 1 }}>
        <JoloText
          size={JoloTextSizes.mini}
          customStyles={{ textAlign: 'left' }}
          numberOfLines={1}
        >
          {description}
        </JoloText>
      </View>
    </View>
  )
}

const RecordDropdown: React.FC<{ details: IRecordDetails }> = ({ details }) => {
  return (
    <View>
      <View
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '25%',
          height: '100%',
          paddingVertical: 8,
          alignItems: 'center',
        }}
      >
        <Dash
          dashLength={2}
          dashThickness={1}
          dashGap={5}
          dashColor={Colors.genevaGray}
          style={{
            height: '100%',
            flexDirection: 'column',
            opacity: 0.4,
          }}
        />
      </View>
      {details.steps.map((s) => (
        <RecordStep title={s.title} description={s.description} />
      ))}
    </View>
  )
}

export default RecordDropdown
