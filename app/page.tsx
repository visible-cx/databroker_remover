import { DataBrokerWizard } from '@/components/data-broker-remover/DataBrokerWizard';
import { DataBrokerInfo } from '@/components/data-broker-remover/DataBrokerInfo';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#2E2A44] py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-warmgray">
            Data Broker
            <br />
            Remover Tool
          </h1>
          <p className="text-lg text-warmgray/80 max-w-3xl mx-auto">
            A data broker crawls the internet for information and buys it from
            companies whose services you use. The broker then bundles it up for
            their own use, or sells it to 3rd parties. The third parties can then
            use the information collected how they like.
          </p>
          <p className="text-xl text-warmgray/90 font-medium">
            This tool generates and sends emails to Data Brokers in order to get
            them to remove you from their databases
          </p>
        </div>

        {/* Wizard */}
        <DataBrokerWizard />

        {/* FAQ Section */}
        <div className="pt-8">
          <DataBrokerInfo />
        </div>
      </div>
    </div>
  );
}
