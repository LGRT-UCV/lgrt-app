import type { FormInstance } from "antd/lib";
import type { IUser } from "../interfaces";
import useUserForm from "../hooks/useUserForm";
import CreateUserForm from "./createUserForm";

type TCreateUserModal = {
  form: FormInstance,
  data?: IUser,
  closeModal: () => void
};

export function CreateUserModal({ form, data, closeModal } : TCreateUserModal) {
  const {
    isLoading,
    notificationElement,
    openNotification,
    onFinish,
  } = useUserForm(() => {
    form.resetFields();
    closeModal();
  }, form, data);

  return (
    <div className="max-h-96 overflow-y-auto">
      {notificationElement}
      <CreateUserForm
        form={form}
        isLoading={isLoading}
        openNotification={openNotification}
        onFinish={onFinish}
      />
    </div>
  );
};