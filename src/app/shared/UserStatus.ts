import { Item } from './Item';

export class UserStatus {
  constructor(
    public username: string,
    public energy: number,
    public hp: number,
    public coins: number,
    public itemHead: Item
  ) {}
}
