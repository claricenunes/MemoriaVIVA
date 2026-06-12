interface SectionTitleProps {
  title: string
  action?: string
  actionHref?: string
}

export default function SectionTitle({ title, action, actionHref }: SectionTitleProps) {
  return (
    <div className="mv-section-title">
      <span>{title}</span>
      {action && (
        actionHref
          ? <a href={actionHref} className="mv-section-action" style={{ textDecoration: 'none' }}>{action}</a>
          : <span className="mv-section-action">{action}</span>
      )}
    </div>
  )
}
