import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';
import { Item } from '../shared/Item';
import { ItemSlot } from '../shared/ItemSlot';
import { ItemType } from '../shared/ItemType';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit {
  constructor(private userService: UserService) {}
  public items: Item[];
  public equippedItems: Map<ItemSlot, Item>;

  ngOnInit(): void {
    this.getItems();
    this.getEquippedItems();
  }

  getItems() {
    this.userService.getItems().subscribe(
      (response: Item[]) => {
        this.items = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  getEquippedItems() {
    this.userService.getEquippedItems().subscribe(
      (response: Map<ItemSlot, Item>) => {
        this.equippedItems = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  onEquipItem(item: Item) {
    this.userService.equipItem(item).subscribe((response: any) => {
      this.getItems();
      this.getEquippedItems();
    });
  }

  getSlotImageUrl(slotName: string) {
    if (this.equippedItems !== undefined) {
      const item: Item = this.equippedItems[slotName];
      if (item == null) return '../../assets/blank.png';
      else return this.getImageUrl(item.template.name);
    } else {
      return '../../assets/blank.png';
    }
  }

  public getImageUrl(itemName: string): string {
    return 'assets/' + itemName + '.png';
  }
}
