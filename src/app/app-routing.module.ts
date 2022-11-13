import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TagsComponent } from './tags/tags.component';
import { PatternComponent } from './pattern/pattern.component';
import { PatternsComponent } from './patterns/patterns.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'home/:d', component: HomeComponent },
  { path: 'tags', component: TagsComponent },
  { path: 'patterns', component: PatternsComponent },
  { path: 'pattern/:p', component: PatternComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
