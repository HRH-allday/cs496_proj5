let canvas = document.getElementById('goodCanvas')
let dummyCanvas = document.getElementById('dummyCanvas')

canvas.addEventListener('load', onLoad)
let ctx = canvas.getContext('2d')
let dummyCtx = canvas.getContext('2d')

canvas.width = document.body.clientWidth
canvas.height = document.body.clientHeight
canvas.addEventListener('dragover', function (ev) {
  ev.preventDefault()
})
canvas.addEventListener('drop', onDrop)

onLoad()

function onLoad (ev) {
  console.log('onload')
  getPosition().then(function (list) {
    // let maxHeight = 0
    // for (let i = 0; i < list.length; i++) {
    //   maxHeight = maxHeight > list[i].posY ? maxHeight : list[i].posY * 2
    // }
    // canvas.height = maxHeight
    console.log($('#goodCanvas'))
    for (let i = 0; i < list.length; i++) {
      // let img = new Image()
      // img.addEventListener('load', function () {
      //   ctx.drawImage(img, list[i].posX, list[i].posY)
      // })
      // img.src = decodeURIComponent(list[i].imgURL)
      $('#goodCanvas').drawImage({
        layer: true,
        name: decodeURIComponent(list[i].imgURL),
        source: decodeURIComponent(list[i].imgURL),
        x: list[i].posX,
        y: list[i].posY,
        draggable: true,
        bringToFront: true,
        dragstop: function (layer) {
          updatePosition(encodeURIComponent(layer.source), layer.x, layer.y).then(function () {
            console.log('pos saved')
          })
        },
        dblclick: function (layer){
          $('#goodCanvas').removeLayer(layer.name).drawLayers()
          removePosition(encodeURIComponent(layer.source)).then(function () {
            console.log('byebye')

            console.log($('#goodCanvas'))
            console.log('here?')
            console.log(this)
          })
        }
      })
    }
  })
}

function onDrop (ev) {
  ev.preventDefault()
  window.alert('x'+ ev.clientX + 'y' + ev.clientY)
  // window.alert(ev.dataTransfer.files[0])
  // console.log(ev.dataTransfer.files[0])
  ev.dataTransfer.items[0].getAsString(function (s) {
    console.log(s)
    // let tokens = s.split('/')
    // let filename = tokens[tokens.length - 1]
    let filename = encodeURIComponent(s)
    // let img = new Image()
    // img.addEventListener('load', function () {
      // ctx.drawImage(img, ev.pageX, ev.pageY)
      $('#goodCanvas').drawImage({
        layer: true,
        name: s,
        source: s,
        x: ev.pageX,
        y: ev.pageY,
        draggable: true,
        bringToFront: true,
        dragstop: function (layer) {
          updatePosition(encodeURIComponent(layer.source), layer.x, layer.y).then(function () {
            console.log('pos saved')
          })
        },
        dblclick: function (layer){
          $('#goodCanvas').removeLayer(layer.name).drawLayers()
          removePosition(encodeURIComponent(layer.source)).then(function () {
            console.log('byebye')
            // $('#goodCanvas').removeLayer(encodeURIComponent(layer.source)).drawLayers()
            console.log(this)
            console.log('here?')
          })
        }
      })
      savePosition(filename, ev.pageX, ev.pageY).then(function () {
        console.log('success...??')
        // if(img.height + ev.clientY > document.body.clientHeight) {
        //   canvas.height = 2 * img.height + ev.pageY 
        // }
      // }).then(function () {
      //   return getPosition()
      // }).then(function (list) {
      //   for (let i = 0; i < list.length; i++) {
      //     let img = new Image()
      //     img.addEventListener('load', function () {
      //       ctx.drawImage(img, list[i].posX, list[i].posY)
      //     })
      //     img.src = decodeURIComponent(list[i].imgURL)
      //   }
      })
    // })
    // img.src = s
  })
  // ev.dataTransfer.items[0].getAsFile(function (s) {
  //   let img = new Image()
  //   img.addEventListener('load', function () {
  //     ctx.drawImage(img, ev.clientX, ev.clientY)
  //   })
  //   img.src = s
  // })
  window.alert('drop!!')
}

function savePosition (imgSrc, posX, posY) {
  return new Promise(function (resolve, reject) {
    let xhr = new XMLHttpRequest()
    xhr.open('POST', 'http://52.79.155.110:3000/savePosition/' + imgSrc + '/' + posX + '/' + posY)
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve()
      } else {
        reject()
      }
    }
    xhr.onerror = function () {
      reject()
    }
    xhr.send()
  })
}

function updatePosition (imgSrc, posX, posY) {
  return new Promise(function (resolve, reject) {
    let xhr = new XMLHttpRequest()
    xhr.open('PUT', 'http://52.79.155.110:3000/updatePosition/' + imgSrc + '/' + posX + '/' + posY)
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve()
      } else {
        reject()
      }
    }
    xhr.onerror = function () {
      reject()
    }
    xhr.send()
  })
}

function removePosition (imgSrc) {
  return new Promise(function (resolve, reject) {
    let xhr = new XMLHttpRequest()
    xhr.open('DELETE', 'http://52.79.155.110:3000/deletePosition/' + imgSrc)
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve()
      } else {
        reject()
      }
    }
    xhr.onerror = function () {
      reject()
    }
    xhr.send()
  })
}

function getPosition () {
  return new Promise(function (resolve, reject) {
    console.log('getPosition')
    let xhr = new XMLHttpRequest()
    xhr.open('GET', 'http://52.79.155.110:3000/getPosition')
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve(JSON.parse(xhr.response))
      } else {
        reject()
      }
    }
    xhr.onerror = function () {
      reject()
    }
    xhr.send()
  })
}

