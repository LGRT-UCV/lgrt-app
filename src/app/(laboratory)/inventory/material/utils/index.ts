import type { TDefaultMaterialFields } from "../../materialType/interfaces";

export const variableFields: Array<TDefaultMaterialFields> = [
  {
    id: "measurement",
    label: "Unidad de medida",
  },
  {
    id: "presentation",
    label: "Presentación",
  },
  {
    id: "capacity",
    label: "Capacidad",
  },
  {
    id: "weight",
    label: "Peso",
  },
  {
    id: "quantity",
    label: "Cantidad",
  },
  {
    id: "brand",
    label: "Marca",
  },
  {
    id: "code",
    label: "Código",
  },
  {
    id: "batch",
    label: "Lote",
  },
  {
    id: "concentration",
    label: "Concentración",
  },
  {
    id: "expirationDate",
    label: "Fecha de Vencimiento",
  },
  {
    id: "condition",
    label: "Condición",
  },
  {
    id: "storagePlace",
    label: "Lugar de almacenamiento",
  },
  {
    id: "sensibleMaterial",
    label: "Material sensible",
  },
  {
    id: "superUse",
    label: "Necesita supervisión",
  },
  {
    id: "additionalInfo",
    label: "Información Adicional",
  },
  {
    id: "observations",
    label: "Observaciones",
  },
  {
    id: "nfpaClassif",
    label: "Clasificación NFPA",
  },
  {
    id: "sgaClassif",
    label: "Clasificación SGA",
  },
];

export const baseFields: Array<TDefaultMaterialFields> = [
  {
    id: "id",
    label: "#",
  },
  {
    id: "name",
    label: "Nombre",
  },
  {
    id: "description",
    label: "Descripción",
  },
  {
    id: "materialType",
    label: "Tipo de material",
  },
];

const notListedFieldsId = [
  "measurement",
  "additionalInfo",
  "observations",
  "nfpaClassif",
  "sgaClassif",
];

export const fieldsToList = baseFields
  .concat(variableFields)
  .filter((field) => !notListedFieldsId.includes(field.id));

export const isoDateRegex =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})?$/;

// NFPA classification
type TNFPALabels = {
  [key: string]: string;
};
type TNFPADescription = {
  blue: TNFPALabels;
  red: TNFPALabels;
  yellow: TNFPALabels;
  white: TNFPALabels;
};

export const nfpaClassifDescription: TNFPADescription = {
  blue: {
    "0": "Peligro mínimo",
    "1": "Peligro leve ",
    "2": "Peligro moderado ",
    "3": "Peligro grave",
    "4": "Peligro severo ",
    label: "Nivel de Riesgo",
  },
  red: {
    "0": "No se incendia",
    "1": "Tiene que precalentarse para que se incendie",
    "2": "se enciende al calentarse moderadamente",
    "3": "Se enciende a temperaturas ambientes",
    "4": "Líquidos inflamables, líquidos volátiles, materiales pirofóricos",
    label: "Inflamabilidad",
  },
  yellow: {
    "0": "Normalmente estable",
    "1": "Normalmente estable pero puede convertirse en inestable si se calienta",
    "2": "Cambio químico violento es posible a temperaturas y presiones elevadas",
    "3": "Capaz de detonación o explosión",
    "4": "Fácilmente capaz de detonación o explosión",
    label: "Inestabilidad",
  },
  white: {
    W: "Evite el uso de agua",
    OX: "Oxidante",
    SA: "Asfixiante simple",
    label: "Especial",
  },
};
