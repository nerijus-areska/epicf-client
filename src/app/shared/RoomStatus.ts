import { Area } from './Area';
import { Monster } from './Monster';
import { UserStatus } from './UserStatus';

export class RoomStatus {
  constructor(
    public area: Area,
    public monster: Monster,
    public user: UserStatus
  ) {}
}
