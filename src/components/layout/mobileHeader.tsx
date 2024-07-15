import { Header } from "antd/es/layout/layout";
import Avatar from "../dataDisplay/avatar";
import MobileMenu from "./mobileMenu";
import { isMobile } from "react-device-detect";

export default function MobileHeader() {
  if (!isMobile) return <></>;

  return (
    <Header style={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between", padding: "0px 32px" }}>
      <Avatar
        src="/icons/logo.png"
        className="!mx-0"
        hideLabel
      />
      <MobileMenu />
    </Header>
  );
}