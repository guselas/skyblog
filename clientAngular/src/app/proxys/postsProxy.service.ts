import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListPostDTO } from '../models/postDTO.model';

@Injectable({
  providedIn: 'root'
})
export class PostsProxyService {

  constructor(private httpClient: HttpClient) {}

  getPosts(): Observable < ListPostDTO > {
    return this.httpClient.get < ListPostDTO > ('http://localhost:3000/api/blog');
  }
}
