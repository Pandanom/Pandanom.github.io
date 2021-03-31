import { Injectable, Inject } from '@angular/core';
import { DataProviderService } from './data-provider.service';
import * as WebSocketManager from '../WebSocketManager';
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import { Game } from './game';


@Injectable()
export class GameManagerService {

  constructor(private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string,
    private dataService: DataProviderService) { }

  public connection: any;
  public gameId: string;
  public cbOnConnect: (t: string) => void;
  public cbOnGameUpdate: (g: Game) => void;
  public game: Game;
  sendMessage(message: string)
  {
    //SendMessage(string serializedUser, string gameId, string message)
    this.connection.invoke("SendMessage",
      JSON.stringify(this.dataService.getCurentUser()),
      this.gameId,
      message);

  }
  createGame(isRaiting?: boolean, direction?: number)
  {
    var options = {} as GameOptions;
    options.direction = direction;
    options.gameKey = '';
    options.isHost = true;
    options.isRaiting = isRaiting;

    this.createConnection(options, true);
  }

  connectToGame(key: string) {
    var options = {} as GameOptions;
    options.gameKey = key;
    options.isHost = false;

    this.createConnection(options, false);
  }


  createConnection(options: GameOptions, setKey: boolean) {
    this.connection = new WebSocketManager.Connection(this.baseUrl.replace('http', 'ws') + 'server');

    
    //onconnect
    this.connection.connectionMethods.onConnected = () => {
      if (setKey) {
        //alert(this.connection.connectionId);
        options.gameKey = this.connection.connectionId;
      }
      this.gameId = options.gameKey; 
      this.connection.invoke("ConnectedGame",
        this.connection.connectionId,
      JSON.stringify(this.dataService.getCurentUser()),
        JSON.stringify(options));
      this.cbOnConnect(this.connection.connectionId);
      //console.warn('Connected: ', this.connection.connectionId);
    };

    //ondisconnect
    this.connection.connectionMethods.onDisconnected = () => {
      var id = this.connection.connectionId;
      console.warn('Disconnected: ', id);
    };

    this.connection.clientMethods["sendGame"] = (g) => {
      console.log(JSON.parse(g));
      this.game = JSON.parse(g);
      this.gameId = this.game.id;
      this.cbOnGameUpdate(this.game);
    };

    this.connection.start();
    var c = this.connection;
    window.onbeforeunload = function (event) {
      c.invoke("DisconnectedGame", c.connectionId, "");
    };
  }

}

export class GameOptions {
  constructor(
    public isRaiting?: boolean,
    public gameKey?: string,
    public isHost?: boolean,
    public direction?: GameDirection) { }
}

enum GameDirection {
  hostBlack = 1,
  hostWhite = 0,
}
