import { createSignal, For } from 'solid-js'
import { Collapse } from 'solid-collapse'
import ChevronIcon from './ChevronIcon'
import { Divider } from '../Divider'

const temp = ["BidSwitch", "VUUKLE", "Bookyourdata", "Censia", "Cowen", "Diligent", "EproDirect", "Fetcher", "FourLeafDatra", "Growbots", "Intalytics", "Liveintent", "MaxMind", "PacificEast", "PitchBook", "PubMatric", "PushHint", "RecruitBot", "RocketReach", "SalesIntel", "SwordFish", "Tech target", "UpLead", "VenPath", "W20", "Yansi", "Abalta", "Exactag", "Ermes", "adsquare", "Cint", "Confiant", "AdDefend", "Fifty", "AdElement", "Arkeero", "GfK", "Smartology", "GADSME", "Sonobi", "Shopalyst", "Alesco", "Milestone Marketing Solutions", "Sync.me", "FullContact", "Smart Traffik", "MediaSoft", "Optimal Fusion", "Spokeo", "Entelo", "Dice", "Comscore", "Findmypast", "True Influence", "Cybba", "Bliss Point Media", "Connext Digital", "ID5", "IntentMacro", "Pop Acta Media"]

const dataBrokerList = temp.sort().map((company) => { return {description: "", tags: [], company} })

const DataBrokerList = () => {
  const [areOpen, setAreOpen] = createSignal(dataBrokerList.map(() => false))

  const handleOpen = (targetIndex) => {
    const copyArr = [...areOpen()]
    copyArr[targetIndex] = !areOpen()[targetIndex]
    setAreOpen(copyArr)
  }

  return (
    <article class="container mx-auto px-4">
      <h2 class="text-2xl">
        This is the current list of data brokers that will be contacted:
      </h2>
      <For each={dataBrokerList}>
        {({ company, description, tags }, index) => (
          <section class="border-solid border rounded-md w-full container mx-auto px-4">
            <button
              class="text-lg font-bold flex items-center justify-between w-full text-black m-0 cursor-pointer py-4"
              id={`example_2_btn_${index()}`}
              aria-controls={`example_2_clps_${index()}`}
              aria-expanded={areOpen()[index()]}
              type="button"
              onClick={() => handleOpen(index())}
            >
              {company}
              <span
                class={`bg-slate-200 border-2 ${
                  areOpen()[index()] ? 'rotate-90' : ''
                }`}
              >
                <ChevronIcon />
              </span>
            </button>
            <Collapse
              value={areOpen()[index()]}
              aria-labelledby={`example_2_btn_${index()}`}
              id={`example_2_clps_${index()}`}
              role="region"
              // class={styles.fastCollapseTransition}
            >
              <p>{description}</p>
              <Divider verticalPadding={`my-4`} />
              <div class="flex gap-3 mb-4">
                {tags.map((tag: string) => {
                  return <div class="bg-slate-200 rounded-md p-1">{tag}</div>
                })}
              </div>
            </Collapse>
          </section>
        )}
      </For>
    </article>
  )
}

export default DataBrokerList
