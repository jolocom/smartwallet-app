import PropTypes from 'prop-types';
import React from 'react'
import {connect} from 'redux_state/utils'
import Presentation from '../presentation/country'

@connect({
  props: ['verifier'],
  actions: [
    'verifier/country:setCountryValue',
    'verifier/country:cancelCountrySelection',
    'verifier/country:chooseCountry'
  ]
})
export default class CountryVerificationScreen extends React.Component {
  static propTypes = {
    setCountryValue: PropTypes.func.isRequired,
    chooseCountry: PropTypes.func.isRequired,
    cancelCountrySelection: PropTypes.func.isRequired,
    verifier: PropTypes.object.isRequired
  }

  render() {
    const {setCountryValue, chooseCountry, cancelCountrySelection} = this.props
    const {options, value} = this.props.verifier.country
    return (<Presentation
      value={value}
      countries={options}
      change={setCountryValue}
      submit={(value) => {
        setCountryValue(value)
        chooseCountry()
      }}
      cancel={cancelCountrySelection} />)
  }
}
