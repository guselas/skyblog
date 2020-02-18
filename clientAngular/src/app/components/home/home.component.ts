import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Post } from 'src/app/models/post.model';
import { PostsStoreService } from '../../services/postStore.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  posts$: Observable <Post[]>;
  sub: Subscription;

  // constructor(private postService: PostsService) { }
constructor(private store: PostsStoreService) {}
  ngOnInit(): void {
    // this.onGetPosts();
    this.store.init();
    this.posts$ = this.store.get$();
    console.log(this.store);
  }

  //  onGetPosts() {
  //   this.posts$ = this.postService.getPostsModified();
  //   // this.posts$ = this.postService.getPosts();
  // }

}
