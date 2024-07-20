import type { TMenuItem } from "@/types/app";

/**
 * Get menu item formated
 */

export const getMenuItem = (
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: TMenuItem[],
  onClick?: () => void,
): TMenuItem => {
  return {
    key,
    icon,
    children,
    label,
    onClick,
  } as TMenuItem;
};
