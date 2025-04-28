import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
    {
        path: '',
        canActivate: [authGuard],
        component: MainLayoutComponent,
        // children: [
        //     {
        //         path: '',
        //         loadChildren: () => import("./modules/tasks/tasks.module").then(m => m.TasksModule)
        //     },
        //     {
        //         path: 'users',
        //         loadChildren: () => import("./modules/users/users.module").then(m => m.UsersModule)
        //     }
        // ]
    },
    {
        path: 'auth',
        canActivate: [guestGuard],
        loadChildren: () => import("./modules/auth/auth.routes").then(m => m.authRoutes)
    },
    { path: '**', redirectTo: '' } 
];
