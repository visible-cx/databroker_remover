import { sendPostRequest } from '~/lib/utils'

export default function EmailInput({ setStage, setError, setEmail }) {
  const handleRequestCode = async (event) => {
    event.preventDefault()
    const email = event.target.email.value
    if (!email) {
      setError('Please enter an email address')
      return
    }
    const response = await sendPostRequest('sendCode', {
      email
    })
    if (response.success) {
      setEmail(email)
      setStage(1)
      setError('')
    } else {
      setError(response.error)
    }
  }

  return (
    <div>
      <h2 class="text-2xl my-5 font-bold">Step 1</h2>
      <form onSubmit={handleRequestCode} class="grid justify-center gap-2">
        <label for="email">
          Enter your email address to receive a 2FA code
        </label>
        <input
          id="email"
          size="30"
          type="email"
          class="bg-slate-100 rounded-md p-2 text-center"
          placeholder="Your email address"
        />
        <button class="bg-blue-500 text-white rounded-md p-2" type="submit">
          Send Verification Code
        </button>
        <p class="text-sm">
          We don't store any readable information, only a hashed version of your
          email to prevent spamming the data brokers.
        </p>
      </form>
    </div>
  )
}
