export interface UserDetails {
  name: string;
  street: string;
  city: string;
  country: string;
  postcode: string;
}

export interface DataBroker {
  name: string;
  email: string;
}

export interface SendCodeResponse {
  success: boolean;
  error?: string;
}

export interface VerifyCodeResponse {
  success: boolean;
  error?: string;
}

export interface SendEmailsResponse {
  success: boolean;
  error?: string;
}

export type WizardStep = 'email' | 'verify' | 'details' | 'review';
