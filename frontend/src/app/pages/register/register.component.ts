import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserInterface } from 'src/app/models/users';
import { UserService } from 'src/app/services/account/user.service';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  snackBarHorizontal: MatSnackBarHorizontalPosition = 'center';
  snackBarVertical: MatSnackBarVerticalPosition = 'top';

  hide: boolean = true;

  formRegister!: FormGroup;
  user: UserInterface[] = [];


  constructor(private registerService: UserService, private fb: FormBuilder, private router: Router, private snackBar: MatSnackBar) { 
    this.formRegister = this.fb.group({
      username: ['', Validators.required],
      first_name: [''],
      last_name: [''],
      groups: ['cliente', Validators.required],
      email: [''],
      password: ['', Validators.required],
      user_permissions: ['usuario', Validators.required],
      is_staff: ['false', Validators.required],
      is_root: ['false', Validators.required]
    });
  }

  ngOnInit(): void {}

  register(user: UserInterface) {
    this.registerService.addUser(user).subscribe({
      next: () => {
        this.snackBar.open("Usuario " + user.username + " registrado correctamente, por favor inicie sesión", undefined, {
          duration: 5500,
          horizontalPosition: this.snackBarHorizontal,
          verticalPosition: this.snackBarVertical,
          panelClass: ['back-color']
        });

        this.router.navigate(['/']);

      }, error: (err) => {
        console.log(err);

        this.snackBar.open("Algo salio mal y no se pudo registrar el usuario", "Probar denuevo", {
          horizontalPosition: this.snackBarHorizontal,
          verticalPosition: this.snackBarVertical,
          panelClass: ['back-color']
        });
      }
    });
  }
}
