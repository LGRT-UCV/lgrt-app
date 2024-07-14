export interface IGenericId {
  id: string;
}

export type TNotificationType = "success" | "error" | "info" | "warning";

export type TMenuItem = Required<MenuProps>["items"][number];