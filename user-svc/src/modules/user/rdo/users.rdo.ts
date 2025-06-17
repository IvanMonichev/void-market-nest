import { User } from '../schemas/user.schema';

export class UsersRdo {
  data: User[];
  meta: {
    total: number;
    limit: number;
    offset: number;
  };
}
