import { IUser } from '~/types/IUser';
export type SubPostRes = {
    url :   string | null;
    user: IUser;
    shouldUpdateUser: boolean;
  };