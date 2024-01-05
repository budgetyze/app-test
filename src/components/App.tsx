import type { JSXElement } from 'solid-js';

import { useState } from '../contexts/State';
import { initialize } from '../db';

interface Props {
  children: JSXElement,
}

const App = (props: Props) => {
  console.log('=== APP');
  const {
    setCategories,
    setTransactions,
  } = useState();

  initialize({
    setCategories,
    setTransactions,
  });

  return props.children;
};

export default App;
