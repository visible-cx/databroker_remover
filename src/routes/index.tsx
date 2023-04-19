import './index.css'
import { Header } from '~/components/Header'
import DataBrokerList from '~/components/databrokers/DataBrokersList'
import { Divider } from '~/components/Divider'
import SignUpWrapper from '~/components/signUpFlow/signUpWrapper'

export default function Home() {
  return (
    <>
      <Header />
      <main class="mb-20">
        <div class="text-center p-5">
          <h2 class="text-3xl mb-4">Data Broker Remover Tool</h2>
          <p>
            This tool generates and sends emails to Data Brokers in order to get
            them to remove you from their databases{' '}
          </p>
          <p>It's provided without any guarantees or support</p>
          <p class='mt-5'>A data broker crawls the internet for information as well as buying it from companies whose services you use, the broker then bundles it up and uses it or sells it on to 3rd parties. The third parties can then use the information collected how they like.</p>
          <p>See the source code <a target="_blank" href="https://github.com/visible-cx/databroker_remover">here</a></p>
        </div>
        <Divider verticalPadding={`my-12`} />
        <SignUpWrapper />
        <Divider verticalPadding={`my-12`} />
        <div class="container mx-auto px-4">
          <h2 class="text-xl font-bold mb-4">How it works</h2>
          <ul>
            <li>1. Enter your email address</li>
            <li>2. We'll send you a verification code</li>
            <li>
              3. Once you confirm the code, you can input your name & address to
              generate the email to send to the broker. We do not store this
              information
            </li>
            <li>4. We send the emails out. You will be CC'd on them so you can see them, you don't need to take any action.</li>
            <li>
              5. Only your email address is stored, and is deleted after 45
              days. This is to ensure you don't send out multiple emails.
            </li>
          </ul>
        </div>
        <Divider verticalPadding={`my-12`} />
        <DataBrokerList />
      </main>
    </>
  )
}
