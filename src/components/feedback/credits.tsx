import { Card, Image } from "antd";
import React from "react";

interface Person {
  role: string;
  name: string;
}

interface CreditsProps {
  people: Person[];
}

const Credits: React.FC<CreditsProps> = ({ people }) => {
  const { autores, others } = people.reduce(
    (acc, person) => {
      if (person.role === "autor") {
        acc.autores.push(person);
      } else {
        acc.others.push(person);
      }
      return acc;
    },
    { autores: [] as Person[], others: [] as Person[] },
  );

  return (
    <div className="flex w-full flex-col justify-around gap-8 text-center">
      <div className="flex justify-center gap-8">
        <Image src="/icons/logo-ucv.png" width={112} preview={false} />
        <Image src="/icons/logo-ciencias.png" width={112} preview={false} />
        <Image src="/icons/logo-computacion.jpeg" width={112} preview={false} />
        <Image src="/icons/logo.png" width={112} preview={false} />
      </div>
      <div className="flex w-full flex-col justify-center gap-4 md:flex-row">
        <Card
          title="Autores"
          bordered={false}
          styles={{
            title: { color: "white" },
            body: { color: "white", fontWeight: "bold" },
          }}
          className="w-full bg-brand-dark md:w-96"
        >
          <ul>
            {autores.map((person, index) => (
              <li key={index}>{person.name}</li>
            ))}
          </ul>
        </Card>
        <Card
          title="Tutores"
          bordered={false}
          styles={{
            title: { color: "white" },
            body: { color: "white", fontWeight: "bold" },
          }}
          className="w-full bg-brand-dark md:w-96"
        >
          <ul>
            {others.map((person, index) => (
              <li key={index}>{person.name}</li>
            ))}
          </ul>
        </Card>
      </div>
      <Card title="Sobre el proyecto" className="mx-auto w-full text-justify">
        <p className="mb-4">
          Este proyecto consiste en el desarrollo de una aplicación web diseñada
          para mejorar la gestión y administración del inventario del
          Laboratorio de Granos, Raíces y Tubérculos (LGRT) de la Universidad
          Central de Venezuela (UCV). El propósito principal de la aplicación es
          proporcionar una herramienta eficiente que facilite el control y
          seguimiento de los materiales, equipos y recursos utilizados dentro
          del laboratorio, facilitando así los procesos de almacenamiento,
          consulta y manejo de inventarios.
        </p>

        <p className="mb-4">
          Este desarrollo tecnológico forma parte del Trabajo Especial de Grado
          realizado en la Escuela de Computación de la Facultad de Ciencias, con
          el título &quot;Aplicación web de gestión del inventario del
          Laboratorio de Granos, Raíces y Tubérculos Dra. Mercedes Baragaño de
          Mosqueda de la Universidad Central de Venezuela&quot;. El proyecto fue
          creado por los estudiantes Carlos Pino y Diego Chacón, bajo la
          supervisión y asesoría de los profesores Yosly Hernández y Romel
          Guzmán.
        </p>

        <p>
          La plataforma busca no solo ofrecer una solución digital que permita
          un control preciso de los recursos del laboratorio, sino también
          mejorar la organización interna, permitiendo a los investigadores y
          usuarios acceder de manera rápida y sencilla a la información
          relacionada con los insumos disponibles. Asimismo, contribuye a una
          mejor planificación en el uso de recursos y facilita la toma de
          decisiones en función de la disponibilidad de materiales, reactivos,
          equipos y otros elementos fundamentales para el desarrollo de
          investigaciones y proyectos dentro del laboratorio.
        </p>
      </Card>
    </div>
  );
};

export default Credits;
