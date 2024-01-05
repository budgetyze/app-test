type Century = '20';
type ZeroToNine = '0' | '1' | '2' | '3'| '4' | '5' | '6' | '7' | '8' | '9';
type Month = '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10' | '11' | '12';
type Day = '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10' | '11' | '12' | '13' | '14' | '15' | '16' | '17' | '18' | '19' | '20' | '21' | '22' | '23' | '24' | '25' | '26' | '27' | '28' | '29' | '30' | '31';
type Date = `${Century}${ZeroToNine}${ZeroToNine}-${Month}-${Day}`;

export interface Category {
  id: string;
  name: string;
  amount: number;
  icon: string;

  // nilable front-end calculated values prefixed with __
  __spent?: number;
}
export type CategoriesObject = { [key: string]: Category };
export type CategoriesList = Category[];

export interface Transaction {
  id: string;
  name: string;
  amount: number;
  date: Date;
  category: string;

  // front-end calculated values prefixed with __
}
export type TransactionsObject = { [key: string]: Transaction };
export type TransactionsList = Transaction[];
