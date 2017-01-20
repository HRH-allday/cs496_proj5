
let startX = null
let startY = null
let endX = null
let endY = null
let isDrawing = false

document.addEventListener('mousedown', getStartPosition, false)
document.addEventListener('mouseup', getEndPosition, false)

function getStartPosition(ev) {
	ev.preventDefault();
	startX = ev.clientX
	startY = ev.clientY
  // alert('startX' + startX + 'startY' + startY)
}

function getEndPosition(ev) {
	ev.preventDefault();
	endX = ev.clientX
	endY = ev.clientY
	alert('endX' + endX + 'endY' + endY)
  // document.removeEventListener('click', getStartPosition)
  // document.removeEventListener('contextmenu', getEndPosition)
  chrome.runtime.sendMessage({startX: startX, startY: startY, endX: endX, endY: endY})
  
}
