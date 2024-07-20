import { useState } from "react";
import { Drawer, Menu, Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import useMenuItems from "@/hooks/useMenuItems";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const items = useMenuItems({
    closeMenu: () => setOpen(false),
  });

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <div className="border-none bg-transparent text-white">
      <Button type="primary" onClick={showDrawer} icon={<MenuOutlined />} />
      <Drawer
        title="Menu"
        placement="right"
        closable={true}
        onClose={onClose}
        open={open}
      >
        <Menu mode="inline" items={items} style={{ minWidth: 0 }} />
      </Drawer>
    </div>
  );
}
