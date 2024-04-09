export interface IMaterial {
  name: string;
  description: string;
  presentation: string;
  quantity: string;
  brand: string;
  batch: string;
  concentration: string;
  storagePlace: string;
  expirationDate: string;
  observations: string;
  condition: string;
  weight: string;
  additionalInfo: string;
  capacity: string;
  code: string;
  superUse: boolean;
  sensibleMaterial: boolean;
  materialType: string;
  measurement: string;
  nfpaClassif: {
    nfpaBlue: number;
    nfpaRed: number;
    nfpaYellow: number;
    nfpaWhite: string
  };
  sgaClassif: [
    {
      idSgaClassif: string
    }
  ];
}