import { Component, OnInit } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { Post } from '../post';
import { PostService } from '../post.service';
import * as firebase from 'firebase';
import { AuthService } from '../../core/auth.service';
import { MatSnackBar } from '@angular/material';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-post-dashboard',
  templateUrl: './post-dashboard.component.html',
  styleUrls: ['./post-dashboard.component.css']
})
export class PostDashboardComponent implements OnInit {
  percentageChanges: Observable<number>;
  imageUrl: string;

  constructor(
    private postService: PostService,
    private authService: AuthService,
    private afStorage: AngularFireStorage,
    private matSnackBar: MatSnackBar,
  ) {}

  ngOnInit() {}

  onSubmited(form: NgForm) {
    console.log('Clicked');
    if (form.invalid || !this.imageUrl) {
      return;
    }
    const user = this.authService.currentUser;
    if (!user) {
      return;
    }
    const post: Post = {
      ...form.value,
      published: firebase.firestore.FieldValue.serverTimestamp(),
      image: this.imageUrl,
      author: user.displayName || user.email,
      authorId: user.uid
    };
    console.log('Post: ', post);
    this.postService
      .createPost(post)
      .then(docRef => {
        console.log(docRef.id);
        this.matSnackBar.open('Add post successfully', null, {
          duration: 1500
        });
        this.imageUrl = null;
        this.percentageChanges = null;
        form.resetForm();
      })
      .catch(err => {
        console.log(err);
        this.matSnackBar.open(err.toString(), null, {
          duration: 1500
        });
      });
  }

  onFileInput(input) {
    if (input.target.files && input.target.files[0]) {
      this.imageUrl = null;
      this.percentageChanges = null;
      const file = input.target.files[0];
      const ref = this.afStorage.ref(`images/${Date.now() + file.name}`);
      const task = ref.put(file);
      this.percentageChanges = task.percentageChanges();
      task.then(uploadTaskSnapshot => {
        ref.getDownloadURL().subscribe(url => {
          this.imageUrl = url;
        });
      });
    }
  }
}
