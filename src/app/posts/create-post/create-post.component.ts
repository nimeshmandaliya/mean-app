import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';

import { PostService } from '../posts.service';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit {

  postTitle: string = '';
  postContent: string = '';
  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = 'create';
  private postId: string;

  constructor(public postService: PostService,
              public route: ActivatedRoute) {}

  ngOnInit() {
    this.form = new FormGroup({
      title:  new FormControl(null, {
        validators: [Validators.required]
      }),
      content:  new FormControl(null, {
        validators: [Validators.required]
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postService.getPost(this.postId)
          .subscribe(postData => {
            this.isLoading = false;
            this.post = {id: postData._id, title: postData.title, content: postData.content, imagePath: postData.imagePath, creator: postData.creator};
            this.form.setValue({
              title: this.post.title,
              content: this.post.content,
              image: this.post.imagePath
            });
          });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({
      image: file
    });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    }
    reader.readAsDataURL(file);
  }

  onSavePost() {
    if(this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if(this.mode === 'create') {
      this.postService.addPosts(
          this.form.value.title,
          this.form.value.content,
          this.form.value.image
      );
    } else {
      this.postService.updatePost(
          this.postId,
          this.form.value.title,
          this.form.value.content,
          this.form.value.image
      );
    }
    this.form.reset();
  }

}


