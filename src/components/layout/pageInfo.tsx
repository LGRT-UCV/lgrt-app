
import Paragraph from "antd/es/typography/Paragraph";
import Header from "./header";
import type { TButtonProps } from "./header";

/**
 * Page info interface
 * 
 * @property `title` prints page title
 * @property `description` prints description page
 * @property `btn` configures helper button
 */
interface IPageInfo {
  title: string;
  description: string;
  btn?: TButtonProps;
};

/**
 * Page info component
 * 
 * @param title prints page title
 * @param description prints description page
 * @param btn configures helper button
 * 
 * @returns PageInfo JSX component
 */
export default function PageInfo ({
  title,
  description,
  btn,
}: IPageInfo) {
  return (
    <div>
      <Header
        title={title}
        btn={btn}
      />
      <Paragraph>{description}</Paragraph>
    </div>
  );
};