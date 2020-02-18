import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    public afAuth: AngularFireAuth
    ) {
   }

   doRegister(value) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
      .then(res => {
        resolve(res);
      }, err => reject(err));
    });
  }

   doEmailLogin(credentials) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(credentials.username, credentials.password)
      .then(res => {
        resolve(res);
      }, err => reject(err));
      // .catch(function(error) {
      //   // Handle Errors here.
      //   var errorCode = error.code;
      //   var errorMessage = error.message;
      //   if (errorCode === 'auth/wrong-password') {
      //     alert('Wrong password.');
      //   } else {
      //     alert(errorMessage);
      //   }
      //   console.log(error);
      // });
    });
  }

   doGoogleLogin() {
    return new Promise<any>((resolve, reject) => {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      this.afAuth.auth.signInWithPopup(provider)
      .then(res => {
        resolve(res);
      }, err => reject(err));
    });
  }

  logout() {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signOut()
      .then(res => {
        resolve(res);
      }, err => reject(err));
    });
  }

}
