import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { using } from 'rxjs';
import { UserService } from '../service/user.service';
import { Area } from '../shared/Area';
import { RoomStatus } from '../shared/RoomStatus';

@Component({
  selector: 'app-mission',
  templateUrl: './mission.component.html',
  styleUrls: ['./mission.component.scss'],
})
export class MissionComponent implements OnInit {
  @ViewChild('areaCanvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;

  constructor(private userService: UserService) {}
  area: Area;
  roomStatus: RoomStatus;
  private ctx: CanvasRenderingContext2D;

  current_room = '1_1';
  BASE_X = 180;
  BASE_Y = 800;
  RECT_SIZE = 40;
  Y_LEVEL_SIZE = 100;
  Y_SPACE_BETWEEN_RECTS = this.Y_LEVEL_SIZE - this.RECT_SIZE;
  drawn_rooms = {};
  clickable_rooms = {};

  ngOnInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.enterArea();
  }

  attack() {
    this.userService.attack().subscribe((response: any) => {
      this.roomStatus = response;
      if (this.roomIsCleared()) {
        this.area = response.area;
        this.drawMap();
      }
    });
  }

  enterArea() {
    this.userService.enterArea().subscribe((response: any) => {
      // this.area = response;
      // this.drawMap();
      this.enterRoom('1_1');
      var self = this;
      this.canvas.nativeElement.addEventListener('click', function (event) {
        for (var room_code in self.clickable_rooms) {
          let room_coords = self.clickable_rooms[room_code];
          if (
            room_coords['x'] < event.offsetX &&
            room_coords['x'] + self.RECT_SIZE > event.offsetX &&
            room_coords['y'] < event.offsetY &&
            room_coords['y'] + self.RECT_SIZE > event.offsetY
          ) {
            self.enterRoom(room_code);
            return;
          }
        }
      });
    });
  }

  enterRoom(roomName: string) {
    this.userService.enterRoom(roomName).subscribe((response: any) => {
      this.roomStatus = response;
      this.current_room = roomName;
      this.area = response.area;
      this.drawMap();
    });
  }

  grabItem(itemName: string) {
    this.userService.grabItem(itemName).subscribe((response: any) => {
      this.roomStatus.monster.loot.items =
        this.roomStatus.monster.loot.items.filter((item) => item != itemName);
    });
  }

  drawMap() {
    this.drawn_rooms = {};
    this.ctx.clearRect(
      0,
      0,
      this.canvas.nativeElement.width,
      this.canvas.nativeElement.height
    );
    this.draw_room('1_1', 0, 0, false);
  }

  roomIsCleared(): boolean {
    if (this.roomStatus !== undefined && this.roomStatus.monster.hp <= 0) {
      return true;
    }
    return false;
  }

