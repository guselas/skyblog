//#region Generic module dependencies
var mongoose = require('mongoose');
const express = require('express')
const bodyParser = require('body-parser');
const app = express();

const cors = require('cors');
const BearerMiddleWare = require('./middlewares/BearerMiddleWare');
//#endregion
const BaseService = require('./Services/BaseService');

//Aux Variable to kepp the list of all DAOs, DTOs and Services of the app
const Services = require('./Services/Services');
var services = new Services();

//#region BadWords
const BadWordDAO = require('./DAO/BadWordDAO');
const BadWordDTO = require('./DTO/BadWordDTO');
const FullBadWordDTO = require('./DTO/Full/FullBadWordDTO');
const BadWordsService = require('./Services/BadWordsService');
//We add to the global variable 'services' the DAOs, DTOs and FullDTO
services.DAO.BadWordDAO = BadWordDAO;
services.DTO.BadWordDTO = BadWordDTO;
services.DTO.FullBadWordDTO = FullBadWordDTO;
//#endregion


//#region Bearers
const BearerDAO = require('./DAO/BearerDAO');
const BearerDTO = require('./DTO/BearerDTO');
const FullBearerDTO = require('./DTO/Full/FullBearerDTO');
const BearersService = require('./Services/BearersService');
services.DAO.BearerDAO = BearerDAO;
services.DTO.BearerDTO = BearerDTO;
services.DTO.FullBearerDTO = FullBearerDTO;
//#endregion


//#region Comments
const CommentDAO = require('./DAO/CommentDAO');
const CommentDTO = require('./DTO/CommentDTO');
const FullCommentDTO = require('./DTO/Full/FullCommentDTO');
const CommentsService = require('./Services/CommentsService');
services.DAO.CommentDAO = CommentDAO;
services.DTO.CommentDTO = CommentDTO;
services.DTO.FullCommentDTO = FullCommentDTO;
//#endregion

//#region Posts
const PostDAO = require('./DAO/PostDAO');
const PostDTO = require('./DTO/PostDTO');
const FullPostDTO = require('./DTO/Full/FullPostDTO');
const PostsService = require('./Services/PostsService');
services.DAO.PostDAO = PostDAO;
services.DTO.PostDTO = PostDTO;
services.DTO.FullPostDTO = FullPostDTO;
//#endregion


//#region Users
const UserDAO = require('./DAO/UserDAO');
const UserDTO = require('./DTO/UserDTO');
const FullUserDTO = require('./DTO/Full/FullUserDTO');
const UsersService = require('./Services/UsersService');
services.DAO.UserDAO = UserDAO;
services.DTO.UserDTO = UserDTO;
services.DTO.FullUserDTO = FullUserDTO;
//#endregion

//#region Blog
const BlogService = require('./Services/BlogService');

//#endregion


//#region Services
//We add to the global variables 'services' the new instances of the app Services.
services.services.badWordsService = new BadWordsService(services);
services.services.bearersService = new BearersService(services);
services.services.commentsService = new CommentsService(services);
services.services.postsService = new PostsService(services);
services.services.usersService = new UsersService(services);


services.services.blogService = new BlogService(services);

//#endregion

//#region Middlewares
var bearerMiddleWare = new BearerMiddleWare();
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(cors());

app.use(bearerMiddleWare.validate.bind(bearerMiddleWare));

//#endregion


//#region APIs
//CRUDs APIs
const BadWordsAPI = require('./API/BadWordsAPI');
const BearersAPI = require('./API/BearersAPI');
const BlogAPI = require('./API/BlogAPI');
const CommentsAPI = require('./API/CommentsAPI');
const PostsAPI = require('./API/PostsAPI');
const UsersAPI = require('./API/UsersAPI');

//CRUD APIS
const badWordsAPI = new BadWordsAPI('/api', app, services.services);
const bearersAPI = new BearersAPI('/api', app, services.services);
const commentsAPI = new CommentsAPI('/api', app, services.services);
const postsAPI = new PostsAPI('/api', app, services.services);
const usersAPI = new UsersAPI('/api', app, services.services);

//BLOG (app) API
const blogAPI = new BlogAPI('/api', app, services.services);


//#endregion



async function appInit() {
    for (let service in services.services) {
        
        if (services.services[service] instanceof BaseService) {
            await services.services[service].seed();
        }
    }
    console.log("Server listening on port 3000");
    await app.listen(3000);
  

}

async function startApp() {
    try {
        app._router.stack.forEach(function (r) {
            if (r.route && r.route.path) {
                console.log(`${r.route.stack[0].method}:${r.route.path}`);
            }
        })
        let dbName = 'skyBlog';
        if (process.argv.includes('test')) {
            dbName = 'skyBlogTest';
            console.log('Test Mode');
        }
        const connection = await mongoose.connect(`mongodb://localhost/${dbName}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Mongoose Connected!");
        appInit();
    } catch (error) {
        console.log("Couldn't connect to Mongoose/skyBlog");
    }
}

startApp();