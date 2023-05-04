import './index.css'
import { Header } from '~/components/Header'
import SignUpWrapper from '~/components/signUpFlow/signUpWrapper'
import { Collapse } from 'solid-collapse'
import ChevronIcon from '~/components/ChevronIcon'
import { createSignal, Index } from 'solid-js'

export default function Home() {
  const [isExpanded, setIsExpanded] = createSignal(false)

  const data = [
    {
      title: 'HOW DOES IT WORK?',
      answer: `<ul class="ml-5 list-decimal">
        <li>Enter your email address</li>
        <li>We'll send you a verification code</li>
        <li>
          Once you confirm the code, you can input your name & address to
          generate the email to send to the broker. We do not store your name or address, it is only used to generate the email.
        </li>
        <li>We send the emails out. You will be CC'd on them so you can see them, you don't need to take any action.</li>
        <li>
          Only your email address is stored once it has been hashed (SHA256), and is deleted after 45
          days. This is to ensure you don't send out multiple emails within a short period of time. You're free to repeat the process after 45 days.
        </li>
      </ul>
      <br/>
      <p>See the source code <a target="_blank" class="font-bold" href="https://github.com/visible-cx/databroker_remover">here</a>. The privacy policy for this tool can be found <a class="font-bold" href="/privacy" target="_blank">here </a></p>`
    },
    {
      title: 'WHO ARE THE DATA BROKERS?',
      answer: ''
    },
    {
      title: 'WHO BUILT THIS?',
      answer: `<p>This tool was built by the team at Visible.</p><p>If you'd like to see more of what we do, please consider joining the community <a href="https://www.visible.cx/join" target="_blank" class="font-bold">here</a>.</p>`
    }
  ]

  const brokers = [
    'BidSwitch',
    'VUUKLE',
    'Bookyourdata',
    'Censia',
    'Cowen',
    'Diligent',
    'EproDirect',
    'Fetcher',
    'FourLeafDatra',
    'Growbots',
    'Intalytics',
    'Liveintent',
    'MaxMind',
    'PacificEast',
    'PitchBook',
    'PubMatric',
    'PushHint',
    'RecruitBot',
    'RocketReach',
    'SalesIntel',
    'SwordFish',
    'Tech target',
    'UpLead',
    'VenPath',
    'W20',
    'Yansi',
    'Abalta',
    'Exactag',
    'Ermes',
    'Adsquare',
    'Cint',
    'Confiant',
    'AdDefend',
    'Fifty',
    'AdElement',
    'Arkeero',
    'GfK',
    'Smartology',
    'GADSME',
    'Sonobi',
    'Shopalyst',
    'Alesco',
    'Milestone Marketing Solutions',
    'Sync.me',
    'FullContact',
    'Smart Traffik',
    'MediaSoft',
    'Optimal Fusion',
    'Spokeo',
    'Entelo',
    'Dice',
    'Comscore',
    'Findmypast',
    'True Influence',
    'Cybba',
    'Bliss Point Media',
    'Connext Digital',
    'ID5',
    'IntentMacro',
    'Pop Acta Media'
  ]
  const brokersList = brokers.sort().map((company) => {
    return '<li>' + company + '</li>'
  })

  data[1].answer =
    `<p>This is the current list of data brokers that will be contacted:</p>
    <ul class="ml-5 list-disc">` +
    brokersList.join('') +
    `</ul>`

  const [questions, setQuestions] = createSignal(
    data.map(({ title, answer }, index) => ({
      title,
      answer,
      isExpanded: false //index === 0,
    }))
  )

  function handleAccordion(clickedIndex: number) {
    setQuestions((questions) =>
      questions.map((question, index) => ({
        ...question,
        isExpanded:
          clickedIndex === index ? !questions[clickedIndex].isExpanded : false
      }))
    )
  }

  function getToggleAriaAttrs(index: number, isExpanded: boolean) {
    return {
      id: `accordion_btn_${index}`,
      'aria-controls': `region_${index}`,
      'aria-expanded': isExpanded
    }
  }

  function getCollapseAriaAttrs(index: number) {
    return {
      id: `region_${index}`,
      role: 'region',
      'aria-labelledby': `accordion_btn_${index}`
    }
  }

  return (
    <>
      <main class="mt-10">
        <div class="container mx-auto px-4 text-center mb-10">
          <Header />
          <h1 class="text-5xl mb-20 mt-20 font-bold">
            Data Broker
            <br />
            Remover Tool
          </h1>
          <p class="mt-5">
            A data broker crawls the internet for information and buys it from
            companies whose services you use. The broker then bundles it up for
            their own use, or sells it to 3rd parties. The third parties can
            then use the information collected how they like.
          </p>
          <img src="break.png" class="mt-10 mb-10 mx-auto" width="50px" />
          <p class="text-xl mb-20">
            This tool generates and sends emails to Data Brokers in order to get
            them to remove you from their databases{' '}
          </p>
          <SignUpWrapper />
        </div>
        <div class="section bg-sky-50">
          <div class="container mx-auto px-4 text-center p-5">
            <Index each={questions()}>
              {(q, index) => (
                <section class="CollapseContainer mb-2 mt-2">
                  <button
                    class={`CollapseHeader ${
                      !q().isExpanded ? 'CollapseHeaderActive' : ''
                    }`}
                    onClick={() => handleAccordion(index)}
                    {...getToggleAriaAttrs(index, q().isExpanded)}
                  >
                    {q().title}
                    <span
                      class={`ChevronButton ${
                        q().isExpanded ? 'ActiveChevron' : ''
                      }`}
                    >
                      <ChevronIcon />
                    </span>
                  </button>
                  <Collapse
                    value={q().isExpanded}
                    class="CollapseTransition"
                    {...getCollapseAriaAttrs(index)}
                  >
                    <div class="CollapseContent" innerHTML={q().answer}></div>
                  </Collapse>
                </section>
              )}
            </Index>
          </div>
        </div>
      </main>
    </>
  )
}
