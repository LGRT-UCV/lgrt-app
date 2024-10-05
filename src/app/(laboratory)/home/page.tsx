"use client";

import Header from "@/components/layout/header";
import { Routes } from "@/lib/constants";
import { MANUAL_APP_URI } from "@/utils";
import { Card } from "antd";
import { useRouter } from "next/navigation";
import React from "react";

export default function Home() {
  const router = useRouter();
  const data = [
    {
      title: "Inventario",
      description:
        "Accede y gestiona cada uno de los elementos del inventario. Registra su información y actualiza sus datos si sucede algún cambio.",
      buttonLabel: "Ir al inventario",
      icon: "📦", // Icono en formato emoji
      onClick: () => router.push(Routes.Inventory),
    },
    {
      title: "Proyectos",
      description:
        "Planifica tus proyectos y registralos, asocia estimación de uso de materiales y genera tareas para asociarlos.",
      buttonLabel: "Gestionar proyectos",
      icon: "💼",
      onClick: () => router.push(Routes.Projects),
    },
    {
      title: "Solicitudes",
      description:
        "Genera una solicitud de prestamo de materiales, donde el personal del laboratorio podrá gestionarla y hacer seguimiento de la misma.",
      buttonLabel: "Ir a solicitudes",
      icon: "🤝",
      onClick: () => router.push(Routes.Requests),
    },
    {
      title: "Gestión de calidad",
      description:
        "Accede a los archivos de gestión de calidad, consulta reglas, estándares y protocolos con respecto al laboratorio y la aplicación.",
      buttonLabel: "Ir a los archivos",
      icon: "🏅",
      onClick: () => router.push(Routes.Files),
    },
    {
      title: "Manual de usuario",
      description:
        "Si necesitas ayuda sobre el uso de la aplicación, consulta nuestro manual de usuario para tener mayor información.",
      buttonLabel: "Ir al manual de usuario",
      icon: "📘",
      onClick: () => window.open(MANUAL_APP_URI, "_blank"),
    },
  ];

  return (
    <>
      <Header title="Bienvenido" />
      <div className="flex flex-wrap justify-center gap-8">
        {data.map((item, index) => (
          <Card
            key={index}
            className="w-full pb-8 text-center md:w-1/4"
            title={item.title}
            cover={
              <div className="mt-4 flex justify-center">
                <span className="text-6xl">{item.icon}</span>
              </div>
            }
            bordered={false}
          >
            <Card.Meta
              description={
                <div className="text-center text-gray-500">
                  {item.description}
                </div>
              }
            />
            <a
              onClick={item.onClick}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 text-blue-500"
            >
              {item.buttonLabel}
            </a>
          </Card>
        ))}
      </div>
    </>
  );
}
