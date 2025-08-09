import { Funding } from "./Funding";

export class Client {
  id: number;
  identification: string;
  name: string;
  dob: string;
  main_language: string;
  secondary_language: string;
  funding: Funding;

  funding_source_id: number;

  constructor(json?: any) {
    this.id = json?.id ?? '';
    this.identification = json?.identification ?? '';
    this.name = json?.name ?? '';
    this.dob = json?.date_of_birth ?? json?.dob;
    this.main_language = json?.main_language ?? '';
    this.secondary_language = json?.secondary_language ?? '';
    this.funding_source_id = json?.funding_source_id ?? null;
    this.funding = Funding.deserialize({
      id: this.funding_source_id,
      name: json?.funding_source_name ?? null
    })
  }

  static deserialize(json: any) {
    return new Client(json);
  }

  serialize() {
    return {
      identification: this.identification,
      name: this.name,
      date_of_birth: this.dob ? new Date(this.dob).toISOString().slice(0, 10) : null,
      main_language: this.main_language,
      secondary_language: this.secondary_language,
      funding_source_id: this.funding_source_id
    }
  }
}