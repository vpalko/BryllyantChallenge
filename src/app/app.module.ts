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
    PollQuestionsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TextMaskModule,
    HttpClientModule
  ],
  providers: [Constants, UserService, AppRoutesGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
