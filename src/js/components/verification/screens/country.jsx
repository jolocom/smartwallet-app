import React from 'react'
import {connect} from 'redux/utils'
import Presentation from '../presentation/country'

@connect({
  props: ['verification.country'],
  actions: [
    'verification/country:setCountryValue',
    'verification/country:cancel',
    'verification/country:submit'
  ]
})
export default class CountryVerificationScreen extends React.Component {
  static propTypes = {
    setCountryValue: React.PropTypes.func.isRequired,
    submit: React.PropTypes.func.isRequired,
    cancel: React.PropTypes.func.isRequired,
    children: React.PropTypes.node,
    country: React.PropTypes.object.isRequired
  }

  render() {
    const {setCountryValue, submit, cancel} = this.props
    const {options, value} = this.props.country
    return (<Presentation
      value={value}
      countries={options}
      change={setCountryValue}
      submit={(value) => {
        setCountryValue(value)
        submit()
      }}
      cancel={cancel} />)
  }
}
