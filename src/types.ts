export type GetInfoResponse = {
  versions: string[];
};

type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> &
      Partial<Record<Exclude<Keys, K>, undefined>>;
  }[Keys];

type OrgBase = {
  'sfin-url': string;
  url?: string;
  id?: string;
  domain?: string;
  name?: string;
};

export type Org = RequireAtLeastOne<OrgBase, 'domain' | 'name'>;

export type Transaction = {
  id: string;
  posted: number;
  amount: string;
  description: string;
  transacted_at?: number;
  pending?: boolean;
  extra?: Record<string, unknown>;
};

export type Account = {
  org: Org;
  id: string;
  name: string;
  currency: string;
  balance: string;
  'available-balance': string;
  'balance-date': number;
  transactions: Transaction[];
};

export type GetAccountsResponse = {
  errors: string[];
  accounts: Account[];
};
