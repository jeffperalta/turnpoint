export class Funding {
  id: number;
  name: string;
  fullName: string;
  description: string;
  eligibilityResult: boolean; 
  eligibilityMessage: string; 

  constructor(json?: any) {
    this.id = json?.id ?? '';
    this.name = json?.name ?? '';
    this.fullName = json?.fullName ?? '';
    this.description = json?.description ?? '';

    this.eligibilityResult = json?.eligibilityResult == "valid";
    this.eligibilityMessage = json?.eligibilityMessage ?? "";
  }

  static deserialize(json: any){
    return new Funding(json);
  }

  serialize() {
    return {
      id: this.id,
      name: this.name,
      //fullName: this.fullName
    }
  }
}