export interface LoginFormProp {
  email: string;
  password: string;
  rememberMe: boolean;
  callbackURL: string;
}

export interface SignupFormProp {
  username: string;
  name: string;
  surname: string;
  password: string;
  rememberMe: boolean;
}
