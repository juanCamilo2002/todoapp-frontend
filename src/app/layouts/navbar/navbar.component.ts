import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../../modules/auth/services/auth.service';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';

@Component({
  selector: 'app-navbar',
  imports: [MatToolbarModule, MatButtonModule, MatMenuModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  logout() {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }
}
