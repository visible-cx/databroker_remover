export const sendPostRequest = async (url: string, data: any) => {
  const response = await fetch(
    `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/${url}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }
  )
  return response.json()
}
