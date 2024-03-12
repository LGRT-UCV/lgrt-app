import Link from "next/link";
import Text from "antd/es/typography";
import Title from "antd/es/typography/Title";
import { Button, Checkbox, Form, Input } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { LAB_DETAILS } from "@/lib/constants";

type TLoginFormData = {
  email: string;
  password: string;
  remember: boolean;
};

export default function LoginForm () {
  const onFinish = (values: TLoginFormData) => {
    console.log("Received values of form: ", values);
  };

  return (
    <>
      <div className="text-center my-8">
          <Title className="py-2">Iniciar Sesión</Title>
          <Text className="py-4 w-3/4 mx-auto">
            {`Bienvenido al ${LAB_DETAILS.longName}. Por favor ingrese los datos abajo para iniciar sesión`}
          </Text>
        </div>
        <Form
          name="normal_login"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          layout="vertical"
          requiredMark="optional"
          className="w-3/4 mx-auto"
        >
          <Form.Item
            name="email"
            rules={[
              {
                type: "email",
                required: true,
                message: "Por favor ingrese su correo!",
              },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Correo"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Por favor ingrese su contraseña!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              type="password"
              placeholder="Contraseña"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Recuerdame</Checkbox>
            </Form.Item>
            <Link className="float-right" href="">
              Olvidé mi contraseña
            </Link>
          </Form.Item>
          <Form.Item className="mb-0">
            <Button block className="bg-brand-primary text-brand-dark-light" htmlType="submit">
              Iniciar sesión
            </Button>
            {/* <div className="mt-16 text-center w-full">
              <Text className="text-brand-secondary">¿No tienes una cuenta?</Text>{" "}
              <Link href="">Sign up now</Link>
            </div> */}
          </Form.Item>
        </Form>
    </>
  );
};
