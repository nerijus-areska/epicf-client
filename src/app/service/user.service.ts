import { ItemSlot } from '../shared/ItemSlot';
import { ItemType } from '../shared/ItemType';
import { UserStatus } from '../shared/UserStatus';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Item, ItemPayload } from '../shared/Item';
import { RoomStatus } from '../shared/RoomStatus';
import { Area } from '../shared/Area';
import { MessageService } from './message.service';

@Injectable()
export class UserService {
  userStatus: UserStatus = new UserStatus('mmmarinated', 100, 150, 0, null);

  private apiServerUrl = environment.apiBaseUrl;

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  getUserStatus() {
    return this.messageService.getUserStatus();
  }

  getItems(): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.apiServerUrl}/game/getItems`);
  }

  getEquippedItems(): Observable<Map<ItemSlot, Item>> {
    return this.http.get<Map<ItemSlot, Item>>(
      `${this.apiServerUrl}/game/getEquippedItems`
    );
  }

  equipItem(item: Item): Observable<any> {
    let payload = new ItemPayload(item.id);
    return this.http.post<any>(`${this.apiServerUrl}/game/equipItem`, payload);
  }

  enterArea(): Observable<Area> {
    let params = new HttpParams().set('areaName', 'Rat cave');
    return this.http.get<Area>(`${this.apiServerUrl}/area/enter`, {
      params: params,
      withCredentials: true,
    });
  }

  attack(): Observable<RoomStatus> {
    return this.http.get<RoomStatus>(`${this.apiServerUrl}/area/attack`, {
      withCredentials: true,
    });
  }

  enterRoom(roomName: string): Observable<RoomStatus> {
    let params = new HttpParams().set('roomName', roomName);
    return this.http.get<RoomStatus>(`${this.apiServerUrl}/area/enterRoom`, {
      params: params,
      withCredentials: true,
    });
  }

  grabItem(itemName: string): Observable<any> {
    let params = new HttpParams().set('itemName', itemName);
    return this.http.get<RoomStatus>(
      `${this.apiServerUrl}/area/grab_loot_item`,
      {
        params: params,
        withCredentials: true,
      }
    );
  }

  // getEquipedItem(slotName: string): Item {
  //   return this.equipedItems.get(slotName);
  // }
}
