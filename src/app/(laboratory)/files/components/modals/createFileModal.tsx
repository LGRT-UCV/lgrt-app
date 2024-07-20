import { Form, Input, Upload, type UploadProps } from "antd";
import { LoadingOutlined, InboxOutlined } from "@ant-design/icons";
import type { FormInstance } from "antd/lib";
import useFileForm from "../../hooks/useFileForm";
import TextArea from "antd/lib/input/TextArea";
import { IFile } from "../../interfaces";

export default function CreateFileModal({
  form,
  fileData,
  closeModal,
}: {
  form: FormInstance;
  fileData?: IFile;
  closeModal: () => void;
}) {
  const { isLoading, notificationElement, openNotification, onFinish } =
    useFileForm(() => {
      form.resetFields();
      closeModal();
    }, fileData);
  const props: UploadProps = {
    name: "file",
    accept: ".pdf",
    multiple: true,
    beforeUpload: (file: File) => {
      if (file.size > 2 * 1024 * 1024) {
        // 2MB
        openNotification(
          "error",
          "Archivo muy pesado",
          "Sólo se admiten archivos de hasta 2MB",
          "topRight",
        );
        return false;
      }

      if (file.type !== "application/pdf") {
        // PDF
        console.log("File type not supported");
        openNotification(
          "error",
          "Archivo no soportado",
          "Sólo se admiten archivos de tipo PDF",
          "topRight",
        );
        return false;
      }
      return false; // Prevents automatic upload
    },
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log("Uploading file");
      }
      if (status === "done") {
        console.log("Upload finished");
      } else if (status === "error") {
        console.log("Upload failed");
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  if (isLoading)
    return (
      <div className="w-full pt-4 text-center">
        <LoadingOutlined className="text-3xl" />
      </div>
    );

  return (
    <div>
      {notificationElement}
      <Form
        name="fileForm"
        form={form}
        onFinish={onFinish}
        layout="vertical"
        requiredMark="optional"
        size="large"
        scrollToFirstError
      >
        <Form.Item
          label="Nombre del archivo"
          name="name"
          className="w-full"
          rules={[
            {
              required: true,
              type: "string",
              max: 120,
              message: "Por favor verifique el nombre del archivo",
            },
          ]}
        >
          <Input placeholder="Nombre del archivo" maxLength={120} />
        </Form.Item>
        <Form.Item
          name="description"
          className="mt-4"
          rules={[
            {
              type: "string",
              required: true,
              max: 500,
              message: "Por favor verifique la descripción del archivo",
            },
          ]}
        >
          <TextArea
            placeholder="Descripción del archivo..."
            rows={4}
            maxLength={500}
          />
        </Form.Item>
        {typeof fileData === "undefined" && (
          <Form.Item name="file" className="mt-4">
            <Upload.Dragger {...props}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click o arrastra el archivo aquí para subirlo
              </p>
              <p className="ant-upload-hint">
                Soporta sólo una carga a la vez. Soporta archivos de hasta 2MB.
                Sólo PDF.
              </p>
            </Upload.Dragger>
          </Form.Item>
        )}
      </Form>
    </div>
  );
}
