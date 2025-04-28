import { Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";

export const authRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'login',
                title: 'Iniciar sesión',
                component: LoginComponent
            },
            {
                path: 'register',
                title: 'Crear cuenta',
                component: RegisterComponent
            },
            {
                path: 'forgot-password',
                title: 'Recuperar contraseña',
                component: ForgotPasswordComponent
            },
            {
                path: 'reset-password',
                title: 'Restablecer contraseña',
                component: ResetPasswordComponent
            }
        ]
    }
];