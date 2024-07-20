import Image from "next/image";
import { UserOutlined } from "@ant-design/icons";

/**
 * Avatar interface
 *
 * @property `src` avatar uri
 * @property `label` label under the avatar image
 * @property `hideLabel` show or hide the label
 * @property `className` container className
 * @property `onClick` active when the user click the avatar image
 *
 */
interface IAvatar {
  src?: string;
  label?: string;
  hideLabel?: boolean;
  className?: string;
  onClick?: () => void;
}

/**
 * Avatar interface
 * @param src avatar uri
 * @param label label under the avatar image
 * @param hideLabel show or hide the label
 * @param className container className
 * @param onClick active when the user click the avatar image
 *
 * @returns Avatar component view
 */
export default function Avatar({
  src,
  label,
  hideLabel,
  className,
  onClick,
}: IAvatar) {
  return (
    <div
      className={`mx-auto my-4 flex w-fit flex-col items-center gap-4 ${className ?? ""}`}
    >
      {!!src ? (
        <Image
          src={src}
          alt="Avatar"
          width={40}
          height={40}
          onClick={onClick}
          className={`${!!onClick ? "cursor-pointer" : ""}`}
        />
      ) : (
        <UserOutlined
          className={`rounded-full border-4 p-1 text-4xl text-white ${!!onClick ? "cursor-pointer" : ""}`}
          onClick={onClick}
        />
      )}
      {!hideLabel && <p className="text-center text-white">{label}</p>}
    </div>
  );
}
