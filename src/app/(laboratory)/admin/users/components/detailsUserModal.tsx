import React from "react";
import { IUser } from "../interfaces";
import { userRoles } from "../utils";

interface IDetailsModal {
  user?: IUser;
}

export default function DetailsModal({ user }: IDetailsModal) {
  if (typeof user === "undefined") return <></>;

  return (
    <>
      <div className="mx-auto max-h-[calc(100vh-200px)] overflow-auto p-4">
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <h2 className="text-xl font-bold">{user.name}</h2>
        </div>
        <div className="p-4">
          <div className="flex gap-4">
            <p className="w-full">
              <strong>Nombre:</strong> {user.name}
            </p>

            <p className="w-full">
              <strong>Apellido:</strong> {user.lastName}
            </p>
          </div>

          <p className="my-4 w-full">
            <strong>Correo:</strong> {user.id}
          </p>

          <p className="my-4 w-full">
            <strong>Role:</strong>{" "}
            {userRoles.find((role) => role.id === Number(user.idRoleId))
              ?.roleName ?? "Invitado"}
          </p>

          <p className="my-4 w-full">
            <strong>Laboratorio:</strong>{" "}
            {user.laboratory.name ?? "Sin laboratorio"}
          </p>
        </div>
      </div>
    </>
  );
}
