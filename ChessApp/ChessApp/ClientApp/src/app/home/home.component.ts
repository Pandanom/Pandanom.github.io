import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { GameManagerService } from '../game-manager.service';
import { DataProviderService } from '../data-provider.service';
import { Input } from '@angular/compiler/src/core';
import { Game, Figure, FigureType, Side, GameOptions, GameDirection } from '../game';
import { forEach } from '@angular/router/src/utils/collection';
import { isPlatformWorkerUi } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [GameManagerService, DataProviderService]
})
export class HomeComponent implements OnInit{
  public PageTitle: string;

  private isBrdRendered: boolean;
  private brdDirection: boolean;

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

  setElement(i: number, j: number, f: Figure) {
    //find square
    var s = document.getElementById('cell' + i + j);
    var link = "../assets/img/";

    switch (f.type) {
      case FigureType.bishop: {
        link += "bshp";
        break;
      }
      case FigureType.king: {
        link += "kng";
        break;
      }
      case FigureType.knight: {
        link += "knght";
        break;
      }
      case FigureType.pawn: {
        link += "pwn";
        break;
      }
      case FigureType.queen: {
        link += "qn";
        break;
      }
      case FigureType.rook: {
        link += "rk";
        break;
      }
      default: {
        s.textContent = '';
        return;
      }
    }

    var us = this.dataService.getCurentUser();
    if (us.userId == this.gameService.game.host.userId) {
      var isWh = this.gameService.game.options.direction == GameDirection.hostWhite;
    }
    else {
      var isWh = this.gameService.game.options.direction != GameDirection.hostWhite;
    }


    link += f.side == Side.black ? "B.png" : "W.png";
    var img;
    if (s.lastChild)
      img = s.lastChild;
    else {
      img = document.createElement('IMG');
      img.className = 'figure';
      s.appendChild(img);
      if ((f.side == Side.white && isWh) || (f.side == Side.black && !isWh)) {
        img.addEventListener('click', (e) => {
          var gameMain = document.getElementById('game');
          var figures = gameMain.getElementsByClassName("sHighlight");
          for (var i = -1, l = figures.length; ++i < l;) {
            figures[i].classList.remove("sHighlight");
          }
          //if ((f.side == Side.white && isWh) || (f.side == Side.black && !isWh))
          e.toElement.classList.add('sHighlight');
        }, false);
      }
      else
        img.addEventListener('click', (e) => {
          var gameMain = document.getElementById('game');
          var figures = gameMain.getElementsByClassName("sHighlight");
          for (var i = -1, l = figures.length; ++i < l;) {
            var sId = e.toElement.id;
            var fId = figures[i].id;
            this.gameService.makeMove(fId.substring(1), sId.substring(1));
          }
        }, true);
    }
    img.id = 'f' + i + j;
    img.setAttribute("src", link);
  }

  renderFigures(f: Figure[][]) {
    if (f) {
      f.forEach((ff, i) => {
        ff.forEach((fff, j) => {
          this.setElement(i,j, fff);
        });
      });
    }
    else {
      console.log('board is null');
    }
  }


  ngOnInit() {

    this.isBrdRendered = false;
    this.brdDirection = false;

    this.PageTitle = 'Chess';
    this.gameService.cbOnConnect = (t: string) => { this.PageTitle = 'Game Id:' + t; };
    var gameMain = document.getElementById('game');
    this.gameService.cbOnMove = () => {
      var figures = gameMain.getElementsByClassName("sHighlight");
      for (var i = -1, l = figures.length; ++i < l;) {
        figures[i].classList.remove("sHighlight");
      }
    };

    gameMain.addEventListener('contextmenu', (e) => {
      var figures = gameMain.getElementsByClassName("sHighlight");
      for (var i = -1, l = figures.length; ++i < l;) {
        figures[i].classList.remove("sHighlight");
      }
      e.preventDefault();
      return false;
    });


    this.gameService.cbOnGameUpdate = (g: Game) => {
      var us = this.dataService.getCurentUser();
      if (us.userId == g.host.userId) {
        var isWh = g.options.direction == GameDirection.hostWhite;
      }
      else {
        var isWh = g.options.direction != GameDirection.hostWhite;
      }
      if (this.isBrdRendered == false || this.brdDirection != isWh)
        this.renderBoard(isWh);
      this.PageTitle = 'Game Id:' + g.id;

      var chatBox = document.getElementById("chatbox");
      chatBox.innerHTML = g.chat;

      var chatBox = document.getElementById("historyBox");
      chatBox.innerHTML = g.history;

      this.renderFigures(g.board);      
    }

    this.renderBoard(true);
    
  }

  getTimeStr()
  {
    var current = new Date();
    let h = current.getHours() > 9 ? current.getHours() : '0' + current.getHours();
    let m = current.getMinutes() > 9 ? current.getMinutes() : '0' + current.getMinutes();
    let s = current.getSeconds() > 9 ? current.getSeconds() : '0' + current.getSeconds();
    return h + ':' + m + ':' + s;
  }
  
  renderBoard(isWhite: boolean) {
    this.brdDirection = isWhite;
    this.isBrdRendered = true;
    var board = document.getElementById('boardInner');

    var numContainer = document.getElementById('numberContainer');
    var letterContainer = document.getElementById('letterContainer');
    var letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    var numbers = ['1', '2', '3', '4', '5', '6', '7', '8'];
    var display = 'block';

    const render = (isWhite) => {
      board.textContent = '';
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
          square.id = 'cell' +
            (!isWhite ? (i) : (letters.length - i - 1)) +
            (isWhite ? (j) : (letters.length - j - 1));

          square.addEventListener('click', (e) => {

            var gameMain = document.getElementById('game');
            var figures = gameMain.getElementsByClassName("sHighlight");
            for (var i = -1, l = figures.length; ++i < l;) {
              var sId = e.toElement.id;
              var fId = figures[i].id;
              this.gameService.makeMove(fId.substring(1), sId.substring(4));
            }
          }, true);

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

    render(isWhite);
  }

}

