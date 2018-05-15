import React from 'react'
// import { TextInput } from 'react-native'
import { Container, Block, CenteredText } from 'src/ui/structure'
// import { TextField } from 'react-native-material-textfield'
import { JolocomTheme } from 'src/styles/jolocom-theme'

interface Props {
  typeClaimDetails: string
  toggleClaimDetails: () => void
}





export const ClaimDetails : React.SFC<Props> = (props) => {
  return (
    <Container>
      <Block>
        <CenteredText
          style={JolocomTheme.textStyles.light.subheader}
          msg={props.typeClaimDetails} />

      {/* <TextInput
        placeholder={props.typeClaimDetails}
        placeholderTextColor={'grey'}
        style={{height: 40, width: 288}}
      /> */}



      {/* <Block>
        <TextField
          label='Phone number'
          value={'test'} /> */}

      </Block>
    </Container>
  )
}
