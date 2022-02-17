export interface Pricing {
  opening: number,
  low: number,
  high: number,
  closing: number,
  pricedAt: string 
}


export interface History {
  name:string;
  prices:Pricing[];
}