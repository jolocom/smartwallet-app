The walkthroughs for buying ether are the following:
  * https://jolocom.slack.com/files/sabine/F5Q52C7MY/170607_jolocom_wallet_processtobuyether.png
  * https://jolocom.slack.com/files/sabine/F5Q52C7MY/170607_jolocom_wallet_processtobuyether.png
  * https://jolocom.slack.com/files/sabine/F5TQ6JYPR/170613_jolocom_wallet-stipeprocess.png

the buy ether screen and presentation components are located under:
  * src/js/components/wallet/presentation/ether-wallet.jsx
  * src/js/components/wallet/screens/ether-wallet.jsx

the redux component is located under:
  * src/js/redux/modules/wallet/money.js

the routes file is located under:
  * src/js/routes/wallet.jsx
The url for the money tab is /wallet/money and /wallet/ether-wallet

Redux Actions:
--------------

* getBalance:
  To get the Ether balance of the current user, update the smartwallet-contracts
  dependency, and use: services.auth.currentUser.wallet.getBalance()

* buyEther : this action will be called when the user clicks buy ether
  To buy ether, post to https://verification.jolocom.com/ether/buy/ether,
  with the following parameters:
    stripeEmail (gotten from the stripe element), stripeToken, walletAddress
    more about stripe lib: https://www.npmjs.com/package/react-stripe-checkout

* getEtherPrice: this action gets the ether price
  To get the ether do a GET request to https://verification.jolocom.com/ether/exchange-rate/ether
    you'll get back {"ethForEur": "0.0004266526098288336"}

Redux state
------------

* currency
  * ether
    * loaded: bool
    * price: number
    * amount: number or null
