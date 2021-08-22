import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';
import { UserStatus } from '../shared/UserStatus';

@Component({
  selector: 'app-user-status',
  templateUrl: './user-status.component.html',
  styleUrls: ['./user-status.component.scss'],
})
export class UserStatusComponent implements OnInit {
  constructor(private userService: UserService) {}

  public userStatus: UserStatus;

  ngOnInit(): void {}

  getUserStatus() {
    return this.userService.getUserStatus();
  }
}
