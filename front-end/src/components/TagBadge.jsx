import { TAG_LABELS } from '../data/tags'

export function TagBadge({ tag }) {
  return (
    <span className={`tag-badge tag-badge--${tag}`}>
      {TAG_LABELS[tag] ?? tag}
    </span>
  )
}
