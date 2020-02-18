import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Post } from '../models/post.model';
import { PostStore } from '../store/postStore';
import { PostsService } from './posts.service';

@Injectable({
  providedIn: 'root'
})

export class PostsStoreService extends PostStore < Post[] > {
  constructor(private service: PostsService) {
    super();
  }
  init(): Promise < Post[] > {
    if (this.get()) {
      return;
    }
    return this.service.getPostsModified().pipe(
      tap(this.store)
    ).toPromise();
  }
}
