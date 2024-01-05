import { createSignal, createContext, JSXElement, useContext } from 'solid-js';

import { Category, CategoriesObject, Transaction, TransactionsObject } from '../types';

interface UseStateType {
  categories: () => CategoriesObject;
  setCategories: (categories: CategoriesObject) => {},
  transactions: () => TransactionsObject;
  setTransactions: (transactions: TransactionsObject) => {},
}

interface Props {
  children: JSXElement;
}

const StateContext = createContext();

const initialCategories: CategoriesObject = {};
const initialTransactions: TransactionsObject = {};

export function StateProvider(props: Props) {
  const [categories, setCategories] = createSignal(initialCategories);
  const [transactions, setTransactions] = createSignal(initialTransactions);

  // createEffect(() => {
  // });

  return (
    <StateContext.Provider value={{
      categories,
      setCategories,
      transactions,
      setTransactions,
    }}>
      {props.children}
    </StateContext.Provider>
  );
}

export function useState(): UseStateType {
  return useContext<any>(StateContext);
}
