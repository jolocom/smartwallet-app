interface InterpolateParamsI {
  inputRange: number[];
  outputRange: number[];
  extrapolate?: string;
}
interface ProgressI {
  interpolate: (params: InterpolateParamsI) => {};
}
interface InterpolatorI {
  current: {
    progress: ProgressI;
  };
}

export const modalScreenOptions = {
  cardStyle: {backgroundColor: 'black'},
  cardOverlayEnabled: true,
  cardStyleInterpolator: ({current: {progress}}: InterpolatorI) => ({
    cardStyle: {
      opacity: progress.interpolate({
        inputRange: [0, 0.5, 0.9, 1],
        outputRange: [0, 0.25, 0.7, 1],
      }),
    },
    overlayStyle: {
      opacity: progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.9],
        extrapolate: 'clamp',
      }),
    },
  }),
};
