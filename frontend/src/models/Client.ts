import { Funding } from "./Funding";
import { getLanguage } from "../utility/LangUtil";
import { format } from 'date-fns';

export class Client {
  id: number;
  identification: string;
  name: string;
  dob: string;
  main_language: string;      //2-letter code
  secondary_language: string; //2-letter code
  funding: Funding;

  funding_source_id: number;

  //--Computed properties--
  dob_display: string;
  main_language_display: string;
  secondary_language_display: string;
  

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
    });

    this.dob_display = this.dob ? format(new Date(this.dob), 'dd MMM yyyy') : "";
    this.main_language_display = getLanguage(this.main_language);
    this.secondary_language_display = getLanguage(this.secondary_language);
  
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