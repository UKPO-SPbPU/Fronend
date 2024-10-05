export type FormType = { email: string } | { birthDate: string } | { passport: string };

export interface PasswordForm {
    oldPassword: string;
    newPassword: string;
    repeatedNewPassword: string;
}
