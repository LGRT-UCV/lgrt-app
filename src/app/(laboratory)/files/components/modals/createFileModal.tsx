import { Form, Upload, type UploadProps } from "antd";
import { LoadingOutlined, InboxOutlined } from "@ant-design/icons";
import type { FormInstance } from "antd/lib";
import useFileForm from "../../hooks/useFileForm";

export default function CreateFileModal ({ form, closeModal } : { form : FormInstance, closeModal: () => void}) {
  const {
    isLoading,
    notificationElement,
    openNotification,
    onFinish,
  } = useFileForm(() => {
    form.resetFields();
    closeModal();
  });
  const props: UploadProps = {
    name: "file",
    accept:".pdf",
    multiple: true,
    beforeUpload: (file: File) => {
      if (file.size > 2 * 1024 * 1024) {  // 2MB
        openNotification("error", "Archivo muy pesado", "Sólo se admiten archivos de hasta 2MB", "topRight");
        return false;
      }

      if (file.type !== "application/pdf") {  // PDF
        console.log("File type not supported");
        openNotification("error", "Archivo no soportado", "Sólo se admiten archivos de tipo PDF", "topRight");
        return false;
      }
      return false; // Prevents automatic upload
    },
    onChange(info) {
      const { status, originFileObj } = info.file;
      if (status !== "uploading") {
        console.log(originFileObj, info.fileList);
      }
      if (status === "done") {
        console.log("Upload finished")
      } else if (status === "error") {
        console.log("Upload failed");
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };


  if (isLoading) return (
    <div className="w-full text-center pt-4">
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
        <Form.Item name="file">
          <Upload.Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click o arrastra el archivo aquí para subirlo</p>
            <p className="ant-upload-hint">
              Soporta sólo una carga a la vez. Soporta archivos de hasta 2MB. Sólo PDF.
            </p>
          </Upload.Dragger>
        </Form.Item>
      </Form>
    </div>
  );
};