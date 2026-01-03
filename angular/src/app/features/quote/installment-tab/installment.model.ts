import { IQuoteOption, IQuoteSlip } from "../../admin/quote/quote.model";

export interface Iinstallment {
    _id?: string;
    quoteId: string | IQuoteSlip;
    quoteOptionId: string | IQuoteOption;
    isInstallmentScheduled: boolean;
    numberOfInstallments: number;
    installments: {
      installmentNumber: number;
      installmentAmount: number;
      installmentDate: Date;
    }[];
  }