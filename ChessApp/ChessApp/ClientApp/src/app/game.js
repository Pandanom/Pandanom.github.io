"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Game = /** @class */ (function () {
    function Game(id, chat, history, host, guest, hostCS, guestCS, board, options, moveCount, gameEnd) {
        this.id = id;
        this.chat = chat;
        this.history = history;
        this.host = host;
        this.guest = guest;
        this.hostCS = hostCS;
        this.guestCS = guestCS;
        this.board = board;
        this.options = options;
        this.moveCount = moveCount;
        this.gameEnd = gameEnd;
    }
    return Game;
}());
exports.Game = Game;
var Figure = /** @class */ (function () {
    function Figure(type, side) {
        this.type = type;
        this.side = side;
    }
    return Figure;
}());
exports.Figure = Figure;
var GameOptions = /** @class */ (function () {
    function GameOptions(isRaiting, gameKey, isHost, direction) {
        this.isRaiting = isRaiting;
        this.gameKey = gameKey;
        this.isHost = isHost;
        this.direction = direction;
    }
    return GameOptions;
}());
exports.GameOptions = GameOptions;
var GameDirection;
(function (GameDirection) {
    GameDirection[GameDirection["hostBlack"] = 1] = "hostBlack";
    GameDirection[GameDirection["hostWhite"] = 0] = "hostWhite";
})(GameDirection = exports.GameDirection || (exports.GameDirection = {}));
var FigureType;
(function (FigureType) {
    FigureType[FigureType["pawn"] = 0] = "pawn";
    FigureType[FigureType["bishop"] = 1] = "bishop";
    FigureType[FigureType["knight"] = 2] = "knight";
    FigureType[FigureType["rook"] = 3] = "rook";
    FigureType[FigureType["queen"] = 4] = "queen";
    FigureType[FigureType["king"] = 5] = "king";
    FigureType[FigureType["empty"] = 6] = "empty";
})(FigureType = exports.FigureType || (exports.FigureType = {}));
var Side;
(function (Side) {
    Side[Side["white"] = 0] = "white";
    Side[Side["black"] = 1] = "black";
    Side[Side["none"] = 2] = "none";
})(Side = exports.Side || (exports.Side = {}));
//# sourceMappingURL=game.js.map