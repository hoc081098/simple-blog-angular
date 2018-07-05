import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostService } from '../post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { Post } from '../post';
import { AuthService } from '../../core/auth.service';
import { MatSnackBar } from '@angular/material';
import { NgForm } from '@angular/forms';
import { AngularFireStorage } from 'angularfire2/storage';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit, OnDestroy {
  post: Post;
  subscription: Subscription;
  editting = false;
  percentageChanges: Observable<number>;
  imageUrl: string;

  constructor(
    private postService: PostService,
    private activedRoute: ActivatedRoute,
    public authService: AuthService,
    private matSnackBar: MatSnackBar,
    private router: Router,
    private afStorage: AngularFireStorage
  ) {}

  ngOnInit() {
    this.subscription = this.getPost().subscribe(post => {
      this.post = post;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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

  onEditClicked(form: NgForm) {
    form.setValue({
      title: this.post.title,
      content: this.post.content
    });
    this.imageUrl = this.post.image;
    this.editting = true;
  }

  getPost(): Observable<Post> {
    return this.activedRoute.params.pipe(
      map(params => params['id'] as string),
      switchMap(id => this.postService.getPostById(id))
    );
  }

  onSubmited(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const update: Post = {
      ...form.value,
      image: this.imageUrl == null ? this.post.image : this.imageUrl
    };
    this.postService
      .updatePost(this.post.id, update)
      .then(v => {
        this.matSnackBar
          .open('Change successfully', null, {
            duration: 1000
          });
        this.editting = false;
      })
      .catch(err => {
        this.matSnackBar.open(`Change failed: ${err}`, null, {
          duration: 1500
        });
      });
  }

  deletePost(postId: string) {
    this.postService
      .deletePost(postId)
      .then(v => {
        this.post = null;
        this.subscription.unsubscribe();
        this.matSnackBar
          .open('Delete post successfully', null, {
            duration: 1500
          })
          .afterDismissed()
          .subscribe(snackBarDismiss => {
            this.router.navigate(['/blog']);
          });
      })
      .catch(e => {
        this.matSnackBar.open(`Delete post failed: ${e}`, null, {
          duration: 1500
        });
      });
  }
}
