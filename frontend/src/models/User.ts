import * as Yup from 'yup';

export const SchemaGroups = { Login: 'login', registration: 'registration' } as const;
type SchemaGroup = typeof SchemaGroups[keyof typeof SchemaGroups];

export class User {
  id: string;
  email: string;
  password: string;

  constructor(json?: any) {
    this.id = json?.id ?? '';
    this.email = json?.email ?? '';
    this.password = json?.password ?? '';
  }

  static validationSchema(groupName: SchemaGroup = SchemaGroups.Login){
    switch(groupName) {
      case SchemaGroups.Login:
        return {
          email: Yup.string()
            .email('Enter a valid email')
            .required('Email is required'),
          password: Yup.string()
            .required('Password is required'),
        }

      default: 
        return {
          email: Yup.string()
            .email('Enter a valid email')
            .required('Email is required'),
          password: Yup.string()
            .required('Password is required'),
        }
    }
  }

  static deserialize(json: any){
    return new User(json);
  }

  serialize() {
    const result: { 
      email: string; 
      password: string; 
      id?: string 
    } = {
      email: this.email,
      password: this.password
    }

    if(this.id) {
      result['id'] = this.id;
    }

    return result;
  }
}