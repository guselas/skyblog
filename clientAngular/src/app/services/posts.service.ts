import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators';
import { Post } from '../models/post.model';
import { ListPostDTO, PostDTO } from '../models/postDTO.model';
import { PostsProxyService } from '../proxys/postsProxy.service';
@Injectable({
  providedIn: 'root'
})
export class PostsService {


  // constructor(private httpClient: HttpClient) {}
  constructor(private postsProxyService: PostsProxyService) {}

  getPostsModified(): Observable < Post[] > {
    return this.postsProxyService.getPosts().pipe(
      map((listPostDTO: ListPostDTO) => listPostDTO.data),
      map((postsDTO: PostDTO[]) => {
        let posts: Post[] = [];
        postsDTO.map((postDTO: PostDTO) => {
          const post: Post = {
            postTitle: postDTO.postTitle,
            postText: postDTO.postText
          };
          posts = [...posts, post];
        });
        return posts;
      })
    );
    }
  }
    // getPosts(): PostDTO[] {
    //   const apiURL = 'http://localhost:3000/api/blog';
    //   const result: PostDTO[] = [];
    //   this.httpClient.get<ListPostDTO>(apiURL)
    //   .pipe(map(responseData => {
    //     const postsArray = [];
    //     for (const post of responseData.data) {
    //         result.push({ ... post });
    //       }
    //   }))
    //   .subscribe( res => {
    //     console.log(res);
    //   });
    //   return result;
    // }

    // getPosts(): Observable <ListPostDTO> {
    //   return this.httpClient.get<ListPostDTO>('http://localhost:3000/api/blog');
    //   }

    // getPosts(): Observable <PostDTO[]> {
    //   return this.proxyPostsService.getPosts().pipe(
    //     map((listPostDTO: ListPostDTO) => listPostDTO.data),
    //     map((postsDTO: PostDTO[]) => {
    //       let posts: Post[] = [];
    //       postsDTO.map((postDTO: PostDTO) => {
    //         const post: Post = {
    //           $type: postDTO.$type,
    //           postTitle: postDTO.postTitle,
    //           postText: postDTO.postText,
    //           category: postDTO.category,
    //           postDate: postDTO.postDate,
    //           lastUpdate: postDTO.lastUpdate,
    //           hasComments: postDTO.hasComments,
    //           email: postDTO.email,
    //           nickName: postDTO.nickName
    //         };
    //         posts = [... posts, post ];
    //       });
    //       return posts;
    //     })
    //   );
    // }

  // }
