import { createSignal } from 'solid-js'
import { sendPostRequest } from '~/lib/utils'

function SendEmail({ setStage, setError, details }) {
  const { name, street, city, country, postcode, email } = details
  const [sending, setSending] = createSignal(false)

  const handleSendEmail = async (event) => {
    setSending(true)
    event.preventDefault()
    const response = await sendPostRequest('sendEmail', {
      email,
      details
    })
    if (response.success) {
      setStage(4)
      setError('')
    } else {
      setError(response.error)
      setSending(false)
    }
  }
  return (
    <div>
      <h1 class="text-xl font-bold mb-4">
        This is the email content, the company name will be replaced dynamically
        for you. When ready just hit the send email button.
      </h1>
      <div class="grid grid-cols-1">
        <div class="border-2 p-2">
          <article>
            <p dir="ltr">Dear $companyName,</p>
            <br />
            <p dir="ltr">
              I am submitting a request for implementation of the following
              rights under Section 1798.105 of CCPA, Articles 7(3), 17 and 21 of
              GDPR and other applicable privacy legislation which grant
              individuals certain rights in relation to protection of their
              personal data information:
            </p>
            <p dir="ltr">
              1) To obtain erasure (deletion) of personal data (information)
              without undue delay;
              <br />
              2) To withdraw any consent given to the processing of personal
              data (information);
              <br />
              3) To object to processing of personal data (information)
              concerning the below individual, including but not limited to
              profiling and direct marketing.
            </p>
            <br />
            <p dir="ltr">I can be identified by my details below:</p>
            <br />
            <p dir="ltr">
              <strong>Name: </strong>
              {name}
              <br />
              <strong>Address: </strong>
              {street}, {city}, {country}, {postcode}
              <br />
              <strong>E-mail address: </strong>
              {email}
            </p>
            <br />
            <p dir="ltr">
              Please confirm your compliance with the request without undue
              delay and in any event within 45 (forty five) days of receipt of
              this request.
            </p>
            <br />
            <p dir="ltr">Thank you.</p>
            <p dir="ltr">
              {name}
              <br />
              <br />
            </p>
          </article>
        </div>
        <div class="flex mt-4">
          <button
            class="bg-blue-500 text-white rounded-md p-5 m-auto min-w-[3rem]"
            onClick={() => setStage(2)}
          >
            Change Info
          </button>
          <button
            class="bg-blue-500 text-white rounded-md p-5 m-auto min-w-[3rem] disabled:bg-gray-300"
            onClick={(event) => handleSendEmail(event)}
            disabled={sending()}
          >
            Send email
          </button>
        </div>
      </div>
    </div>
  )
}
export default SendEmail
