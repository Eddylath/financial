import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Injectable({
    providedIn: 'root'
})
export class SnackBarService {
    currentSnackbarRef: MatSnackBarRef<TextOnlySnackBar> | null = null;
  
    constructor(
        private _snackBar: MatSnackBar,
    ) { }

    alignSnackBar(message: string): void {
        if(!this.currentSnackbarRef) {
            this.openSnackBar(message);
        }
        else {
            this.currentSnackbarRef
                .afterDismissed()
                .pipe(untilDestroyed(this))
                .subscribe(() => {
                    this.openSnackBar(message);
            });
        }
    }

    openSnackBar(message: string): void {
        this.currentSnackbarRef = this._snackBar.open(message, '', {
            duration: 2000,
        });
          
        this.currentSnackbarRef
            .afterDismissed()
            .pipe(untilDestroyed(this))
            .subscribe(() => {
                this.currentSnackbarRef = null;
        });
    }
}
