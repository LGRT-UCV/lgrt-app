"use client";

import { ReactNode, createContext, useContext, useEffect, useState } from "react";

/**
 * Type to define return values
 * 
 * @property `menuCollapsed` Define if the side menu is opened or not
 * @property `handleMenuCollapsed` Menu collapse handler
 */
type TLabReturnValues = {
  menuCollapsed: boolean;
  handleMenuCollapsed: (value?: boolean) => void;
};

/**
 * Default context values
 * 
 * @property `menuCollapsed` Define if the side menu is opened or not
 * @property `handleMenuCollapsed` Menu collapse handler
 */
const defaultValues: TLabReturnValues = {
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