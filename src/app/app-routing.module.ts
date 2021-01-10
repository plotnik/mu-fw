import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TagsComponent } from './tags/tags.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'home/:d', component: HomeComponent },
  { path: 'tags', component: TagsComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
