const STYLES = {
  width: window.innerWidth,
  height: window.innerHeight,
  lightGrayColor: '#efeeee',
  unavailableNodeColor: '#D4D4D4',
  grayColor: '#838383',
  lightBlueColor: '#99D7F7',
  blueColor: '#009FE3',
  highLightColor: '#D2C844',
  nodeTransitionDuration: 400,
  smallNodeSize: window.innerWidth / 4.7,
  largeNodeSize: window.innerWidth / 3.5,
  graphCanvasHeight: window.innerHeight - 118,
  fullScreenButton: null,
  fullScreenButtonPosition: 2.8,
  tempCold: '#5E35B1',
  tempCool: '#039BE5',
  tempNormal: '#43A047',
  tempWarm: '#FDD835',
  tempHot: '#E53935'
}

STYLES.largeNodeSize = STYLES.largeNodeSize > 150
  ? 150 : STYLES.largeNodeSize
STYLES.smallNodeSize = STYLES.smallNodeSize > 120
  ? 120 : STYLES.smallNodeSize
STYLES.fullScreenButton = STYLES.smallNodeSize / 2.5 < 44
  ? 44 : STYLES.smallNodeSize / 2.5

export default STYLES
