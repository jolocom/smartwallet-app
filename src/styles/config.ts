enum StyleVersion {
  Intermediate,
  Final,
}

const styleVersion = StyleVersion.Intermediate

// @ts-ignore
export const isFinalStyle = () => styleVersion === StyleVersion.Final
