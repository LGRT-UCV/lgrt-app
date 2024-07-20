import { IUser } from "@/(laboratory)/admin/users/interfaces";
import "next-auth";

declare module "next-auth" {
  interface Session {
    expires: string;
    user: {
      user: IUser;
      exp: number;
      token: string;
    };
  }
}
