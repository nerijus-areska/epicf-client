import { ItemSlot } from './ItemSlot';
import { ItemTemplate } from './ItemTemplate';
import { ItemType } from './ItemType';

export class Item {
  constructor(
    public id: string,
    public equipped: boolean,
    public template: ItemTemplate
  ) {}
}

export class ItemPayload {
  constructor(public id: string) {}
}
