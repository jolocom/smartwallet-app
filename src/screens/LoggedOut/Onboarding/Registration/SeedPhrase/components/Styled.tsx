import React from 'react'
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native'
import { ArrowDown } from '~/assets/svg'
import AbsoluteBottom from '~/components/AbsoluteBottom'
import BtnGroup from '~/components/BtnGroup'
import JoloText, { JoloTextWeight } from '~/components/JoloText'
import ScreenContainer from '~/components/ScreenContainer'
import BP from '~/utils/breakpoints'
import { Colors } from '~/utils/colors'

interface IHeaderBtn {
  onPress: () => void
}

interface IContainer {
  bgColor?: Colors
}

interface IStyledHeaderComposition {
  Left: React.FC<IHeaderBtn>
  Right: React.FC<IHeaderBtn>
}

const StyledScreenContainer: React.FC<IContainer> = ({
  children,
  bgColor = Colors.transparent,
}) => {
  return (
    <ScreenContainer
      backgroundColor={bgColor}
      customStyles={{ justifyContent: 'flex-start', paddingTop: 0 }}
    >
      {children}
    </ScreenContainer>
  )
}

// TODO: update with necessary styles after Navigation Header refactoring
const StyledHeader: React.FC & IStyledHeaderComposition = ({ children }) => {
  return <View style={styles.header}>{children}</View>
}

const StyledHeaderLeft: React.FC<IHeaderBtn> = ({ children, onPress }) => {
  return (
    <View style={styles.headerLeft}>
      <TouchableOpacity onPress={onPress} style={styles.pressable}>
        {children}
      </TouchableOpacity>
    </View>
  )
}

const StyledHeaderRight: React.FC<IHeaderBtn> = ({ children, onPress }) => {
  return (
    <View style={styles.headerRight}>
      <TouchableOpacity onPress={onPress} style={styles.pressable}>
        {children}
      </TouchableOpacity>
    </View>
  )
}

const StyledHelperText: React.FC = ({ children }) => {
  return (
    <JoloText
      weight={JoloTextWeight.medium}
      customStyles={{ marginTop: 8, paddingHorizontal: 36 }}
    >
      {children}
    </JoloText>
  )
}

const StyledActiveArea: React.FC = ({ children }) => {
  return <View style={styles.activeArea}>{children}</View>
}

const StyledCTA: React.FC = ({ children }) => {
  return <BtnGroup>{children}</BtnGroup>
}

const StyledErrorText: React.FC = ({ children }) => (
  <JoloText
    color={Colors.error}
    customStyles={{
      marginTop: 8,
      paddingHorizontal: 36,
    }}
  >
    {children}
  </JoloText>
)

const StyledDirectionArrow: React.FC = () => (
  <View
    style={{
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <View
      style={{
        position: 'absolute',
        right: 40,
      }}
    >
      <ArrowDown />
    </View>
  </View>
)

StyledHeader.Left = StyledHeaderLeft
StyledHeader.Right = StyledHeaderRight

const SeedPhrase = {
  Styled: {
    ScreenContainer: StyledScreenContainer,
    Header: StyledHeader,
    HelperText: StyledHelperText,
    ErrorText: StyledErrorText,
    ActiveArea: StyledActiveArea,
    CTA: StyledCTA,
    DirectionArrow: StyledDirectionArrow,
  },
}

const styles = StyleSheet.create({
  header: {
    width: Dimensions.get('window').width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginBottom: BP({ default: 16, xsmall: 4 }),
    height: 50,
    alignItems: 'center',
  },
  pressable: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLeft: {
    alignSelf: 'center',
    flex: 1,
  },
  headerRight: {
    textAlign: 'right',
    alignItems: 'flex-end',
    flex: 1,
    paddingVertical: 5,
  },
  activeArea: {
    marginTop: BP({ default: 60, small: 24, xsmall: 16 }),
    width: '100%',
    flex: 1,
  },
})

export default SeedPhrase
