
export interface Post {
  id?: string;
  title: string;
  content: string;
  published: firebase.firestore.Timestamp;
  image: string;
  author: string;
  authorId: string;
}
