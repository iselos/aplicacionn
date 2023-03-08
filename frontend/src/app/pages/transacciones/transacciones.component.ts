import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { TrasnsaccionesInterface } from 'src/app/models/transacciones';
import { UserInterface } from 'src/app/models/users';
import { UserService } from 'src/app/services/account/user.service';
import { TransactionsService } from 'src/app/services/transaction/transactions.service';

import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-transacciones',
  templateUrl: './transacciones.component.html',
  styleUrls: ['./transacciones.component.css']
})
export class TransaccionesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'origen', 'destino', 'cantidad', 'fecha_realizada'];

  snackBarHorizontal: MatSnackBarHorizontalPosition = 'center';
  snackBarVertical: MatSnackBarVerticalPosition = 'bottom';

  transacciones: TrasnsaccionesInterface[] = [];
  opcion: string = "";

  // DATOS DEl USER PARA USARLO COMO ORIGEN
  username = localStorage.getItem('username');
  userTransaction: UserInterface[] = [];

  // DATOS DE LOS USER PARA USARLOS COMO ORIGEN Y DESTINO
  usersTransaction: UserInterface[] = [];

  formTransaccion!: FormGroup;

  constructor(private transactionService: TransactionsService, private userService: UserService, private fb: FormBuilder, private route: ActivatedRoute, private snackBar: MatSnackBar) {
    this.route.queryParams.subscribe(_params => {
      this.opcion = _params['op'];
    });

    this.formTransaccion = this.fb.group({
      id: [''],
      origen: [''],
      destino: [''],
      cantidad: ['']
    });

    this.userService.getUsers().subscribe(res => {
      this.usersTransaction = res.result;
      this.usersTransaction.some(user => {
        if (this.username == user.username) {
          this.userTransaction.push(user);
        }
      });
    });
  }

  ngOnInit(): void {
    if (this.opcion == "1") {
      this.getTransacciones();
    }
  }

  getTransacciones() {
    this.transactionService.getTransaction().subscribe(res => {
      this.transacciones = res.result;
    });
  }

  nuevaTrasaccion(transaccion: TrasnsaccionesInterface) {
    this.transactionService.newTrasaction(transaccion).subscribe({
      next: () => {
        const saldoCuenta = Number(this.userTransaction[0].saldo) - transaccion.cantidad;

        this.userTransaction[0].saldo = saldoCuenta.toString();

        console.log(this.userTransaction);
    
        this.userService.updateUser(this.userTransaction[0].id, this.userTransaction[0]).subscribe(() => {
          this.snackBar.open("Transacción realizada correctamente", 'Ver comprobante', {
            duration: 12000,
            horizontalPosition: this.snackBarHorizontal,
            verticalPosition: this.snackBarVertical,
            panelClass: ['back-color']
          }).onAction().subscribe(() => { this.createPDF(transaccion) });
        });
        
      },
      error: (err) => {
        console.log(err);
        this.snackBar.open("Algo salio mal y no se pudo realizar la transacción", "Probar denuevo", {
          horizontalPosition: this.snackBarHorizontal,
          verticalPosition: this.snackBarVertical,
          panelClass: ['back-color']
        });
      }
    });
  }

  createPDF(trasaccion: TrasnsaccionesInterface) {
    const docDefinition: any = {
      info: {
        title: 'comprobante.pdf'
      },
      content: [
        { text: "Banco BNPM", style: "header" },
        { text: "Comprobante de Transacción", style: "subheader" },
        {
          columns: [
            [
              {
                text: `Cuenta de Origen: ${trasaccion.origen}`,
                bold: true,
                margin: [0, 40, 0, 20]
              },
              {
                text: `Cuenta de Destino: ${trasaccion.destino}`,
                bold: true,
                margin: [0, 0, 0, 20]
              },
              {
                text: `Monto: $${trasaccion.cantidad.toLocaleString()}`,
                bold: true,
                margin: [0, 0, 0, 20]
              }
            ],
            [
              {
                text: `Fecha: ${new Date().toLocaleString()}`,
                alignment: 'right',
                margin: [0, 40, 0, 20]
              },
              {
                text: `Comprobante No : ${((Math.random() * 1000).toFixed(0))}`,
                alignment: 'right'
              }
            ],
          ]
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: 'start',
          color: '#047886',
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 16,
          bold: true,
          alignment: 'center',
          margin: [0, 10, 0, 5]
        }
      }
    };

    pdfMake.createPdf(docDefinition).open();
  }

  getTransaccionId(id: number) {
    this.transactionService.getTransactionId(id).subscribe(res => {
      if (res.result.length < 1) {
        this.snackBar.open("No existe una transacción con el id: " + id, undefined, {
          duration: 5000,
          horizontalPosition: this.snackBarHorizontal,
          verticalPosition: this.snackBarVertical,
          panelClass: ['back-color']
        });
      } else {
        this.transacciones = res.result;
      }
    });
  }
}