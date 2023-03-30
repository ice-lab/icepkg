import logo from '@/assets/logo.png';
import styles from './index.module.css';
import { Button } from 'example-pkg-react-component';

export default function Home() {
  return (
    <div className={styles.app}>
      <header>
        <img src={logo} alt="logo" />
        <p>
          Hello ice.js 3
        </p>
      </header>
      <main>
        <Button>Normal Button</Button>
      </main>
    </div>
  );
}
