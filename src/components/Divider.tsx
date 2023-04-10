export function Divider({ verticalPadding }) {
  return (
    <hr
      class={`h-2 border-t-0 bg-neutral-300 opacity-100 dark:opacity-50 ${verticalPadding}`}
    ></hr>
  )
}
