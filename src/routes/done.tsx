import './index.css'
import { Header } from '~/components/Header'

export default function Home() {

  return (
    <>
      <main class="mt-10">
      <div class="container mx-auto px-4 text-center mb-10">
          <Header />
          <h1 class="text-5xl mb-20 mt-20 font-bold">Done!</h1>
          <p class='mt-5'>Over the next few minutes we will progressively send emails to the databrokers saved in our database. You will also be cc'd on these emails - this is purely done for your own information, no follow up is expected from you.</p>
          <p class='mt-5'>You can repeat this after a minimum of 45 days (we recommend doing it no earlier than 90 days).</p>
          <img src="break.png" class="mt-10 mb-10 mx-auto" width="50px"/>
          <p class="text-xl mb-20">This was built by the team at Visible.</p>
          <p class="text-xl mb-20">If you'd like to see more of what we do, please consider joining the community below.</p>
        </div>
        <div class="section bg-sky-50">
        <div class="container mx-auto px-4 text-left p-5">
          <h1 class="text-3xl mb-20 mt-10 font-semibold ">See how you appear online, control your digital body language.</h1>
          <div class="grid md:grid-cols-3 gap-4">
            <div class="col-span-2">
              <p>Decisions are made everyday using your <strong>digital-self</strong>, changing your life without your knowledge.</p>
              <br/>
              <p><strong>Visible is building an app</strong> that will help you gain a true reflection of yourself in data, ensure that <strong>your online image reflects the version of you that you want to be seen.</strong></p>
              <br/>
              <ul>
                <li>Learn how algorithms [& people] see you,</li>
                <li>Understand the data driving decisions,</li>
                <li>Change your habits and behaviour.</li>
              </ul>
              <br/>
              <p>The be notified of updates and join the early access beta launch, join the community.</p>
            </div>
            <div class="">
              <div class="grid md:grid-cols-2 gap-1 justify-items-center ">
                <div class="col-span-2 max-w-xs"><img src="VisibleApp.png"></img></div>
                <div class="px-1 max-w-xs justify-self-end"><img src="GooglePlay.png" class="h-xs"/></div>
                <div class="px-1 max-w-xs justify-self-start"><img src="AppStore.png" class="h-xs"/></div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </main>
    </>
  )
}
