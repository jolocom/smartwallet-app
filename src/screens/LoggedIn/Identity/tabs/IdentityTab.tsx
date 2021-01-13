import React from 'react'
import { TouchableOpacity, StyleSheet, View } from 'react-native'
import { useIdentityTabs } from '.'
import { Colors } from '~/utils/colors'
import JoloText from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import { debugView } from '~/utils/dev'

interface ITabProps {
  id: string
}

interface IIdentityTabComposition {
  Icon: React.FC
  Title: React.FC
}

export type IdentityTabType = React.FC<ITabProps> & IIdentityTabComposition

const IdentityTab: IdentityTabType = ({ id, children }) => {
  const { setActiveTab, activeTab } = useIdentityTabs()
  const isActive = activeTab === id

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isActive ? styles.activeContainer : styles.inactiveContainer,
      ]}
      onPress={() => setActiveTab(id)}
    >
      {children}
    </TouchableOpacity>
  )
}

const TabTitle: React.FC = ({ children }) => {
  return (
    <JoloText color={Colors.white} size={JoloTextSizes.tiniest}>
      {children}
    </JoloText>
  )
}

const TabIcon: React.FC = ({ children }) => {
  return <View style={{ marginBottom: 4 }}>{children}</View>
}

IdentityTab.Title = TabTitle
IdentityTab.Icon = TabIcon

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark,
    height: 96,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    width: '45%',
  },
  activeContainer: {
    borderWidth: 0.6,
    borderColor: Colors.electricViolet,
  },
  inactiveContainer: {
    opacity: 0.5,
  },
})

export default IdentityTab
