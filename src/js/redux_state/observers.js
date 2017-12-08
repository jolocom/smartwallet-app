// import {setWebId} from './modules/account'
import {actions as identityActions} from './modules/wallet/identity'
import {actions as ethereumActions} from './modules/wallet/money'

export default async function setup({store, services, history}) {
  // services.auth.on('changed', (webId = null) => {
  //   store.dispatch(setWebId(webId))
  // })
  // if (services.auth.currentUser) {
  //   const webId = services.auth.currentUser.wallet.webId || null
  //   services.auth.emit('changed', webId)
  // }

  let isStreamingEtherBalance = false

  async function onAuthChange({oldUser, newUser}) {
    if (!newUser) {
      return
    }

    services.auth.currentUser.socket.on('verification.stored', (data) => {
      store.dispatch(identityActions.setAttributeVerified(data.attrType, data.attrId, true))
    })

    services.auth.currentUser.socket.on('ether.balance.changed', (data) => {
      store.dispatch(ethereumActions.setEtherBalance(data.newBalance))
    })

    services.auth.currentUser.socket.on('reconnect', (data) => {
      if (isStreamingEtherBalance) {
        startStreamingEtherBalance({user: services.auth.currentUser})
      }
    })

    isStreamingEtherBalance = await manageEtherBalanceStreaming({
      isStreaming: isStreamingEtherBalance,
      currentUser: services.auth.currentUser,
      location
    })
  }

  services.auth.on('changed', onAuthChange)
  if (services.auth.currentUser) {
    onAuthChange({newUser: services.auth.currentUser})
  }

  history.listen(async location => {
    isStreamingEtherBalance = await manageEtherBalanceStreaming({
      isStreaming: isStreamingEtherBalance,
      currentUser: services.auth.currentUser,
      location
    })
  })

  isStreamingEtherBalance = await manageEtherBalanceStreaming({
    isStreaming: isStreamingEtherBalance,
    currentUser: services.auth.currentUser,
    location
  })
}

export async function manageEtherBalanceStreaming({
  isStreaming, location, oldUser, newUser, currentUser
}) {
  let pathname
  if (location.hash) {
    pathname = location.hash.substr(1)
  } else {
    pathname = location.pathname
  }

  const shouldBeStreamingBecausePath =
    pathname.indexOf('/wallet/money') >= 0 ||
    pathname.indexOf('/wallet/ether') >= 0

  let shouldBeStreaming
  if (currentUser) {
    shouldBeStreaming = shouldBeStreamingBecausePath
  } else {
    shouldBeStreaming = !!newUser && shouldBeStreamingBecausePath
  }

  const startStreaming = !isStreaming && shouldBeStreaming
  const stopStreaming = isStreaming && !shouldBeStreaming

  if (startStreaming) {
    const user = newUser || currentUser
    await startStreamingEtherBalance({user})
  } else if (stopStreaming) {
    const user = oldUser || currentUser
    const ethereumInfo = await user.wallet.getWalletAddress()
    user.socket.emit('ether.balance.unwatch', {
      walletAddress: ethereumInfo.walletAddress
    })
  }

  return shouldBeStreaming
}

async function startStreamingEtherBalance({user}) {
  const ethereumInfo = await user.wallet.getWalletAddress()
  user.socket.emit('ether.balance.watch', {
    walletAddress: ethereumInfo.walletAddress
  })
}
