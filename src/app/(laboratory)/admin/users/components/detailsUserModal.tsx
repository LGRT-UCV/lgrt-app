import { IUser } from "../interfaces";
import { userRoles } from "../utils";

interface IDetailsModal {
  user?: IUser;
};

export default function DetailsModal ({ user }: IDetailsModal) {

  if (typeof user === "undefined") return <></>;
  
  return (<>
    <div className="mx-auto p-4 max-h-[calc(100vh-200px)] overflow-auto">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
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

        <p className="w-full my-4">
          <strong>Correo:</strong> {user.id}
        </p>

        <p className="w-full my-4">
          <strong>Role:</strong> {userRoles.find(role => role.id === Number(user.idRoleId))?.roleName ?? "Invitado"}
        </p>

        <p className="w-full my-4">
          <strong>Laboratorio:</strong> {user.laboratory.name ?? "Sin laboratorio"}
        </p>
      </div>
    </div>
  </>);
};