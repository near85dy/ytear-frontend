import { API_URL } from "../../../app/env";
import type { LoginForm, SignupForm } from "../model/types";

export async function authLogin(form: LoginForm)
{
    const response = await fetch(`${API_URL}/auth/sign-in/email`, {headers: {"Content-Type": "application/json"}, method: "POST", body: JSON.stringify(form), credentials: 'include'});
    const json = await response.json();
    return json;
}

export async function authSignup(form: SignupForm)
{
    const response = await fetch(`${API_URL}/auth/sign-up/email`, {headers: {"Content-Type": "application/json"}, method: "POST", body: JSON.stringify(form), credentials: 'include'});
    return response;
}