import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentData,
  DocumentChangeAction,
  AngularFirestoreDocument,
  DocumentReference
} from 'angularfire2/firestore';
import { Post } from './post';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  readonly postsCollection: AngularFirestoreCollection;

  constructor(private afFirestore: AngularFirestore) {
    this.postsCollection = this.afFirestore.collection('posts', ref =>
      ref.orderBy('published', 'desc')
    );
  }

  getPosts(): Observable<Post[]> {
    return this.postsCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(action => {
          console.log(action.payload.doc.data());
          return <Post>{
            ...action.payload.doc.data(),
            id: action.payload.doc.id
          };
        });
      })
    );
  }

  private getPostDocument(id: string): AngularFirestoreDocument<Post> {
    return this.postsCollection.doc<Post>(id);
  }

  getPostById(id: string): Observable<Post> {
    return this.getPostDocument(id)
      .valueChanges()
      .pipe(
        map(
          post =>
            <Post>{
              ...post,
              id: id
            }
        )
      );
  }

  createPost(data: Post): Promise<DocumentReference> {
    return this.postsCollection.add(data);
  }

  updatePost(id: string, data: Partial<Post>): Promise<void> {
    return this.getPostDocument(id).update(data);
  }

  setPost(id: string,  data: Post): Promise<void> {
    return this.getPostDocument(id).set(data);
  }

  deletePost(id: string): Promise<void> {
    return this.getPostDocument(id).delete();
  }
}
