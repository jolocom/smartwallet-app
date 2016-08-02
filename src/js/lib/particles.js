export default {
  partying: false,
  
  party: function (domSvg) {
    this.unparty(domSvg)
    this.partying = true

    // shim layer with setTimeout fallback
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function( callback ){
                window.setTimeout(callback, 1000 / 60)
              }
    })()

    var canvas = document.createElement("CANVAS"),
        ctx = canvas.getContext("2d"),
        W = window.innerWidth,
        H = window.innerHeight - domSvg.offsetTop,
        circles = []

    domSvg.parentNode.insertBefore(canvas,domSvg)

    canvas.id = 'particles'
    canvas.width = W
    canvas.height = H
    canvas.style.position = 'fixed' 
    canvas.style.top = domSvg.offsetTop
    canvas.style.left = '0'
    canvas.style.pointerEvents = 'none'
    domSvg.style.position = 'relative'

    //Random Circles creator
    function create() {

        //Place the circles at the center
        this.x = W/2
        this.y = H/2

        //Random radius between 2 and 6
        this.radius = 2 + Math.random()*3 

        //Random velocities
        this.vx = -5 + Math.random()*10
        this.vy = -5 + Math.random()*10

        //Random colors
        this.r = Math.round(Math.random())*255
        this.g = Math.round(Math.random())*255
        this.b = Math.round(Math.random())*255
    }

    for (var i = 0; i < 500; i++) {
        circles.push(new create())
    }

    function draw() {

        //Fill canvas with black color
        ctx.clearRect(0, 0, W, H)

        //Fill the canvas with circles
        for(var j = 0; j < circles.length; j++){
            var c = circles[j]

            //Create the circles
            ctx.beginPath()
            ctx.arc(c.x, c.y, c.radius, 0, Math.PI*2, false)
            ctx.fillStyle = "rgba("+c.r+", "+c.g+", "+c.b+", 0.5)"
            ctx.fill()

            c.x += c.vx
            c.y += c.vy
            c.radius -= .02

            if(c.radius < 0)
                circles[j] = new create()
        }
    }

    function animate() {
        if (this.partying) requestAnimFrame(animate.bind(this))
        draw()
    }

    animate.call(this)
  },
  
  unparty: function (domSvg) {
    this.partying = false
    domSvg.style.position = 'static'
    var canvas = domSvg.parentNode.querySelector('canvas#particles')
    if (canvas) canvas.parentNode.removeChild(canvas)
  }
}
