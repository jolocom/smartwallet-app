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
    <View
      style={[
        styles.container,
        isActive ? styles.activeContainer : styles.inactiveContainer,
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.5}
        style={styles.button}
        onPress={() => setActiveTab(id)}
      >
        {children}
      </TouchableOpacity>
    </View>
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
    backgroundColor: Colors.black,
    height: 96,
    borderRadius: 13,
    paddingVertical: 12,
    width: '48%',
  },
  activeContainer: {
    borderWidth: 0.6,
    borderColor: Colors.electricViolet,
    elevation: 20,
    shadowColor: Colors.white06,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 14,
    shadowOpacity: 1,
  },
  inactiveContainer: {
    opacity: 0.5,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default IdentityTab
