import { Funding } from "./Funding";
import { getLanguage } from "../utility/LangUtil";
import { format } from 'date-fns';
import * as Yup from 'yup';

export const SchemaGroups = { All: '*', Basic: 'basic', Funding: 'funding' } as const;
type SchemaGroup = typeof SchemaGroups[keyof typeof SchemaGroups];

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

  static validationSchema(groupName: SchemaGroup = SchemaGroups.All) {
    const schemas = {
      name: Yup.string().trim().min(2, 'Too short').required('Name is required'),
      identification: Yup.string().trim().required('Identification is required'),
      dob: Yup.date().max(new Date(), 'DOB must be in the past').required('Date of Birth is required'),
      main_language: Yup.string().trim().required('Main Language is required'),
      secondary_language: Yup.string().trim()
      .test(
        "different-secondary-language",
        "Secondary language must be different from main language",
        function (value) {
          const { main_language } = this.parent;
          if (!value) return true; // allow empty
          return value !== main_language;
        }
      ),
      funding_source_id: Yup.number().nullable(), //.required('Funding Source is required'),
      funding_eligibility: Yup.string().test(
        "eligibility-check",
        'Must be eligible for the funding source',
        value => !value || value.toLowerCase() === "valid"
      )
    }

    switch(groupName) {
      case SchemaGroups.All:
        return schemas;
      
      case SchemaGroups.Basic:
        return Object.fromEntries(
          Object.entries(schemas).filter(([key]) =>
            [
              "name", 
              "identification", 
              "dob", 
              "main_language", 
              "secondary_language"
            ].includes(key)
          )
        )

      case SchemaGroups.Funding:
        return Object.fromEntries(
          Object.entries(schemas).filter(([key]) =>
            [
              "funding_source_id", 
              "funding_eligibility", 
            ].includes(key)
          )
        )
      default:
        return schemas;
    }
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
      funding_source_id: this.funding_source_id ? this.funding_source_id : null
    }
  }
}