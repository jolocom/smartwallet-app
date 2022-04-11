import React from 'react'
import ScreenContainer from '~/components/ScreenContainer'
import NavigationHeader, { NavHeaderType } from '~/components/NavigationHeader'
import JoloText from '~/components/JoloText'
import { useGoBack } from '~/hooks/navigation'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { InfoIcon, CaretDown, CloseIcon } from '~/assets/svg'
import IconBtn from '~/components/IconBtn'

const TermsOfService = () => {
  const goBack = useGoBack()

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
          <JoloText kind={'title'}>Privacy Policy</JoloText>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '20%',
            }}
          >
            <IconBtn onPress={() => console.warn('Add action')}>
              <InfoIcon />
            </IconBtn>
            <IconBtn onPress={() => console.warn('Add action')}>
              <CloseIcon />
            </IconBtn>
          </View>
        </View>
      </NavigationHeader>
      <View style={styles.contentContainer}>
        <Text style={styles.heading}>
          Please note that the German version is legally binding
        </Text>
      </View>
      <ScrollView>
        <Text style={styles.text}>
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
          nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
          sed diam voluptua. At vero eos et accusam et justo duo dolores et ea
          rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem
          ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur
          sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
          dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam
          et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea
          takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit
          amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
          invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
          At vero eos et accusam et justo duo dolores et ea rebum. Stet clita
          kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
          amet. Duis autem vel eum iriure dolor in hendrerit in vulputate velit
          esse molestie consequat, vel illum dolore eu feugiat nulla facilisis
          at vero eros et accumsan et iusto odio dignissim qui blandit praesent
          luptatum zzril delenit augue duis dolore te feugait nulla facilisi.
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
          nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat
          volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation
          ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.
          Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse
          molestie consequat, vel illum dolore eu feugiat nulla facilisis at
          vero eros et accumsan et iusto odio dignissim qui blandit praesent
          luptatum zzril delenit augue duis dolore te feugait nulla facilisi.
          Nam liber tempor cum soluta nobis eleifend option congue nihil
          imperdiet doming id quod mazim placerat facer possim assum. Lorem
          ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy
          nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.
          Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper
        </Text>
      </ScrollView>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    marginTop: 25,
    marginHorizontal: 0,
    paddingHorizontal: 20,
  },
  heading: {
    color: '#ffcc01',
    fontSize: 16,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    marginVertical: 10,
    paddingHorizontal: 20,
  },
})

export default TermsOfService
