import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs';
import { auth, User } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: User;

  constructor(private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe(user => {
      this.user = user;
    });
  }

  get currentUser(): User | null {
    return this.user;
  }

  getUser(): Observable<User | null> {
    return this.afAuth.user;
  }

  login(): void {
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  logout(): void {
    this.afAuth.auth.signOut();
  }
}
