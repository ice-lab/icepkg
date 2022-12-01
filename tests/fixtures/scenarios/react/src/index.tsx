import * as React from 'react';
import styles from './index.module.css';

interface ComponentProps {
  /** Title for React. */
  title: string;
}

export default function React(props: ComponentProps) {
  const { title = 'Hello World!' } = props;

  return (
    <div className={styles.React}>{title}</div>
  );
}
