import { Form, Input } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import useProjectForm from "../hooks/useProjectForm";
import type { IProjectForm } from "../../interfaces";
import RequiredLegend from "@/components/feedback/requiredLegend";
import ProjectMaterials from "./projectMaterials";
import ProjectTasks from "./projectTasks";

export default function ProjectForm({ formIntance }: IProjectForm) {
  const { isLoading, notificationElement, onFinish, ...projectMaterial } =
    useProjectForm(formIntance);

  if (isLoading)
    return (
      <div className="w-full pt-4 text-center">
        <LoadingOutlined className="text-3xl" />
      </div>
    );

  return (
    <div className="max-h-full overflow-y-auto p-2">
      {notificationElement}
      <Form
        name="projectForm"
        form={formIntance}
        onFinish={onFinish}
        layout="vertical"
        size="large"
        scrollToFirstError
      >
        <div className="flex flex-wrap justify-between">
          <Form.Item
            label="Nombre del proyecto"
            name="name"
            className="mb-4 w-full px-2 md:w-1/2"
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
            className="mb-4 w-full px-2 md:w-1/2"
            rules={[
              {
                type: "string",
                required: true,
                max: 120,
                message: "Por favor verifique el responsable del proyecto",
              },
            ]}
          >
            <Input placeholder="Responsable del proyecto" maxLength={120} />
          </Form.Item>
        </div>
        <Form.Item
          label="Descripción"
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
          <TextArea
            placeholder="Descripción del proyecto..."
            rows={4}
            maxLength={500}
          />
        </Form.Item>
        <Form.Item
          label="Link del archivo (opcional)"
          name="projectUri"
          className="mb-8 w-full px-2"
          rules={[
            {
              type: "url",
              max: 300,
              min: 6,
              message: "Por favor verifique el link del archivo",
            },
          ]}
        >
          <Input
            placeholder="Link del proyecto"
            minLength={6}
            maxLength={300}
          />
        </Form.Item>
        <div className="flex gap-8">
          <div className="w-full space-y-4 md:w-1/2">
            <h2 className="text-2xl">Materiales a usar</h2>
            <ProjectMaterials {...projectMaterial} />
          </div>
          <div className="w-full space-y-4 md:w-1/2">
            <h2 className="text-2xl">Lista de tareas</h2>
            <ProjectTasks />
          </div>
        </div>
      </Form>
      <RequiredLegend />
    </div>
  );
}
