import { Component, OnInit } from '@angular/core';
import { PostService } from '../post.service';
import { Observable } from 'rxjs';
import { Post } from '../post';
import { AuthService } from '../../core/auth.service';
import { MatSnackBar } from '@angular/material';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  postsObservable: Observable<Post[]>;

  constructor(
    private postService: PostService,
    private matSnackBar: MatSnackBar,
    public autherService: AuthService
  ) {}

  ngOnInit(): void {
    this.postsObservable = this.postService.getPosts();
    this.postService.getPosts().subscribe(posts => {
      console.log(posts);
    });
  }

  deletePost(postId: string) {
    this.postService
      .deletePost(postId)
      .then(_ => {
        this.matSnackBar.open('Delete post successfully', null, {
          duration: 1500
        });
      })
      .catch(e => {
        this.matSnackBar.open(`Delete post failed: ${e}`, null, {
          duration: 1500
        });
      });
  }
}
