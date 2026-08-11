export type EtfMarket = 'domestic' | 'overseas';

export interface Etf {
  id: string;
  user_id: string | null;
  ticker: string;
  market: EtfMarket;
  name: string;
  tags: string[] | null;
  created_at: string;
}

export type EtfFormValues = Pick<Etf, 'ticker' | 'market' | 'name' | 'tags'>;

export interface EtfPrice {
  ticker: string;
  price: number;
  changePercent: number;
  currency: "KRW" | "USD";
}

export interface DomesticEtfCandidate {
  ticker: string;
  name: string;
  price: number;
  changePercent: number;
  marketCap: number;
}

export interface OverseasEtfCandidate {
  ticker: string;
  name: string;
}