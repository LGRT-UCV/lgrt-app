import { ReactNode } from "react";
import { Button } from "antd";
import Title from "antd/es/typography/Title";

/**
 * Button props
 * 
 * @property `btnLabel` prints button label
 * @property `btnType` sets button type
 * @property `btnIcon` sets button icon from a component
 * @property `href` ref uri
 */
export type TButtonProps = {
  label?: string;
  type?: "primary" | "link" | "text" | "default";
  icon?: ReactNode;
  onClick?: () => void;
}

/**
 * Page info interface
 * 
 * @property `title` prints page title
 * @property `btn` configures helper button
 */
interface IHeader {
  title: string;
  btn?: TButtonProps;
};

/**
 * Page info component
 * 
 * @param title prints page title
 * @param btn configures helper button
 * 
 * @returns Header JSX component
 */
export default function Header ({
  title,
  btn,
}: IHeader) {
  return (
    <div className="w-full flex justify-between">
      <Title>{title}</Title>
      {!!btn && (
        <Button type={btn.type} icon={btn.icon} onClick={btn.onClick}>{btn.label}</Button>
      )}
    </div>
  );
}