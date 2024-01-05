import type { Component } from 'solid-js';
import { A } from '@solidjs/router';

import styles from './Navbar.module.css';

const Navbar: Component = () => {
  return (
    <div class={styles.container}>
      <div class={styles.brand}>
        <A href="/">Budgetyze</A>
      </div>
      <div class={styles.right}>
        <A href="/settings">Settings</A>
      </div>
    </div>
  );
};

export default Navbar;
