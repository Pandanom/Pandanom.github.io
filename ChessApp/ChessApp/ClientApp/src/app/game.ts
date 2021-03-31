import { User } from './user';

export class Game {
  constructor(
    public id?: string,
    public chat?: string,
    public host?: User,
    public guest?: User,
    public hostCS?: string,
    public guestCS?: string) { }
}

