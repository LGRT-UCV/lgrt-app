"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Roles, Routes } from "@/lib/constants";
import { useSession, signOut } from "next-auth/react";
import { getUserRole } from "@/(laboratory)/admin/users/utils";
import { IUser } from "@/(laboratory)/admin/users/interfaces";
import { jwtDecode } from "jwt-decode";

/**
 * Type to define return values
 *
 * @property `role` return the current user role
 * @property `user` return the current user
 * @property `isConnected` Define if the user is connected or not
 * @property `menuCollapsed` Define if the side menu is opened or not
 * @property `handleMenuCollapsed` Menu collapse handler
 */
type TLabReturnValues = {
  role: Roles;
  user: IUser | undefined;
  isConnected: boolean;
  menuCollapsed: boolean;
  handleMenuCollapsed: (value?: boolean) => void;
};

/**
 * Default context values
 *
 * @property `role` return the current user role
 * @property `user` return the current user
 * @property `isConnected` Define if the user is connected or not
 * @property `menuCollapsed` Define if the side menu is opened or not
 * @property `handleMenuCollapsed` Menu collapse handler
 */
const defaultValues: TLabReturnValues = {
  role: Roles.External,
  user: undefined,
  isConnected: false,
  menuCollapsed: true,
  handleMenuCollapsed: () => undefined,
};

/**
 * Laboratory context
 */
export const LabContext = createContext<TLabReturnValues>(defaultValues);

/**
 * Provider
 * @param children ReactNode;
 *
 * @returns React.JSX.Element
 */
export const LabProvider = ({
  children,
}: Readonly<{ children: ReactNode }>) => {
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const { data: sessionData, status } = useSession();

  const isConnected = useMemo(() => {
    if (!sessionData) return false;

    const tokenData: { exp: number; sub: string } = jwtDecode(
      sessionData?.user.token ?? "",
    );
    const currentTimestamp = Date.now();

    return tokenData.exp * 1000 > currentTimestamp;
  }, [sessionData]);

  useEffect(() => {
    if (!isConnected && status !== "loading") {
      void signOut({ callbackUrl: Routes.Login, redirect: true });
    }
  }, [isConnected]);

  const handleMenuCollapsed = (collapsed?: boolean) => {
    const isCollapsed = collapsed ?? !menuCollapsed;
    setMenuCollapsed(isCollapsed);
  };

  const role = useMemo(() => {
    if (!sessionData) return Roles.External;
    return (
      getUserRole(Number(sessionData.user.user.idRoleId)).roleName ??
      Roles.External
    );
  }, [sessionData]);

  return (
    <LabContext.Provider
      value={{
        role,
        isConnected,
        user: sessionData?.user.user ?? undefined,
        menuCollapsed,
        handleMenuCollapsed,
      }}
    >
      {children}
    </LabContext.Provider>
  );
};

/**
 * useLabProvider provider hook
 *
 * @returns TLabReturnValues
 */
export const useLabProvider = () => useContext(LabContext);
