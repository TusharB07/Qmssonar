import { IProduct } from "../product/product.model";

export interface IBscDiscount {
  _id?: string;
  bscType: string;
  fromSI: Number;
  toSI: Number;
  ratePerMile: Number;
  productId: string | IProduct;
  applicable_from: Date;
  applicable_to: Date;
}

export const BSC_TYPE_OPTIONS = [
  { label: "Fire Loss of Profit", value: "Fire Loss of Profit" },
  { label: "Burglary & Housebreaking", value: "Burglary & Housebreaking" },
  { label: "Money In Safe/Till", value: "Money In Safe/Till" },
  { label: "Money In Transit", value: "Money In Transit" },
  { label: "Electronic Equipments", value: "Electronic Equipments" },
  { label: "Portable Equipments", value: "Portable Equipments" },
  { label: "Fixed Plate Glass", value: "Fixed Plate Glass" },
  { label: "Accompanied Baggage", value: "Accompanied Baggage" },
  { label: "Fidelity guarantee", value: "Fidelity guarantee" },
  { label: "Signage", value: "Signage" },
  { label: "Liability section", value: "Liability section" },
]