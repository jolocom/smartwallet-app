import en from './en'
import ErrorCode from '../lib/errorCodes'

export default {
  [en.YOUR_JOLOCOM_WALLET]: 'Deine Jolocom Wallet',
  [en.COUNTRY]: 'Land',
  [en.CITY]: 'Stadt',
  [en.POSTAL_CODE]: 'Postleitzahl',
  [en.ADDRESS_LINE1]: 'Anschrift',
  [en.ADDRESS_LINE2]: 'Anschrift (optional)',
  [en.POSTAL_ADDRESS]: 'Adresse',
  [en.CONTACT]: 'Kontakt',
  [en.TELEPHONE]: 'Telefon',
  [en.FAMILY_NAME]: 'Nachname',
  [en.GIVEN_NAME]: 'Vorname',
  [en.MOBILE_PHONE]: 'Handynummer',
  [en.EMAIL]: 'Email',
  [en.NAME]: 'Name',
  [en.PERSONAL]: 'Persönlich',
  [en.THIS_SERVICE_IS_ASKING_YOU_TO_SHARE_THE_FOLLOWING_CLAIMS]:
    'Dieser Dienst bittet Sie, die folgenden Claims zu teilen',
  [en.DENY]: 'Nein Danke',
  [en.SELF_SIGNED]: 'Selbst-signiert',
  [en.NO_LOCAL_CLAIMS]: 'Keine lokalen Claims',
  [en.ADD]: 'hinzufügen',
  [en.TO_SET_UP_YOUR_IDENTITY]: 'Ihre Identität wird erstellt',
  [en.GIVE_US_A_FEW_MOMENTS]: 'Nur einen Moment bitte',
  [en.YES_I_WROTE_IT_DOWN]: 'Erledigt',
  [en.WITHOUT_THESE_WORDS_YOU_CANNOT_ACCESS_YOUR_WALLET_AGAIN]:
    'Ohne diese Wörter können Sie nicht mehr auf Ihre SmartWallet zugreifen',
  [en.WRITE_THESE_WORDS_DOWN_ON_AN_ANALOG_AND_SECURE_PLACE]:
    'Schreiben Sie diese Wörter an einem analogen und sicheren Ort auf',
  [en.CONTINUE]: 'Fortsetzen',
  [en.PLEASE_TAP_THE_SCREEN_AND_DRAW_ON_IT_RANDOMLY]:
    'Tippen Sie auf den Bildschirm und zeichnen Sie drauf los',
  [en.FOR_SECURITY_PURPOSES_WE_NEED_SOME_RANDOMNESS]:
    'Aus Sicherheitsgründen brauchen wir zufällig erzeugte Daten',
  [en.GET_STARTED]: 'Loslegen',
  [en.TRACK_WHERE_YOU_SIGN_IN_TO_SERVICES]:
    'Verfolgen Sie Ihr Anmeldeverhalten',
  [en.KEEP_ALL_YOUR_DATA_WITH_YOU_IN_ONE_PLACE_AVAILABLE_AT_ANY_TIME]:
    'Bewahren Sie alle Ihre Daten an einem Ort auf, jederzeit verfügbar',
  [en.GREATER_CONTROL]: 'Mehr Kontrolle',
  [en.PROTECT_YOUR_DIGITAL_SELF_AGAINST_FRAUD]:
    'Schützen Sie Ihr digitales Ich gegen Betrug',
  [en.SHARE_ONLY_THE_INFORMATION_A_SERVICE_REALLY_NEEDS]:
    'Teilen Sie nur die Informationen, die ein Dienst wirklich benötigt',
  [en.ENHANCED_PRIVACY]: 'Erhöhter Privatssphäre',
  [en.INSTANTLY_ACCESS_SERVICES_WITHOUT_USING_YOUR_SOCIAL_MEDIA_PROFILES]:
    'Sofortiger Zugriff auf Dienste ohne Verwendung Ihrer Social-Media-Profile',
  [en.FORGET_ABOUT_LONG_FORMS_AND_REGISTRATIONS]:
    'Vergessen Sie lange Formulare und Anmeldungen',
  [en.ITS_EASY]: 'Es ist einfach',
  [en.TAKE_BACK_CONTROL_OF_YOUR_DIGITAL_SELF_AND_PROTECT_YOUR_PRIVATE_DATA_AGAINST_UNFAIR_USAGE]:
    'Übernehmen Sie die Kontrolle über Ihr digitales Ich und schützen Sie Ihre privaten Daten gegen unlautere Nutzung',
  [en.CANCEL]: 'Abbrechen',
  [en.YOU_CAN_SCAN_THE_QR_CODE_NOW]: 'Sie können den QR-Code jetzt scannen!',
  [en.COMING_SOON]: 'Demnächst',
  [en.DOCUMENT_DETAILS_CLAIMS]: 'Dokumentdetails/Claims',
  [en.NAME_OF_ISSUER]: 'Name des Ausstellers',
  [en.ADD_CLAIM]: 'Weiter',
  [en.THERE_WAS_AN_ERROR_WITH_YOUR_REQUEST]:
    'Bei Ihrer Anfrage ist ein Fehler aufgetreten',
  [en.SHARE_CLAIMS]: 'Claims teilen',
  [en.RECEIVING_NEW_CREDENTIAL]: 'Neue Claims erhalten',
  [en.DOCUMENTS]: 'Dokumente',
  [en.MY_IDENTITY]: 'Meine Identität',
  [en.ALL_CLAIMS]: 'Alle Claims',
  [en.PREPARING_LAUNCH]: 'Start vorbereiten',
  [en.REGISTERING_DECENTRALIZED_IDENTITY]: 'Dezentrale Identität registrieren',
  [en.FUELING_WITH_ETHER]: 'Mit Ether aufladen',
  [en.ENCRYPTING_AND_STORING_DATA_LOCALLY]:
    'Daten lokal verschlüsseln und speichern',
  [en.GO_BACK]: 'Zurück',
  [en.SETTINGS]: 'Einstellungen',
  [en.LANGUAGE]: 'Sprache',
  [en.YOUR_PREFERENCES]: 'Deine Einstellungen',
  [en.VERSION]: 'Version',
  [en.YOU_HAVENT_LOGGED_IN_TO_ANY_SERVICES_YET]:
    'Sie haben sich bisher bei keinem Service eingeloggt',
  [en.LOGIN_RECORDS]: 'Login Einträge',
  // Error Title:
  [en.DAMN]: 'Mist',
  [en.UH_OH]: 'Hmmm',
  [en.OH_NO]: 'Oh Nein',

  // Error Codes:
  [en[ErrorCode.Unknown]]: 'Unbekannter Fehler',
  [en[ErrorCode.WalletInitFailed]]: 'Wallet kann nicht initialisiert werden',
  [en[ErrorCode.SaveClaimFailed]]: 'Claim konnte nicht gespeichert werden',
  [en[ErrorCode.SaveExternalCredentialFailed]]:
    'Externer Claim konnte nihct gespeichert werden',

  [en[ErrorCode.AuthenticationRequestFailed]]:
    'Authentifizierungsanfrage fehlgeschlagen',
  [en[ErrorCode.AuthenticationResponseFailed]]:
    'Authentifizierungsantwort fehlgeschlagen',
  [en[ErrorCode.PaymentRequestFailed]]: 'Zahlungsanfrage fehlgeschlagen',
  [en[ErrorCode.PaymentResponseFailed]]: 'Zahlungsantwort fehlgeschlagen',

  [en[ErrorCode.CredentialOfferFailed]]: 'Claim Angebot fehlgeschlagen',
  [en[ErrorCode.CredentialsReceiveFailed]]:
    'Claims konnten nicht empfangen werden',
  [en[ErrorCode.CredentialRequestFailed]]: 'Claimanfrage fehlgeschlagen',
  [en[ErrorCode.CredentialResponseFailed]]: 'Claimantwort fehlgeschlagen',
  [en[ErrorCode.ParseJWTFailed]]: 'JSONWebToken ist fehlerhaft',

  [en[ErrorCode.RegistrationFailed]]: 'Registrierung fehlgeschlagen',
}
