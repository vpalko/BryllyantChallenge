import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './components/main/main.component';
import { TextMaskModule } from 'angular2-text-mask';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Constants } from './shared/constants';
import { HeaderComponent } from './components/layout/header/header.component';
import { AboutComponent } from './components/pages/about/about.component';
import { LoginComponent } from './components/login/login.component';
import { UserService } from './services/user.service';
import { AppRoutesGuardService } from './services/app-routes-guard.service';
import { PollsComponent } from './components/polls/polls.component';
import { PollItemComponent } from './components/poll-item/poll-item.component';
import { AddPollComponent } from './components/add-poll/add-poll.component';
import { QuestionsComponent } from './components/questions/questions.component';
import { PollQuestionsComponent } from './components/poll-questions/poll-questions.component';
import { AddPollQuestionComponent } from './components/add-poll-question/add-poll-question.component';
import { VoteComponent } from './components/vote/vote.component';
import { AppPasswordDirective } from './shared/app-password.directive';
import { PollReportComponent } from './components/poll-report/poll-report.component';
import { Report1Component } from './components/poll-report/reports/report1/report1.component';
import { Report2Component } from './components/poll-report/reports/report2/report2.component';
import { Report3Component } from './components/poll-report/reports/report3/report3.component';
import { Report4Component } from './components/poll-report/reports/report4/report4.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    HeaderComponent,
    AboutComponent,
    LoginComponent,
    PollsComponent,
    PollItemComponent,
    AddPollComponent,
    QuestionsComponent,
    PollQuestionsComponent,
    AddPollQuestionComponent,
    VoteComponent,
    AppPasswordDirective,
    PollReportComponent,
    Report1Component,
    Report2Component,
    Report3Component,
    Report4Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TextMaskModule,
    HttpClientModule
  ],
  exports:   [ AppPasswordDirective ],
  providers: [Constants, UserService, AppRoutesGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
