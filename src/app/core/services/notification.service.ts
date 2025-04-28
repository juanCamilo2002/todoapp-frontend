import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from "@angular/material/snack-bar"

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private snackBar = inject(MatSnackBar);

  showError(message: string, duration = 4000): void{
    this.snackBar.open(message, 'Cerrar', {
      duration,
      panelClass: ['snackbar-error'],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    })
  }

  showSuccess(message: string, duration = 3000): void {
    this.snackBar.open(message, 'Cerrar', {
      duration,
      panelClass: ['snackbar-success'],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }
}
