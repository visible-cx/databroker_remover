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
      <h2 class="text-2xl my-5 font-bold">Step 1</h2>
      <form onSubmit={handleVerifyCode} class="grid justify-center gap-2">
        <label for="code">
          Enter the verification code that was emailed to you.
        </label>
        <input
          id="code"
          type="text"
          class="bg-slate-100 rounded-md p-2 text-center"
          placeholder="Your verification code"
        />
        <button class="bg-blue-500 text-white rounded-md p-2" type="submit">
          Verify email
        </button>
        <p class="text-sm">
          We don't store any readable information, only a hashed version of your
          email to prevent spamming the data brokers.
        </p>
      </form>
    </div>
  )
}
