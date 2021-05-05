import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AngularMaterial } from "../angular-material.module";
import { AuthRoutingModule } from "./auth-routing.module";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";

@NgModule({
  declarations: [
    SignupComponent,
    LoginComponent,
  ],
  imports: [
    CommonModule,
    AngularMaterial,
    FormsModule,
    AuthRoutingModule
  ]
})
export class AuthModule {}
