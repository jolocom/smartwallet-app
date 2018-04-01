import { StackNavigator } from 'react-navigation'
import { Home } from 'src/ui/home/'
import { Landing } from 'src/ui/landing/'
import { PasswordEntry, SeedPhrase } from 'src/ui/registration'

export const RootStack = StackNavigator({
    Landing: { screen: Landing },
    PasswordEntry: { screen: PasswordEntry },
    SeedPhrase: { screen: SeedPhrase },
    Home: { screen: Home }
  }, {
    initialRouteName: 'PasswordEntry',
    headerMode: 'none'
  }
)
