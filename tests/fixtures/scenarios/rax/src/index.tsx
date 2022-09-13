import { createElement } from 'rax';
import styles from './index.module.css';

interface ComponentProps {
  /** Title for Rax. */
  title: string;
}

export default function Rax(props: ComponentProps) {
  const { title = 'Hello World!' } = props;

  return (
    <div className={styles.Rax}>{title}</div>
  );
}
