"use client";

import { ReactNode, createContext, useContext, useState } from "react";
import { Roles } from "@/lib/constants";

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

  const handleMenuCollapsed = (collapsed?: boolean) => {
    const isCollapsed = collapsed ?? !menuCollapsed;
    setMenuCollapsed(isCollapsed);
  };

  return (
    <LabContext.Provider
      value={{
        role: Roles.Admin,
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