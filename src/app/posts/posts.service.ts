import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { map } from 'rxjs/operators';

import { environment } from "../../environments/environment";

import { Post } from "./post.model";

const BACKEND_URL = environment.apiUrl + "/posts";

@Injectable({providedIn: 'root'})

export class PostService {
  private posts: Post[] = [];
  private postUpdated = new Subject<{posts: Post[], postCount: number}>();

  constructor(private http: HttpClient,
              private router: Router ) {}

  getPost(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      creator: string; }>
      (BACKEND_URL + "/" + id);
  }

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{message: string, posts: any, maxPosts: number}>(
      BACKEND_URL + queryParams
      )
      .pipe(map((postData) => {
        return { posts: postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath,
            creator: post.creator
          }
        }),
        maxPosts: postData.maxPosts
      };
      }))
      .subscribe((transformedPostData) => {
        console.log(transformedPostData);
        this.posts = transformedPostData.posts;
        this.postUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }

  getPostUpdateListener() {
    return this.postUpdated.asObservable();
  }

  addPosts(title: string, content: string, image: File) {
    // const post: Post = {id: null, title: title, content: content};
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    this.http
      .post<{ message: string, post: Post }>(
        BACKEND_URL, postData)
      .subscribe(res => {
        this.router.navigate(['/']);
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if(typeof(image) === 'object') {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null
      };
    }

    this.http.put(BACKEND_URL + "/" + id, postData)
      .subscribe(res => {
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    return this.http.delete(BACKEND_URL + "/" + postId);
  }
}
