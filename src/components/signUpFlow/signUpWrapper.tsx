import { createSignal } from 'solid-js'
import EmailInput from './EmailInput'
import VerifyEmail from './VerifyEmail'
import GenerateEmail from './GenerateEmail'
import SendEmail from './SendEmailScreen'
import Done from './Done'

function SignUpWrapper() {
  const [stage, setStage] = createSignal(0)
  const [error, setError] = createSignal('')
  const [email, setEmail] = createSignal('')
  const [details, setDetails] = createSignal({})

  return (
    <section class="container mx-auto px-4">
      {error && <p class="text-red-700 font-bold">{error}</p>}
      {stage() === 0 && (
        <EmailInput
          setStage={setStage}
          setError={setError}
          setEmail={setEmail}
        />
      )}
      {stage() === 1 && (
        <VerifyEmail setStage={setStage} setError={setError} email={email()} />
      )}
      {stage() === 2 && (
        <GenerateEmail
          setStage={setStage}
          email={email()}
          setDetails={setDetails}
        />
      )}
      {stage() === 3 && (
        <SendEmail
          setStage={setStage}
          setError={setError}
          details={details()}
        />
      )}
      {stage() === 4 && <Done email={email()} />}
    </section>
  )
}

export default SignUpWrapper
