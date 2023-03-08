import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { UserInterface } from 'src/app/models/users';
import { UserService } from 'src/app/services/account/user.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  // displayedColumns: string[] = ['id', 'username', 'first_name', 'last_name', 'email', 'password', 'groups', 'user_permissions', 'is_staff', 'is_active', 'is_root', 'last_login', 'date_joined'];
  displayedColumns: string[] = ['id', 'username',  'first_name', 'last_name', 'email', 'groups', 'date_joined'];
  snackBarHorizontal: MatSnackBarHorizontalPosition = 'center';
  snackBarVertical: MatSnackBarVerticalPosition = 'top';

  usuarios: UserInterface[] = [];
  usuario: UserInterface[] = [];

  hide: boolean = true;

  opcion: string = "";

  formUser!: FormGroup;

  _token: any;
  router: any;

  constructor(private userService: UserService, private fb: FormBuilder, private route: ActivatedRoute, private snackBar: MatSnackBar) { 
    this.formUser = this.fb.group({
      id: [''],
      username: [''],
      first_name: [''],
      last_name: [''],
      groups: ['cliente'],
      email: [''],
      password: [''],
      user_permissions: ['usuario'],
      is_staff: ['false'],
      is_root: ['false']
    });
    
    this.route.queryParams.subscribe(_params => {
      this.opcion = _params['op'];
    });
  }

  ngOnInit(): void {
    if (this.opcion == "1") {
      this.getUsers();
    } 
  }

  getUsers() {
    this.userService.getUsers().subscribe(res => {
      this.usuarios = res.result;
    });
  }

  getUser(id: number) {
    this.userService.getUser(id, undefined).subscribe(res => {
      if (res.result.length < 1) {
        this.snackBar.open("No existe un usuario con el id: " + id, undefined, {
          duration: 6000,
          horizontalPosition: this.snackBarHorizontal,
          verticalPosition: this.snackBarVertical,
          panelClass: ['back-color']
        });
      } else {
        this.usuario = res.result;
      }
    });
  }

  addUser(user: UserInterface) {
    this.userService.addUser(user).subscribe({
      next: () => {
        this.snackBar.open("Usuario " + user.username + " registrado correctamente", undefined, {
          duration: 5500,
          horizontalPosition: this.snackBarHorizontal,
          verticalPosition: this.snackBarVertical,
          panelClass: ['back-color']
        });

        this.formUser.reset();

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

  updateUser(id: number, user: UserInterface) {
    this.userService.updateUser(id, user).subscribe({
      next: () => {
        this.snackBar.open("Usuario " + id + " actualizado correctamente", undefined, {
          duration: 4500,
          horizontalPosition: this.snackBarHorizontal,
          verticalPosition: this.snackBarVertical,
          panelClass: ['back-color']
        });

        this.formUser.reset();
        
      }, error: (err) => {

        console.log(err);

        this.snackBar.open("Algo salio mal y no se pudo actualizar el usuario", "Probar denuevo", {
          horizontalPosition: this.snackBarHorizontal,
          verticalPosition: this.snackBarVertical,
          panelClass: ['back-color']
        });
      }
    });
  }

  deleteUser(id: number) {
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.snackBar.open("Usuario " + id + " eliminado correctamente", undefined, {
          duration: 4500,
          horizontalPosition: this.snackBarHorizontal,
          verticalPosition: this.snackBarVertical,
          panelClass: ['back-color']
        });

        this.formUser.reset();
        
      }, error: (err) => {

        console.log(err);

        this.snackBar.open("Algo salio mal y no se pudo eliminar el usuario", "Probar denuevo", {
          horizontalPosition: this.snackBarHorizontal,
          verticalPosition: this.snackBarVertical,
          panelClass: ['back-color']
        });
      }
    });
  }
}
