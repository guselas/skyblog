//#region Generic module dependencies
var mongoose = require('mongoose');
const express = require('express')
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
//#endregion

//#region APIs
//CRUDs APIs
const PostsAPI = require('./API/PostsAPI');
const CommentsAPI = require('./API/CommentsAPI');

//BlogAPI
const BlogAPI = require('./API/BlogAPI');
//#endregion

