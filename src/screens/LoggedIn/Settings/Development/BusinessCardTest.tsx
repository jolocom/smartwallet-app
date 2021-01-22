import React from 'react';
import { ScrollView } from 'react-native';

import JoloText, { JoloTextKind } from '~/components/JoloText';
import ScreenContainer from '~/components/ScreenContainer';
import { StyleSheet, View } from 'react-native';
import { BusinessCardPlaceholder } from '../../Identity/IdentityBusinessCard';

const BusinessCardTest = () => {
  return (
    <ScreenContainer
      hasHeaderBack
      customStyles={{ justifyContent: 'flex-start' }}
    >
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        
        <View style={styles.group}>
          <JoloText
            kind={JoloTextKind.title}
            customStyles={{ textAlign: 'left' }}
          >
            Business Card Placeholder
    </JoloText>
          <BusinessCardPlaceholder />
        </View>

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