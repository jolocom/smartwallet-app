import React from 'react'
import { LocaleSettingComponent } from '../components/localeSetting'
import { ThunkDispatch } from '../../../store'
import { withLoading } from '../../../actions/modifiers'
import { genericActions } from '../../../actions'
import { RootState } from '../../../reducers'
import { locales } from 'src/locales/i18n'
import { connect } from 'react-redux'

interface Props
  extends ReturnType<typeof mapStateToProps>,
    ReturnType<typeof mapDispatchToProps> {}

const LocaleSettingContainer: React.FC<Props> = props => {
  const { currentLocale, setLocale } = props
  return (
    <LocaleSettingComponent
      locales={locales}
      currentLocale={currentLocale}
      setLocale={setLocale}
    />
  )
}

const mapStateToProps = (state: RootState) => ({
  currentLocale: state.settings.locale,
})

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  setLocale: (locale: string) =>
    dispatch(withLoading(genericActions.setLocale(locale))),
})

export const LocaleSetting = connect(
  mapStateToProps,
  mapDispatchToProps,
)(LocaleSettingContainer)
