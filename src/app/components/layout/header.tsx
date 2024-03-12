import { ReactNode } from "react";
import { Button } from "antd";
import Title from "antd/es/typography/Title";

/**
 * Button props
 * 
 * @property `btnLabel` prints button label
 * @property `btnType` sets button type
 * @property `btnIcon` sets button icon from a component
 */
export type TButtonProps = {
  btnLabel?: string;
  btnType?: "primary" | "link" | "text" | "default";
  btnIcon?: ReactNode;
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
        <Button type={btn.btnType} icon={btn.btnIcon}>{btn.btnLabel}</Button>
      )}
    </div>
  );
}