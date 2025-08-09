export class Funding {
  id: number;
  name: string;

  constructor(json?: any) {
    this.id = json?.id ?? '';
    this.name = json?.name ?? '';
  }

  static deserialize(json: any){
    return new Funding(json);
  }

  serialize() {
    return {
      id: this.id,
      name: this.name
    }
  }
}