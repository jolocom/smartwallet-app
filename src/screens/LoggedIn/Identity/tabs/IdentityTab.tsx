import React from 'react'
import { TouchableOpacity, StyleSheet, View, Platform } from 'react-native'
import { useIdentityTabs } from './context'
import { Colors } from '~/utils/colors'
import JoloText from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'

interface ITabProps {
  id: string
  title: string
}

const IdentityTab: React.FC<ITabProps> = ({ id, title, children }) => {
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
        <JoloText
          color={isActive ? Colors.white : Colors.white50}
          size={JoloTextSizes.tiniest}
        >
          {title}
        </JoloText>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.black,
    height: 96,
    borderRadius: 13,
    paddingVertical: 12,
    width: '48%',
  },
  activeContainer: {
    borderWidth: Platform.OS === 'ios' ? 1 : 0.6,
    borderColor: Colors.electricViolet,
    elevation: 20,
    shadowColor: Colors.black90,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 5,
    shadowOpacity: 0.7,
  },
  inactiveContainer: {
    backgroundColor: Colors.black50,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default IdentityTab
