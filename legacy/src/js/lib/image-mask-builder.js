export default class ImageMaskBuilder {
  constructor() {
    this.paths = []
    this.currentPath = null
  }

  startNewPath() {
    this.currentPath = []
    this.paths.push(this.currentPath)
  }

  endPath() {
    this.currentPath = null
  }

  addPoint(x, y) {
    // if (x === 0 && y === 0) {
    //   return
    // }

    this.currentPath.push([x, y])
  }
}
