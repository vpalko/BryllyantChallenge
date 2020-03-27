import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { AboutComponent } from './components/pages/about/about.component';
import { LoginComponent } from './components/login/login.component';
import { PollsComponent } from './components/polls/polls.component';
import { QuestionsComponent } from './components/questions/questions.component';
import { AppRoutesGuardService } from './services/app-routes-guard.service';
import { VoteComponent } from './components/vote/vote.component';
import { PollReportComponent } from './components/poll-report/poll-report.component';

const routes: Routes = [
  { path: '', component: MainComponent, canActivate: [AppRoutesGuardService] },
  { path: 'about', component: AboutComponent },
  { path: 'login', component: LoginComponent },
  { path: 'polls', component: PollsComponent, canActivate: [AppRoutesGuardService] },
  { path: 'pollquestions/:id', component: QuestionsComponent, canActivate: [AppRoutesGuardService] },
  { path: 'pollreport/:id', component: PollReportComponent, canActivate: [AppRoutesGuardService] },
  { path: 'vote/:id', component: VoteComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AppRoutesGuardService]
})
export class AppRoutingModule { }
