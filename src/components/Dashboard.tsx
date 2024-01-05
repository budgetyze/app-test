import { createMemo, createSignal } from "solid-js";

import type { Component } from 'solid-js';

import { useState } from '../contexts/State';
import { Category, CategoriesList, Transaction, TransactionsList } from '../types';
import {
  createCategory,
  createTransaction,
} from '../db';
import Navbar from './Navbar';

import styles from './Dashboard.module.css';

const Dashboard: Component = () => {
  const [selectedCategoryId, setSelectedCategoryId] = createSignal('');

  const {
    categories,
    transactions,
  } = useState();

  const categoriesList: () => CategoriesList = createMemo(() => {
    const categoriesObject = categories();
    const transactionsObject = transactions();

    // sort?

    // append extra values like spent amount?
    Object.keys(categoriesObject).forEach((categoryKey) => {
      const category = categoriesObject[categoryKey];
      let spentSum = 0;
      Object.keys(transactionsObject).map(transactionKey => {
        const transaction = transactionsObject[transactionKey];
        if (transaction.category === category.id) {
          spentSum = spentSum + transaction.amount;
        }
      });
      console.log(`=== spentSum ${category.name}`);
      console.log(spentSum)
      categoriesObject[categoryKey] = {
        ...category,
        __spent: spentSum,
      }
    });

    // convert object into array
    const categoriesList = Object.keys(categoriesObject).map((categoryKey) => categoriesObject[categoryKey]);
    return categoriesList;
  });

  const transactionsList: () => TransactionsList = createMemo(() => {
    const transactionsObject = transactions();

    // sort?

    // append extra values like category?

    // convert object into array
    const transactionsList = Object.keys(transactionsObject).map((transactionKey) => transactionsObject[transactionKey]);
    return transactionsList;
  });

  const getCategoryForTransaction = (transaction: Transaction): Category => {
    return categories()[transaction.category];
  }

  const unicodeIcons: string[] = ["🛒", "🏠", "🚗", "⛽️", "🍽️", "👨‍👩‍👧‍👦", "👖", "☕️", "🐶"];
  const handleClickAddCategory = () => {
    console.log('=== handleClickAddCategory');
    createCategory({
      name: `Test Category ${Math.random().toString(36).slice(2, 7)}`,
      amount: 300,
      icon: unicodeIcons[Math.floor(Math.random() * unicodeIcons.length)],
    })
  }

  const handleClickAddTransaction = () => {
    console.log('=== handleClickAddTransaction');
    createTransaction({
      name: `Test Transaction ${Math.random().toString(36).slice(2, 7)}`,
      date: `2023-01-01`,
      amount: Math.floor(Math.random() * (10 * 100 - 1 * 100) + 1 * 100) / (1*100),
      category: selectedCategoryId(),
    })
  }

  return (
    <>
      <Navbar />
      <div class={styles.container}>
        Dashboard
      </div>

      <hr />

      <div>Categories</div>

      <br />

      <div>
        <button onClick={handleClickAddCategory}>Add Category</button>
      </div>

      <br />

      <div>
        {categoriesList().map((category) => (
          <>
            <div>{category.icon}{category.name}</div>
            <div>{category.__spent}/{category.amount}</div>
            <br/>
          </>
        ))}
      </div>

      <hr />

      <div>Transactions</div>

      <br />

      <div>
        <button onClick={handleClickAddTransaction}>Add Transaction</button>

        <label for="category-select">Choose a category:</label>
        <select
          name="categories"
          id="category-select"
          onChange={(event) => {
            console.log('=== onChange');
            console.log(event.currentTarget.value);
            setSelectedCategoryId(event.currentTarget.value);
          }}
        >
          <option value="none">Select a category</option>
          {categoriesList().map(category => {
            return (
              <option value={category.id}>{category.icon} {category.name}</option>
            );
          })}
        </select>

      </div>

      <br />

      <div>
        {transactionsList().map(transaction => (
          <div>
            <span>{transaction.date}</span>
            <span>&nbsp;</span>
            <span>{transaction.amount}</span>
            <span>&nbsp;</span>
            <span>{transaction.name}</span>
            <span>&nbsp;</span>
            <span>{getCategoryForTransaction(transaction)?.icon ? getCategoryForTransaction(transaction)?.icon : "❓"}</span>

          </div>
        ))}
      </div>
    </>
  );
};

export default Dashboard;
