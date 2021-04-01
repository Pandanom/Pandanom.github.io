import { User } from './user';

export class Game {
  constructor(
    public id?: string,
    public chat?: string,
    public history?: string,
    public host?: User,
    public guest?: User,
    public hostCS?: string,
    public guestCS?: string,
    public board?: Figure[][],
    public options?: GameOptions,
    public moveCount?: number,
    public gameEnd?: boolean) { }
}

export class Figure {
  constructor(
    public type?: FigureType,
    public side?: Side) { }
}

export class GameOptions {
  constructor(
    public isRaiting?: boolean,
    public gameKey?: string,
    public isHost?: boolean,
    public direction?: GameDirection) { }
}

export enum GameDirection {
  hostBlack = 1,
  hostWhite = 0,
}

export enum FigureType {
  pawn = 0,
  bishop = 1,
  knight = 2,
  rook = 3,
  queen = 4,
  king = 5,
  empty = 6,
}

export enum Side{
  white = 0,
  black = 1,
  none = 2,
}
