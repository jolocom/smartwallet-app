import React from 'react'
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Container } from 'src/ui/structure'
import { Colors, Spacing, Typography } from 'src/styles'
import { largeText } from '../../../../styles/typography'
import { ShardEntity } from '../../../../lib/storage/entities/shardEntity'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import I18n from '../../../../locales/i18n'
import strings from '../../../../locales/strings'
import { Button } from 'react-native-material-ui'
import QRScanner from 'react-native-qrcode-scanner'

interface Props {
  shards: ShardEntity[]
  cameraOpen: boolean
  openCamera: () => void
  onScan: (e: Event) => void
}

const QR_CODE_BUTTON_RADIUS = 36
const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    backgroundColor: Colors.blackMain,
    padding: '5%',
  },
  header: {
    ...largeText,
    margin: Spacing.XL,
  },
  note: {
    ...Typography.noteText,
    ...Typography.centeredText,
  },
  phraseSection: {
    flex: 1,
  },
  seedPhrase: {
    ...Typography.largeText,
    ...Typography.centeredText,
  },
  buttonSection: {
    marginTop: 'auto',
  },
  qrCodeButton: {
    height: QR_CODE_BUTTON_RADIUS * 2,
    width: QR_CODE_BUTTON_RADIUS * 2,
    borderRadius: QR_CODE_BUTTON_RADIUS,
    backgroundColor: Colors.purpleMain,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 8,
    zIndex: 10,
  },
})

export const CollectShardsComponent: React.FunctionComponent<Props> = ({
  shards,
  openCamera,
  cameraOpen,
  onScan,
}) => {
  return (
    <Container style={styles.container}>
      <Text style={styles.header}>Collect Shards</Text>
      {shards.map((shard, i) => (
        <View key={i} style={{ width: '100%' }}>
          <View
            style={{ width: '100%', height: 1, backgroundColor: 'white' }}
          />
          <Text style={[styles.note, { margin: 20 }]}>{`Shard ${i +
            1}`}</Text>
        </View>
      ))}
      {shards.length === 0 && (
        <Text style={styles.note}>
          Start recollecting your shards by using the camera
        </Text>
      )}
      <Text style={styles.note}>Your identity will be recovered as soon as you collected enough shards</Text>
      <View style={{ flex: 2 }} />
      <TouchableOpacity style={styles.qrCodeButton} onPress={openCamera}>
        <Icon size={30} name="qrcode-scan" color="white" />
      </TouchableOpacity>
      <Modal animationType="fade" transparent={false} visible={cameraOpen}>
        <Container style={styles.container}>
          {
            <QRScanner
            onRead={onScan}
            //@ts-ignore
            cameraStyle={{ overflow: 'hidden' }}
            topContent={
              <Text>{I18n.t(strings.YOU_CAN_SCAN_THE_QR_CODE_NOW)}</Text>
            }
            bottomContent={
              <Button
                onPress={openCamera}
                style={{ text: styles.note }}
                text={I18n.t(strings.CANCEL)}
              />
            }
          />}
        </Container>
      </Modal>
    </Container>
  )
}
