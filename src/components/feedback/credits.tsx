import { Card, Col, Row } from "antd";
import Title from "antd/es/typography/Title";
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
    <div className="flex w-full flex-col justify-around text-center">
      <Title level={3}>Créditos</Title>
      <Row className="w-full justify-center gap-4">
        <Col span={8}>
          <Card
            title="Autores"
            bordered={false}
            styles={{
              title: { color: "white" },
              body: { color: "white", fontWeight: "bold" },
            }}
            className="bg-brand-dark"
          >
            <ul>
              {autores.map((person, index) => (
                <li key={index}>{person.name}</li>
              ))}
            </ul>
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title="Tutores"
            bordered={false}
            styles={{
              title: { color: "white" },
              body: { color: "white", fontWeight: "bold" },
            }}
            className="bg-brand-dark"
          >
            <ul>
              {others.map((person, index) => (
                <li key={index}>{person.name}</li>
              ))}
            </ul>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Credits;
