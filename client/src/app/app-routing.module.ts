import {RouterModule, Routes} from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {RegisterComponent} from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AuthGuard } from './guards/auth.guard';
import { notAuthGuard } from './guards/notAuth.guard';
import { BlogComponent } from './components/blog/blog.component';


const appRoutes: Routes =[
    {path: '', component: HomeComponent},
    {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
    {path: 'register', component: RegisterComponent, canActivate: [notAuthGuard]},
    {path: 'login', component: LoginComponent, canActivate: [notAuthGuard]},
    {path: 'profile', component: ProfileComponent,  canActivate: [AuthGuard]},
    {path: 'blog', component: BlogComponent, canActivate: [AuthGuard]},
    {path: '**', component: HomeComponent}
    
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forRoot(appRoutes)],
    providers: [],
    bootstrap: [],
    exports: [RouterModule]
  })


  export class AppRoutingModule { }
