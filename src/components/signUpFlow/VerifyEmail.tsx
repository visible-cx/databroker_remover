import { sendPostRequest } from '~/lib/utils'

export default function VerifyEmail({ setStage, setError, email }) {
  const handleVerifyCode = async (event) => {
    event.preventDefault()
    const code = event.target.code.value
    const response = await sendPostRequest('verifyCode', {
      code,
      email
    })
    if (response.success) {
      setStage(2)
      setError('')
    } else {
      setError(response.error)
    }
  }

  return (
    <div>
      <form onSubmit={handleVerifyCode} class="grid justify-center gap-2">
        <label for="code">Enter the 2FA code that was emailed to you</label>
        <input
          id="code"
          type="text"
          class="bg-slate-100 rounded-md p-2"
          placeholder="Enter emailed code"
        />
        <button class="bg-blue-500 text-white rounded-md p-2" type="submit">
          Verify Email
        </button>
      </form>
    </div>
  )
}
