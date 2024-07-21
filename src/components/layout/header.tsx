import { ReactNode } from "react";
import { Button } from "antd";

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
};

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
}

/**
 * Page info component
 *
 * @param title prints page title
 * @param btn configures helper button
 *
 * @returns Header JSX component
 */
export default function Header({ title, btn, fixed }: IHeader) {
  return (
    <div className="relative w-full">
      <div
        className={`flex items-center justify-between p-2 ${fixed ? "fixed z-10" : ""}`}
      >
        <h1 className="text-2xl font-bold md:text-4xl">{title}</h1>
        {!!btn && (
          <Button
            type={btn.type ?? "default"}
            icon={btn.icon}
            onClick={btn.onClick}
            className={btn.type === "primary" ? "bg-blue-500 text-white" : ""}
          >
            {btn.label}
          </Button>
        )}
      </div>
    </div>
  );
}
