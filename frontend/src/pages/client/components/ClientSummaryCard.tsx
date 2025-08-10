import { Client } from "../../../models/Client";
import './ClientSummaryCard.css';
import { getLanguage } from "../../../utility/LangUtil";

type ClientSummaryCardProps = {
  client: Client,
  fundings: {
    id: Number,
    name: String
  }[],
}

export default function ClientSummaryCard({
  client,
  fundings,
  ...props
}: ClientSummaryCardProps) {
  console.log(">>>CLIENT", client, fundings);
  const funding = fundings?.find(f => f.id == client.funding_source_id);

  return (
    <div className="client-summary-card--container">
      <h3 style={{ marginTop: 0 }}>Summary</h3>
      <dl>
        <dt>Identification</dt>
        <dd>{ client.identification || '-' }</dd>
        <dt>Name</dt>
        <dd>{ client.name || '-' }</dd>
        <dt>Date of Birth</dt>
        <dd>{ client.dob || '-' }</dd>
        <dt>Main Language</dt>
        <dd>{ getLanguage(client.main_language) || '-' }</dd>
        <dt>Secondary Language</dt>
        <dd>{ getLanguage(client.secondary_language) || '-' }</dd>
        <dt>Funding Source</dt>
        <dd>{ funding?.name || '-' }</dd>
      </dl>
    </div>
  )
}