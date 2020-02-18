/*
export interface ListPostDTO {
  pageSize: number;
  pageNumber: number;
  totalRecords: number;
  sorter: Sorter;
  filter: Sorter;
  data: PostDTO[];
  level: number;
  pageIndex: number;
}

export interface PostDTO {
  $type: string;
  id: string;
  rowVersion: number;
  postTitle: string;
  postText: string;
  category: string;
  postDate: string;
  lastUpdate: string;
  hasComments: boolean;
  email: string;
  nickName: string;
}

export interface Sorter {

}
*/

export interface ListPostDTO {
  pageSize: number;
  pageNumber: number;
  totalRecords: number;
  sorter: Sorter;
  filter: Sorter;
  data: PostDTO[];
  level: number;
  pageIndex: number;
}

export interface PostDTO {
  $type: string;
  id: string;
  rowVersion: number;
  postTitle: string;
  postText: string;
  category: string;
  postDate: string;
  lastUpdate: string;
  hasComments: boolean;
  email: string;
  nickName: string;
}

export interface Sorter {
}
