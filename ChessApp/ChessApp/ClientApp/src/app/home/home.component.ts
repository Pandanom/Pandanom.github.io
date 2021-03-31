import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { GameManagerService } from '../game-manager.service';
import { DataProviderService } from '../data-provider.service';
import { Input } from '@angular/compiler/src/core';
import { Game } from '../game';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [GameManagerService, DataProviderService]
})
export class HomeComponent implements OnInit{
  public PageTitle: string;

  messageForm = this.formBuilder.group({
    usermsg: ''
  });

  gameForm = this.formBuilder.group({
    gameId: '',
    gameType: 'r',
    isRaiting: false
  });


  constructor(private formBuilder: FormBuilder,
    private gameService: GameManagerService,
    private dataService: DataProviderService) { }

  closeGameForm(): void {
    document.getElementById("myForm").style.display = "none";
    this.gameForm.reset();
  }

  openGameForm(): void {
    document.getElementById("myForm").style.display = "block";
  }

  onSubmit(): void {
    var chatBox = document.getElementById("chatbox");
    if (this.messageForm.get('usermsg').value) {

      var un = this.dataService.getCurentUser();
      var msg = '[' + this.getTimeStr() + ']' + un.login +': '+ this.messageForm.get('usermsg').value + '\n'
      chatBox.innerHTML += msg;
      chatBox.scrollTop = chatBox.scrollHeight;
      this.gameService.sendMessage(msg);
    }   
    this.messageForm.reset();
  }

  onConnect(): void {
    var gameId = this.gameForm.get('gameId').value;
    var gameType = this.gameForm.get('gameType').value;
    var isRaiting = this.gameForm.get('isRaiting').value;
    console.debug('gameForm:', this.gameForm);
    if (gameId) { // try connect
      console.log('Try to connect: ', gameId);
      this.gameService.connectToGame(gameId);
    }
    else { // create game
      switch (gameType) {
        case 'hw': {
          this.gameService.createGame(isRaiting, 0);
          break;
        }
        case 'hb': {
          this.gameService.createGame(isRaiting, 1);
          break;
        }
        default: {
          this.gameService.createGame(isRaiting, Math.floor(Math.random() * 2));
          break;
        }
      }
    }
    
    this.closeGameForm();
  }

  ngOnInit() {
    this.PageTitle = 'Chess';
    this.gameService.cbOnConnect = (t: string) => { this.PageTitle = 'Game Id:' + t; }

    this.gameService.cbOnGameUpdate = (g: Game) => {
      //console.warn(g);
      this.PageTitle = 'Game Id:' + g.id;

      var chatBox = document.getElementById("chatbox");
      chatBox.innerHTML = g.chat;


      
    }


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
          square.style.backgroundColor = (i + j) % 2 === 0 ? 'white' : 'grey';
          square.id = 'cell' + i + j;

          var img = document.createElement('IMG');
          img.setAttribute("src", "../assets/img/pwnW.png");
          img.className = 'figure';
          img.id = 'f' + i + j;
          square.appendChild(img);
          row.appendChild(square);
        }
        board.appendChild(row);
      }
      var qwe = document.getElementById('f34');
      qwe.setAttribute("src", "../assets/img/pwnB.png");
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

