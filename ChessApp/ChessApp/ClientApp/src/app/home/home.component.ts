import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit{
  public PageTitle = 'Chess'
  messageForm = this.formBuilder.group({
    usermsg: ''
  });

  constructor(private formBuilder: FormBuilder,) {

  }

  onSubmit(): void {
    console.warn('Message was sent', this.messageForm.get('usermsg').value);
    var chatBox = document.getElementById("chatbox");
    if (this.messageForm.get('usermsg').value) {
      chatBox.innerHTML += '[' + this.getTimeStr() + ']' + this.messageForm.get('usermsg').value + '\n';
      chatBox.scrollTop = chatBox.scrollHeight;
    }

    this.messageForm.reset();
  }


  ngOnInit() {
    var board = document.getElementById('boardInner');
    var numContainer = document.getElementById('numberContainer');
    var letterContainer = document.getElementById('letterContainer');
    var letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    var numbers = ['1', '2', '3', '4', '5', '6', '7', '8'];
    var display = 'block';

    const renderBoard = (isWhite) => {
      renderLetters(!isWhite);
      for (var i = 0; i < letters.length; ++i) {
        var row = document.createElement('DIV');
        row.className = 'row';

        var el = document.createElement('DIV');
        el.innerText = (!isWhite ? (i + 1) : (letters.length - i)).toString();
        el.className = 'symbol';
        row.appendChild(el);

        for (var j = 0; j < letters.length; ++j) {
          var square = document.createElement('DIV');
          square.className = 'square';
          square.style.backgroundColor = (i + j) % 2 === 0 ? 'white' : 'black';
          square.id = 'cell' + i + j;
          row.appendChild(square);
        }
        board.appendChild(row);
      }
    }
    
    var renderLetters = (reverse) => {
      var row = document.createElement('DIV');
      row.className = 'row';
      var el = document.createElement('DIV');
      el.innerText = '';
      el.className = 'symbol';
      row.appendChild(el);
      var f = (x, i) => {
        var el = document.createElement('DIV');
        el.innerText = x;
        el.className = 'symbol';
        row.appendChild(el);
      }
      if (reverse) {
        letters.slice().reverse().forEach(f);
      }
      else {
        letters.forEach(f);
      }
      board.appendChild(row);
    }
    var chatBox = document.getElementById("chatbox");
    var current = new Date();
    chatBox.innerHTML += '[' + this.getTimeStr() + ']Hello World!\n';
    
    renderBoard(true);
  }

  getTimeStr()
  {
    var current = new Date();
    let h = current.getHours() > 9 ? current.getHours() : '0' + current.getHours();
    let m = current.getMinutes() > 9 ? current.getMinutes() : '0' + current.getMinutes();
    let s = current.getSeconds() > 9 ? current.getSeconds() : '0' + current.getSeconds();
    return h + ':' + m + ':' + s;
  }

}

