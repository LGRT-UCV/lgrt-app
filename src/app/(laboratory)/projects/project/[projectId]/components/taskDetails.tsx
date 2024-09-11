import { useMemo } from "react";
import { Form, Input, Select, Tag } from "antd";
import {
  type ITaskDetails,
  TTaskStatus,
} from "@/(laboratory)/projects/interfaces";
import useNotification from "@/hooks/useNotification";
import { getStatus } from "../utils";
import TextArea from "antd/es/input/TextArea";

type TTaskDetails = {
  currentTask: ITaskDetails;
};

export default function TaskDetails({ currentTask }: TTaskDetails) {
  const { openNotification, notificationElement } = useNotification();
  const [form] = Form.useForm();

  const { status, statusColor } = useMemo(() => {
    return getStatus(currentTask.status);
  }, [currentTask.status]);

  const onFinish = (taskData) => {};

  return (
    <>
      {notificationElement}
      <div className="mx-auto max-h-[calc(100vh-200px)] overflow-auto p-4">
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <h2 className="text-xl font-bold">Tarea #{currentTask.id}</h2>
          <Tag color={statusColor}>{status}</Tag>
        </div>
        <Form
          name="taskForm"
          form={form}
          onFinish={onFinish}
          layout="vertical"
          size="large"
          scrollToFirstError
          className="p-4"
        >
          <Form.Item
            name="materialType"
            label="Tipo de material"
            rules={[{ required: true, message: "Por favor elija una opción" }]}
            className="mb-4 w-full px-2 md:w-1/3"
          >
            <Select
              placeholder="Estado"
              onSelect={() => form.submit()}
              options={[].map((task) => {
                return {
                  label: "",
                  value: "",
                };
              })}
            />
          </Form.Item>
          <Form.Item
            name="name"
            className="mb-4 w-full px-2"
            rules={[
              {
                type: "string",
                required: true,
                max: 120,
                message: "Por favor verifique el nombre de la tarea",
              },
            ]}
          >
            <Input placeholder="Nombre de la tarea" maxLength={120} />
          </Form.Item>
          <Form.Item
            label="Descripción"
            name="description"
            className="w-full px-2"
            rules={[
              {
                type: "string",
                required: false,
                max: 500,
                message: "Por favor verifique la descripción de la tarea",
              },
            ]}
          >
            <TextArea
              placeholder="Descripción de la tarea..."
              rows={4}
              maxLength={500}
            />
          </Form.Item>
        </Form>
      </div>
    </>
  );
}
