import { createElement, Fragment } from 'rax';
import styles from './index.module.css';
import Header from './components/Header';

interface ComponentProps {
  /** Title for ExampleRaxComponent. */
  title: string;
}

export default function ExampleRaxComponent(props: ComponentProps) {
  const { title = 'Hello World!' } = props;

  return (
    <div className={styles.ExampleRaxComponent}>
      <Header />
      {title}
      <>xxxxxxxx</>
      <div x-if={true}>admin</div>
      <div x-else>guest</div>
    </div>
  );
}
