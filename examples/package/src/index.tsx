import * as React from 'react';
import styles from './index.module.css';

interface ComponentProps {
  /** Title for PkgReactComponentExample. */
  title: string;
}

export default function PkgReactComponentExample(props: ComponentProps) {
  const { title = 'Hello World!' } = props;

  return (
    <div className={styles.PkgReactComponentExample}>{title}</div>
  );
}
