import type { Component } from 'solid-js';

import Navbar from './Navbar';

import styles from './Transactions.module.css';

const Transactions: Component = () => {
  return (
    <>
      <Navbar />
      <div class={styles.container}>
        Transactions
      </div>
    </>
  );
};

export default Transactions;
