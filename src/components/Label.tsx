export function Label({ id, children }) {
  return (
    <label for={id} class="mb-3 block text-sm font-medium text-gray-700">
      {children}
    </label>
  )
}

export default Label
