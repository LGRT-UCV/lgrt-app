import { IUser } from "@/(laboratory)/admin/users/interfaces";
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      user: IUser;
      token: string;
    };
  }
};
