import React, { useState } from 'react'
import ScreenContainer from '~/components/ScreenContainer'
import NavigationHeader, { NavHeaderType } from '~/components/NavigationHeader'
import { View, StyleSheet, Text, ScrollView, Share, Modal } from 'react-native'
import { useGoBack } from '~/hooks/navigation'
import JoloText from '~/components/JoloText'
import IconBtn from '~/components/IconBtn'
import { ShareIcon, LanguageIcon } from '~/assets/svg'

const TermsTemplate: React.FC = ({ title, text }) => {
  const goBack = useGoBack()

  const [language, setLanguage] = useState('EN')

  const handleLanguage = () => {}

  const handleShare = async () => {
    console.log('Hello')
    try {
      const result = await Share.share({ message: 'Jolo' })
      console.log('result: ', result)
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <ScreenContainer
      customStyles={{
        justifyContent: 'flex-start',
        paddingTop: 0,
        paddingHorizontal: 0,
      }}
    >
      <NavigationHeader
        type={NavHeaderType.Back}
        onPress={goBack}
        customStyles={{ paddingHorizontal: 5 }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingLeft: 10,
          }}
        >
          <JoloText kind={JoloTextKind.title}>{title}</JoloText>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '20%',
            }}
          >
            <IconBtn onPress={handleLanguage}>
              <LanguageIcon />
            </IconBtn>
            <IconBtn onPress={handleShare}>
              <ShareIcon />
            </IconBtn>
          </View>
        </View>
      </NavigationHeader>
      <View style={styles.contentContainer}>
        <View>
          <Text style={styles.heading}>
            Please note that the German version is legally binding
          </Text>
        </View>
        <ScrollView indicatorStyle={'white'}>
          <Text style={styles.text}>{text}</Text>
        </ScrollView>
      </View>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    marginTop: 25,
    paddingHorizontal: 20,
  },
  heading: {
    color: '#ffcc01',
    fontSize: 16,
    paddingBottom: 10,
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
})

export default TermsTemplate
