"use client";

import { ReactNode, createContext, useContext, useMemo, useState } from "react";
import { Roles } from "@/lib/constants";
import { useSession } from "next-auth/react";
import { getUserRoleName } from "@/(laboratory)/admin/users/utils";

/**
 * Type to define return values
 * 
 * @property `role` return the current user role
 * @property `menuCollapsed` Define if the side menu is opened or not
 * @property `handleMenuCollapsed` Menu collapse handler
 */
type TLabReturnValues = {
  role: Roles,
  menuCollapsed: boolean;
  handleMenuCollapsed: (value?: boolean) => void;
};

/**
 * Default context values
 * 
 * @property `role` return the current user role
 * @property `menuCollapsed` Define if the side menu is opened or not
 * @property `handleMenuCollapsed` Menu collapse handler
 */
const defaultValues: TLabReturnValues = {
  role: Roles.External,
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
export const LabProvider = ({ children } : Readonly<{ children: ReactNode }>) => {
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const { data: sessionData } = useSession();

  const handleMenuCollapsed = (collapsed?: boolean) => {
    const isCollapsed = collapsed ?? !menuCollapsed;
    setMenuCollapsed(isCollapsed);
  };

  const role = useMemo(() => {
    if (!sessionData) return Roles.External;
    return getUserRoleName(Number(sessionData.user.user.idRoleId)) ?? Roles.External;
  }, [sessionData]);

  return (
    <LabContext.Provider
      value={{
        role,
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