let canvas = document.getElementById('goodCanvas')
let ctx = canvas.getContext('2d')
canvas.width = document.body.clientWidth
canvas.height = document.body.clientHeight
canvas.addEventListener('dragover', function (ev) {
  ev.preventDefault()
})
canvas.addEventListener('drop', function (ev) {
  ev.preventDefault()
  window.alert(ev.clientX, ev.clientY)
  // window.alert(ev.dataTransfer.files[0])
  // console.log(ev.dataTransfer.files[0])
  ev.dataTransfer.items[0].getAsString(function (s) {
    console.log(s)
    let img = new Image()
    img.addEventListener('load', function () {
      ctx.drawImage(img, ev.clientX, ev.clientY)
    })
    img.src = s
  })
  ev.dataTransfer.items[0].getAsFile(function (s) {
    let img = new Image()
    img.addEventListener('load', function () {
      ctx.drawImage(img, ev.clientX, ev.clientY)
    })
    img.src = s
  })
  window.alert('drop!!')
})

