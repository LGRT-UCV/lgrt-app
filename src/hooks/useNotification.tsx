import { ReactNode } from "react";
import { notification } from 'antd';
import type { NotificationPlacement } from "antd/es/notification/interface";

export default function useNotification () {
  const [api, notificationElement] = notification.useNotification();

  const openNotification = (message: string, description: string | ReactNode, placement: NotificationPlacement) => {
    const renderDescription = typeof description === "string" ?
      <p>{description}</p> :
      description;
    
    api.info({
      message,
      description: renderDescription,
      placement,
    });
  };


  return {
    openNotification,
    notificationElement,
  };
};

