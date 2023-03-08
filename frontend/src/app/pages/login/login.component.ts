import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  snackBarHorizontal: MatSnackBarHorizontalPosition = 'center';
  snackBarVertical: MatSnackBarVerticalPosition = 'bottom';

  hide: boolean = true;

  formLogin!: FormGroup;

  private _token!: string;

  constructor(private loginService: AuthService, private fb: FormBuilder, private router: Router, private snackBar: MatSnackBar) {
    this.formLogin = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void { }

  login(username: string, password: string) {

    this.loginService.login(username, password).subscribe({
      next: (res) => {
        localStorage.setItem('username', username);
        
        // guardado de token en localStorage
        this._token = res.token;
        localStorage.setItem("token", this._token);

        this.snackBar.open("Bienvenido " + username, undefined, {
          duration: 2500,
          horizontalPosition: this.snackBarHorizontal,
          verticalPosition: this.snackBarVertical,
          panelClass: ['back-color']
        });

        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.snackBar.open(`${err.error.msg}`, "Cerrar", {
          horizontalPosition: this.snackBarHorizontal,
          verticalPosition: this.snackBarVertical,
          panelClass: ['back-color-err']
        });
      }
    });
  }
}