import url from 'url'

// Misc utility functions
class Util {
  static stringLessThan(s1, s2){
    if(s1 < s2) return true
    return false
  }
  
  static stringMin(s1, s2){
    if(Util.stringLessThan(s1, s2)) return s1
    return s2
  }
  
  static stringMax(s1, s2){
    if(Util.stringLessThan(s1, s2)) return s2
    return s1
  }
  
  static distance(x1, y1, x2, y2){
    return Math.sqrt(Math.pow((x1 - x2), 2) +
                     Math.pow((y1 - y2), 2))
  }

  // for short randomStrings
  static randomString(length) {
    return Math.random().toString(36).substring(2, length + 3)
  }

  static urlWithoutHash(target) {
    let obj = url.parse(target)
    obj.hash = null
    return url.format(obj)
  }
}

export default Util
