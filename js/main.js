function codeAddress() {
var board = document.getElementById('boardInner');
//var numContainer = document.getElementById('numberContainer');
//var letterContainer = document.getElementById('letterContainer');
var letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
var numbers = ['1', '2', '3', '4', '5', '6', '7', '8']
var display = 'block'

const renderBoard = (isWhite) =>{
  renderLetters(!isWhite)
  for (var i = 0; i < letters.length; ++i){
    var row = document.createElement('DIV')
    row.className = 'row'
	
	var el = document.createElement('DIV')
	el.innerText = isWhite ? (i+1) : (letters.length + 1 - i)
	el.className = 'symbol'
	row.appendChild(el)
	
    for (var j = 0; j < letters.length; ++j){
      var square = document.createElement('DIV')
      square.className = 'square'
      square.style.backgroundColor = (i+j) % 2 === 0 ? 'white' : 'black'
	  square.id = 'cell' + i + j
      row.appendChild(square)
    }
    board.appendChild(row)
  }   
 }

renderLetters = (reverse) => {
	var row = document.createElement('DIV') 
	row.className = 'row'
	var el = document.createElement('DIV')
	el.innerText = ''
	el.className = 'symbol'
	row.appendChild(el)
	var f = (x,i)=>{ 
		var el = document.createElement('DIV')
		el.innerText = x
		el.className = 'symbol'
		row.appendChild(el)
	}
	if(reverse)
	{
		letters.slice().reverse().forEach(f)
	}
	else
	{
		letters.forEach(f)
	}
	board.appendChild(row)
}

renderBoard(true)
}