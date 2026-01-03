import { IQuoteSlip } from "../quote/quote.model"

export interface IPaymentDetails {
  _id?: string;
  quoteId: string | IQuoteSlip
  paymentStatus: string
  orderId: string
  razorpayPaymentId: string
  razorpayOrderId: string
  razorpaySignature: string
  paymentDateTime: Date;
  amount: Number;
  createdAt: Date;
  updatedAt: Date;
}