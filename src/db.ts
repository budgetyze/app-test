import PouchDB from 'pouchdb';
import PouchDBAuthentication from 'pouchdb-authentication';
import { v4 as uuidv4 } from 'uuid';

import {
  Category,
  CategoriesObject,
  Transaction,
  TransactionsObject,
} from './types';
import { stringToHex } from './utilities';

type CategoryCreation = Pick<Category, 'name' | 'amount' | 'icon'>
type TransactionCreation = Pick<Transaction, 'name' | 'amount' | 'category' | 'date'>

PouchDB.plugin(PouchDBAuthentication);

// todo: remove this
const USERNAME = 'jared';
const PASSWORD = 'x7cyex';

const PREFIX_CATEGORIES = 'ca';
const PREFIX_TRANSACTIONS = 'tr';

let dbLocal: any = null;

const allDocsToCategories = async (): Promise<CategoriesObject> => {
  const result = await dbLocal.allDocs({
    include_docs: true,
    startkey: PREFIX_CATEGORIES,
    endkey: `${PREFIX_CATEGORIES}\ufff0`,
  });

  const categoriesObject: CategoriesObject = {};
  result.rows.forEach((row: any) => {
    const { doc } = row;
    categoriesObject[doc._id] = {
      id: doc._id,
      name: doc.name,
      amount: doc.amount,
      icon: doc.icon,
    }
  });

  return categoriesObject;
};

const allDocsToTransactions = async (): Promise<TransactionsObject> => {
  const result = await dbLocal.allDocs({
    include_docs: true,
    startkey: PREFIX_TRANSACTIONS,
    endkey: `${PREFIX_TRANSACTIONS}\ufff0`,
  });

  const transactionsObject: TransactionsObject = {};
  result.rows.forEach((row: any) => {
    const { doc } = row;
    transactionsObject[doc._id] = {
      id: doc._id,
      name: doc.name,
      amount: doc.amount,
      date: doc.date,
      category: doc.category,
    };
  });

  return transactionsObject;
};

export const initialize = async ({
  setCategories,
  setTransactions,
}: {
  setCategories: (categories: CategoriesObject) => {},
  setTransactions:(transactions: TransactionsObject) => {},
}) => {
  dbLocal = new PouchDB('local');
  dbLocal.changes({
    include_docs: true,
    live: true,
    since: 'now',
  })
  .on('change', async (change: any) => {
    console.log('=== dbLocalChanges change', change);
    const categories = await allDocsToCategories();
    setCategories(categories);
    const transactions = await allDocsToTransactions();
    setTransactions(transactions);
  })
  .on('complete', (info: any) => {
    // changes() was canceled
  })
  .on('error', (error: any) => {
    console.log('=== dbLocalChanges error', error);
  });

  const dbRemote = new PouchDB(
    `http://localhost:5984/userdb-${stringToHex(USERNAME)}`,
    {
      skip_setup: true,
    },
  );

  dbRemote.logIn(USERNAME, PASSWORD, (error, response) => {
    if (error) {
      console.log('=== logIn error...');
      console.log(error);
    }
  });

  PouchDB.sync(dbLocal, dbRemote, { live: true, retry: true })
    .on('change', (info) => {
      // handle change
    })
    .on('paused', (err) => {
      // replication paused (e.g. replication up to date, user went offline)
    })
    .on('active', () => {
      // replicate resumed (e.g. new changes replicating, user went back online)
    })
    .on('denied', (error) => {
      // a document failed to replicate (e.g. due to permissions)
    })
    .on('complete', (info) => {
      // handle complete
    })
    .on('error', (error) => {
      // handle error
      console.log('=== sync error', error);
    });

  const categories = await allDocsToCategories();
  setCategories(categories);
  const transactions = await allDocsToTransactions();
  setTransactions(transactions);
};

export const createCategory = (category: CategoryCreation) => {
  console.log('=== createCategory');
  dbLocal.put({
    _id: `${PREFIX_CATEGORIES}_${uuidv4()}`,
    // _rev: doc._rev, // no rev on new
    type: 'category',
    name: category.name,
    icon: category.icon,
    amount: category.amount.toFixed(0),
  }).then((response: any) => {
    // handle response
  }).catch((error: any) => {
    console.log(error);
  });
};

export const createTransaction = (transaction: TransactionCreation) => {
  console.log('=== createTransaction');
  dbLocal.put({
    _id: `${PREFIX_TRANSACTIONS}_${uuidv4()}`,
    // _rev: doc._rev, // no rev on new
    type: 'transaction',
    name: transaction.name,
    date: transaction.date,
    amount: Number(transaction.amount.toFixed(2)),
    category: transaction.category,
  }).then((response: any) => {
    // handle response
  }).catch((error: any) => {
    console.log(error);
  });
};
