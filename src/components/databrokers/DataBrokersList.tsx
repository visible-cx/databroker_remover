import { createSignal, For } from 'solid-js'
import { Collapse } from 'solid-collapse'
import ChevronIcon from './ChevronIcon'
import { Divider } from '../Divider'

const dataBrokerList = [
  {
    description:
      'Connected to over 180 Supply platforms across all media formats, BidSwitch listens to the entire global programmatic bidstream processing, filtering for fraud & classifying it-- layering on data and other services, then intelligently distributing it to relevant buyers across more than 220 Demand Side Technology platforms – all in real-time.',
    tags: ['Contact Info', 'Career Info', 'Browsing Habits', 'Purchases'],
    company: 'BidSwitch'
  }
]

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
