import styles from './StatusPanel.module.css'

interface StatusPanelProps {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export const StatusPanel = ({
  title,
  description,
  actionLabel,
  onAction,
}: StatusPanelProps) => (
  <section className={styles.panel}>
    <h2 className={styles.title}>{title}</h2>
    <p className={styles.description}>{description}</p>
    {actionLabel && onAction ? (
      <button className={styles.button} onClick={onAction} type="button">
        {actionLabel}
      </button>
    ) : null}
  </section>
)
