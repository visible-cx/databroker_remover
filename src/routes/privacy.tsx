import './index.css'
import { Header } from '~/components/Header'

export default function Privacy() {
  return (
    <>
      <Header />
      <main class="mb-20">
        <div class="p-5">
          <h2 class="text-3xl mb-4 text-center">Privacy Policy</h2>
          <p class="text-right">Last updated 24th April 2023 </p>
          <br />
          <p>Visible does not store any information provided in plain text.</p>
          <br />
          <p>
            We do store a sha256 hash version of your email address, but this is
            not reversable by us. This is used to prevent multiple emails being
            sent to the same data broker within a short period of time.
          </p>
          <br />
          <p>
            If you do, at the end, click to receive updates from Visible then we
            will store your email address, the privacy policy for that is{' '}
            <strong>
              <a href="https://www.visible.cx/privacy-policy" target="_blank">
                here
              </a>
            </strong>
          </p>
          <br />
          <p>
            <strong>Contact Us</strong>
            <br />
            If you have questions about our Privacy Policy please contact us at
            privacy@visible.tech. Attn: Visible Privacy, Observable LTD , 77
            Farringdon Road, London, EC1M3JU, United Kingdom
          </p>
        </div>
      </main>
    </>
  )
}
