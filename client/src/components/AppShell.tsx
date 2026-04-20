import type { PropsWithChildren } from 'react'

import styles from './AppShell.module.css'

export const AppShell = ({ children }: PropsWithChildren) => (
  <main className={styles.shell}>
    <section className={styles.panel}>{children}</section>
  </main>
)
