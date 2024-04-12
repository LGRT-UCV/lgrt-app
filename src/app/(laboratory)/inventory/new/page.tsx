import { SaveOutlined } from "@ant-design/icons";
import Header from "@/components/layout/header";
import NewMaterialForm from "./newMaterialForm";

export default function NewMaterial () {

  return (
    <>
      <Header
        title="Nuevo elemento"
        btn={{
          label: "Guardar",
          icon: <SaveOutlined />,
        }}
      />

      <NewMaterialForm />
    </>
  );
};