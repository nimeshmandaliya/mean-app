import { Component, OnDestroy, OnInit} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

import { Post } from '../post.model';
import { PostService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy{

  panelOpenState = false;
  totalPosts = 0;
  postsPerPage = 2;
  pageSizeOptions = [1, 2, 5, 10];
  currentPage = 1;
  userId: string;
  // posts = [
  //   { title: "First Post", content: "This is first post content"},
  //   { title: "Second Post", content: "This is second post content"},
  //   {title: "Third Post", content: "This is third post content"},
  // ];

  posts: Post[] = [];
  private PostsSub: Subscription;

  userIsAuthenticated = false;
  private authListnerSub: Subscription;

  constructor(public postService: PostService,
              private authService: AuthService) {}

  ngOnInit() {
    this.postService.getPosts(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.PostsSub = this.postService.getPostUpdateListener()
      .subscribe((postData: {posts: Post[], postCount: number}) => {
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
    });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListnerSub = this.authService.getAuthstatusListener()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    });
  }

  onDelete(id: string) {
    this.postService.deletePost(id)
      .subscribe(() => {
        this.postService.getPosts(this.postsPerPage, this.currentPage);
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
  }

  ngOnDestroy() {
    this.PostsSub.unsubscribe();
    this.authListnerSub.unsubscribe();
  }

}
