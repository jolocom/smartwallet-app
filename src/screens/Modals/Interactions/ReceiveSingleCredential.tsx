import React from 'react'
import { StyleSheet, View } from 'react-native'
import ActionSheet from 'react-native-actions-sheet'

import Btn, { BtnTypes } from '~/components/Btn'
import Paragraph, { ParagraphSizes } from '~/components/Paragraph'
import BtnGroup, { BtnsAlignment } from '~/components/BtnGroup'
import Header, { HeaderSizes } from '~/components/Header'
import { strings } from '~/translations/strings'
import { Colors } from '~/utils/colors'

interface PropsI {
  title: string
  description: string
}

const ReceiveSingleCredential: React.FC<PropsI> = React.forwardRef(
  ({ title, description }, ref) => {
    const hideActionSheet = () => {
      ref.current?.setModalVisible(false)
    }

    return (
      <ActionSheet
        ref={ref}
        containerStyle={styles.container}
        initialOffsetFromBottom={0}
        closeOnTouchBackdrop={false}
      >
        <Header size={HeaderSizes.small} color={Colors.white90}>
          {title}
        </Header>
        <Paragraph size={ParagraphSizes.micro} color={Colors.white90}>
          {description}
        </Paragraph>
        <View style={styles.body}>
          <Header color={Colors.activity}>Body</Header>
        </View>
        <BtnGroup alignment={BtnsAlignment.horizontal}>
          <View style={{ width: '60%' }}>
            <Btn onPress={() => {}}>Receive</Btn>
          </View>
          <View style={{ width: '40%' }}>
            <Btn type={BtnTypes.secondary} onPress={hideActionSheet}>
              {strings.CANCEL}
            </Btn>
          </View>
        </BtnGroup>
      </ActionSheet>
    )
  },
)

const styles = StyleSheet.create({
  container: {
    paddingVertical: 32,
    paddingHorizontal: 20,
    backgroundColor: Colors.black,
  },
  body: {
    paddingVertical: 20,
  },
})

export default ReceiveSingleCredential
