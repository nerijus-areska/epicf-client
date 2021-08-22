import { Loot } from './Loot';

export class Monster {
  constructor(public name: string, public hp: number, public loot: Loot) {}
}
