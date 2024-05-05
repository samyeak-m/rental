export interface IBlock {
  id?: number;
  name?: string;
}

export class Block implements IBlock {
  constructor(public id?: number, public name?: string) {}
}
