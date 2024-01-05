import type { Component } from 'solid-js';

import Navbar from './Navbar';

import styles from './Settings.module.css';

const Settings: Component = () => {
  console.log('=== Settings');

  return (
    <>
      <Navbar />
      <div class={styles.container}>
        Settings
      </div>
    </>
  );
};

export default Settings;
