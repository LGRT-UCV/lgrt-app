import { ReactNode } from "react";
import { notification } from 'antd';
import type { NotificationPlacement } from "antd/es/notification/interface";
import type { TNotificationType } from "@/types/app";

export default function useNotification () {
  const [api, notificationElement] = notification.useNotification();

  const openNotification = (
    type: TNotificationType,
    message: string,
    description: string | ReactNode,
    placement: NotificationPlacement
  ) => {
    const renderDescription = typeof description === "string" ?
      <p>{description}</p> :
      description;

    const notificationData = {
      message,
      description: renderDescription,
      placement,
    };
    
    switch (type) {
      case "success":
        api.success(notificationData);
        break;
      case "error":
        api.error(notificationData);
        break;
      case "warning":
        api.warning(notificationData);
        break;
      default:
        api.info(notificationData);
        break;
    };
  };


  return {
    openNotification,
    notificationElement,
  };
};

