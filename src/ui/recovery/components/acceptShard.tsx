import React from 'react'
import { ButtonSection } from 'src/ui/structure/buttonSectionBottom'
import { StyleSheet, Text, TextInput, View } from 'react-native'
import { Colors, Spacing, Typography } from 'src/styles'
import { largeText } from '../../../styles/typography'
import { grey, purpleMain } from '../../../styles/colors'

interface Props {
  label: string
  handleLabelChange: (text: string) => void
  acceptShard: Function
  cancelReceiving: Function
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.backgroundLightMain,
  },
  requesterContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    padding: Spacing.MD,
    marginTop: Spacing.LG,
  },
  requesterIcon: {
    backgroundColor: Colors.lightGrey,
    width: 40,
    height: 40,
  },
  requesterTextContainer: {
    flex: -1,
    marginLeft: Spacing.MD,
  },
  authRequestContainer: {
    flex: 1,
    paddingHorizontal: '10%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: Spacing.XL,
  },
  note: {
    ...Typography.baseFontStyles,
    ...Typography.centeredText,
    fontSize: Typography.textLG,
    marginHorizontal: Spacing.XL,
    marginVertical: Spacing.XS,
  },
})

export const AcceptShardComponent: React.FunctionComponent<Props> = ({
  label,
  handleLabelChange,
  acceptShard,
  cancelReceiving,
}) => (
  <View style={styles.container}>
    <Text style={{ ...largeText, color: grey, marginVertical: 30 }}>
      Receive Recovery Shard
    </Text>
    <Text style={styles.note}>
      Do you want to save this shard to your JolocomSmartWallet?
    </Text>
    <View style={{ flex: 2 }} />
    {
      //@ts-ignore
      <TextInput
        value={label}
        onChangeText={handleLabelChange}
        style={{ width: 200, marginTop: 50 }}
        placeholder={'Label'}
        textAlign={'center'}
        underlineColorAndroid={purpleMain}
      />
    }
    <Text style={styles.note}>
      Please add a label to it (e.g. the nickname of your friend)
    </Text>

    <View style={{ width: '100%', backgroundColor: 'green', height: 100 }}>
      <ButtonSection
        disabled={false}
        denyDisabled={false}
        confirmText={'Save'}
        denyText={'Cancel'}
        handleConfirm={() => acceptShard()}
        handleDeny={() => cancelReceiving()} // TODO Does this get dispatched correctly?
        verticalPadding={10}
      />
    </View>
  </View>
)
