import styles from './Header.module.css';

function Header() {
  return (
    <header class={styles.header}>
      <h1 class={styles.title}>E-INK SNS</h1>
      <nav class={styles.nav}>
        <span>[Home]</span>
        <span>[Profile]</span>
        <span>[Settings]</span>
      </nav>
    </header>
  );
}

export default Header;
