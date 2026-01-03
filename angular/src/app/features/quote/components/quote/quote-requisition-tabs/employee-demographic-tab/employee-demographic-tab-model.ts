export const AnnualTurnOver: DDLModel[] = [
  { value: 0, label: '0' },
  { value: 50000, label: '₹ 50,000 ' },
  { value: 100000, label: '₹ 1,00,000' },
  { value: 200000, label: '₹ 2,00,000' },
  { value: 300000, label: '₹ 3,00,000' },
  { value: 400000, label: '₹ 4,00,000' },
  { value: 500000, label: '₹ 5,00,000' },
  { value: 600000, label: '₹ 6,00,000' },
  { value: 700000, label: '₹ 7,00,000' },
  { value: 800000, label: '₹ 8,00,000' },
  { value: 900000, label: '₹ 9,00,000' },
  { value: 1000000, label: '₹ 10,00,000' }
];

export const TypeOfInsurer: DDLModelStr[] = [
  { value: "Private", label: 'Private' },
  { value: "PSU", label: 'PSU' },
];
export const NameOfLeadInsurer: DDLModelStr[] = [
  { value: "Bajaj Finance Ltd", label: 'Bajaj Finance Ltd' },
  { value: "Relience Ltd", label: 'Relience Ltd' },
];
export const CurrentTPA: DDLModelStr[] = [
  { value: "Midi Assist", label: 'Midi Assist' }
];

export class DDLModel {
  value: number
  label: string;
}


export class DDLModelStr {
  value: string
  label: string;
}