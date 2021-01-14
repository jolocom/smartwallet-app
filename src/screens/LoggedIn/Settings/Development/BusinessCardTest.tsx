import React from 'react';
import { ScrollView } from 'react-native';

import JoloText, { JoloTextKind } from '~/components/JoloText';
import ScreenContainer from '~/components/ScreenContainer';
import IdentityBusinessCard, { BusinessCard } from '~/screens/LoggedIn/Identity/IdentityBusinessCard';
import { StyleSheet, View } from 'react-native';

const BusinessCardTest = () => {
  return (
    <ScreenContainer
      hasHeaderBack
      customStyles={{ justifyContent: 'flex-start' }}
    >
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <View style={styles.group}>
          <IdentityBusinessCard />
        </View>

        <View style={styles.group}>
          <JoloText
            kind={JoloTextKind.title}
            customStyles={{ textAlign: 'left' }}
          >
            Business Card Placeholder
    </JoloText>
          <BusinessCard.Placeholder />
        </View>

        <JoloText
          kind={JoloTextKind.title}
          customStyles={{ textAlign: 'left' }}
        >
          Business Card Credential
    </JoloText>
        <BusinessCard.Credential />

      </ScrollView>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  group: {
    marginBottom: 50
  }
})

export default BusinessCardTest;