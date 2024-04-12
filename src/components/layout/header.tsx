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
  fixed?: boolean;
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
  fixed,
}: IHeader) {
  return (
    <div className="relative w-full">
      <div className={`flex justify-between p-2 items-center ${fixed ? "fixed z-10" : ""}`}>
        <Title>{title}</Title>
        {!!btn && (
          <Button type={btn.type} icon={btn.icon} onClick={btn.onClick}>{btn.label}</Button>
        )}
      </div>
    </div>
  );
}