  draw_room(room_key, x_offset, branch_level, navigable) {
    var ctx = this.ctx;
    var BASE_X = this.BASE_X;
    var BASE_Y = this.BASE_Y;
    var RECT_SIZE = this.RECT_SIZE;
    var Y_SPACE_BETWEEN_RECTS = this.Y_SPACE_BETWEEN_RECTS;
    var Y_LEVEL_SIZE = this.Y_LEVEL_SIZE;

    this.drawn_rooms[room_key] = x_offset;
    var room = this.area.roomMap[room_key];
    if (room == undefined) {
      room = {};
      this.area.roomMap[room_key] = room;
    }
    var tier = parseInt(room_key.split('_')[0]);
    var y_offset = -tier * this.Y_LEVEL_SIZE;

    //Current room border
    this.ctx.beginPath();
    if (room_key == this.current_room) {
      this.ctx.strokeStyle = 'blue';
      this.ctx.lineWidth = 4;
    } else {
      if (navigable) {
        this.ctx.strokeStyle = 'orange';
        this.ctx.lineWidth = 7;
      } else {
        this.ctx.strokeStyle = 'green';
        this.ctx.lineWidth = 3;
      }
    }
    this.ctx.rect(
      this.BASE_X + x_offset,
      this.BASE_Y + y_offset,
      this.RECT_SIZE,
      this.RECT_SIZE
    );
    this.ctx.stroke();

    if (navigable) {
      this.clickable_rooms[room_key] = {
        x: this.BASE_X + x_offset,
        y: this.BASE_Y + y_offset,
      };
    }

    if (room.monster != undefined) {
      var img = new Image();
      img.src = '../../assets/monsters/' + room.monster + '.png';
      img.onload = function () {
        ctx.drawImage(img, BASE_X + x_offset + 2, BASE_Y + y_offset + 8);
      };
    }
    var branch_x_offset = 100;
    if (branch_level > 0) branch_x_offset = 50;
    if (room.nextRooms != undefined) {
      if (room.nextRooms.length == 2) {
        this.draw_line(
          BASE_X + x_offset + RECT_SIZE / 2,
          BASE_Y + y_offset,
          BASE_X + x_offset + RECT_SIZE / 2,
          BASE_Y + y_offset - Y_SPACE_BETWEEN_RECTS / 2
        );
        this.draw_line(
          BASE_X + x_offset + RECT_SIZE / 2 + branch_x_offset,
          BASE_Y + y_offset - Y_SPACE_BETWEEN_RECTS / 2,
          BASE_X + x_offset + RECT_SIZE / 2 + branch_x_offset,
          BASE_Y + y_offset - Y_SPACE_BETWEEN_RECTS
        );
        this.draw_line(
          BASE_X + x_offset + RECT_SIZE / 2 - branch_x_offset,
          BASE_Y + y_offset - Y_SPACE_BETWEEN_RECTS / 2,
          BASE_X + x_offset + RECT_SIZE / 2 - branch_x_offset,
          BASE_Y + y_offset - Y_SPACE_BETWEEN_RECTS
        );
        this.draw_line(
          BASE_X + x_offset + RECT_SIZE / 2 - branch_x_offset,
          BASE_Y + y_offset - Y_SPACE_BETWEEN_RECTS / 2,
          BASE_X + x_offset + RECT_SIZE / 2 + branch_x_offset,
          BASE_Y + y_offset - Y_SPACE_BETWEEN_RECTS / 2
        );
        this.draw_room(
          room.nextRooms[0],
          x_offset - branch_x_offset,
          branch_level + 1,
          this.roomIsCleared() && this.current_room == room_key
        );
        this.draw_room(
          room.nextRooms[1],
          x_offset + branch_x_offset,
          branch_level + 1,
          this.roomIsCleared() && this.current_room == room_key
        );
      } else if (room.nextRooms.length == 1) {
        var next_room = room.nextRooms[0];
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'gray';
        var next_tier = parseInt(next_room.split('_')[0]);
        var tier_multiplier = next_tier - tier;
        if (this.drawn_rooms[next_room] != undefined) {
          this.draw_line(
            BASE_X + x_offset + RECT_SIZE / 2,
            BASE_Y + y_offset,
            BASE_X + x_offset + RECT_SIZE / 2,
            BASE_Y +
              y_offset -
              Y_LEVEL_SIZE * tier_multiplier +
              RECT_SIZE +
              Y_SPACE_BETWEEN_RECTS / 2
          );
          this.draw_line(
            BASE_X + x_offset + RECT_SIZE / 2,
            BASE_Y +
              y_offset -
              Y_LEVEL_SIZE * tier_multiplier +
              RECT_SIZE +
              Y_SPACE_BETWEEN_RECTS / 2,
            BASE_X + this.drawn_rooms[next_room] + RECT_SIZE / 2,
            BASE_Y +
              y_offset -
              Y_LEVEL_SIZE * tier_multiplier +
              RECT_SIZE +
              Y_SPACE_BETWEEN_RECTS / 2
          );
        } else {
          this.draw_line(
            BASE_X + x_offset + RECT_SIZE / 2,
            BASE_Y + y_offset,
            BASE_X + x_offset + RECT_SIZE / 2,
            BASE_Y + y_offset - Y_LEVEL_SIZE * tier_multiplier + RECT_SIZE
          );
        }
        ctx.stroke();
        if (this.drawn_rooms[next_room] == undefined) {
          this.draw_room(
            next_room,
            x_offset,
            // y_offset - Y_LEVEL_SIZE,
            branch_level,
            this.roomIsCleared() && this.current_room == room_key
          );
        }
      }
    }
  }

  draw_line(from_x, from_y, to_x, to_y) {
    this.ctx.beginPath();
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = 'gray';
    this.ctx.moveTo(from_x, from_y);
    this.ctx.lineTo(to_x, to_y);
    this.ctx.stroke();
  }
}
