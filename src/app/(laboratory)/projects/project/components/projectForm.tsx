import { Form, Input, TreeSelect, Upload } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import useProjectForm from "../hooks/useProjectForm";
import type { IProjectForm } from "../../interfaces";

export default function ProjectForm ({
  formIntance,
  projectData,
}: IProjectForm) {
  const {
    materialList,
    isLoading,
    notificationElement,
  } = useProjectForm(formIntance, projectData);

  if (isLoading) return (
    <div className="w-full text-center pt-4">
      <LoadingOutlined className="text-3xl" />
    </div>
  );

  return (
    <div className="max-h-full overflow-y-auto p-2">
      {notificationElement}
      <Form
        name="projectForm"
        form={formIntance}
        //onFinish={onFinish}
        layout="vertical"
        requiredMark="optional"
        size="large"
        scrollToFirstError
      >
        <div className="flex flex-wrap justify-between">
          <Form.Item
            label="Nombre del proyecto"
            name="name"
            className="w-full md:w-1/2 px-2 mb-4"
            rules={[
              {
                type: "string",
                required: true,
                max: 120,
                message: "Por favor verifique el nombre del proyecto",
              },
            ]}
          >
            <Input placeholder="Nombre del proyecto" maxLength={120} />
          </Form.Item>
          <Form.Item
            label="Responsable del proyecto"
            name="projectManager"
            className="w-full md:w-1/2 px-2 mb-4"
            rules={[
              {
                type: "string",
                max: 120,
                message: "Por favor verifique el responsable del proyecto",
              },
            ]}
          >
            <Input placeholder="Responsable del proyecto" maxLength={120} />
          </Form.Item>
        </div>
        <Form.Item
          name="description"
          className="px-2"
          rules={[
            {
              type: "string",
              required: true,
              max: 500,
              message: "Por favor verifique la descripción del proyecto",
            },
          ]}
        >
          <TextArea placeholder="Descripción del proyecto..." rows={4} maxLength={500}/>
        </Form.Item>
        <div className="flex flex-wrap justify-between">
          <Form.Item
            label="Link del archivo (opcional)"
            name="fileUri"
            className="w-full md:w-1/2 px-2 mb-4"
            rules={[
              {
                type: "url",
                max: 300,
                min: 6,
                message: "Por favor verifique el link del archivo",
              },
            ]}
          >
            <Input placeholder="Link del proyecto" minLength={6} maxLength={300} />
          </Form.Item>
          <Form.Item
            label="Materiales a usar"
            name="projectMaterial"
            className="w-full md:w-1/2 px-2 mb-4"
            shouldUpdate
          >
            <TreeSelect
              showSearch
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="Please select"
              allowClear
              multiple
              treeData={materialList}
            />
          </Form.Item>
          {/* <Form.Item
            label="Archivos"
            name="file"
            className="w-full md:w-1/2 px-2 mb-4"
            rules={[
              {
                type: "string",
                required: true,
                max: 120,
                message: "Por favor verifique el responsable del proyecto",
              },
            ]}
          >
            <Upload action="/upload.do" listType="picture-card">
              <button style={{ border: 0, background: 'none' }} type="button">
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Subir archivo</div>
              </button>
          </Upload>
          </Form.Item> */}
        </div>
      </Form>
    </div>
  );
};