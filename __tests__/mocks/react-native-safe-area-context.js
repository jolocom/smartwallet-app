const inset = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
}

export const SafeAreaConsumer = ({ children }) => {
  return children(inset)
}
