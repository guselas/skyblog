//#region Generic module dependencies
var mongoose = require('mongoose');
const express = require('express')
const bodyParser = require('body-parser');
var useragent = require('express-useragent');
//Used for the blogAPI
const blogApp = express();
//Used for the crudAPI
const crudAppV0 = express();

const cors = require('cors');
const BlogBearerMW = require('./middlewares/BlogBearerMW');
const CrudBearerMW = require('./middlewares/CrudBearerMW');
//#endregion
const BaseService = require('./Services/BaseService');

//Aux Variable to kepp the list of all DAOs, DTOs and Services of the blogApp
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

//#region BlogService
const LoginDTO = require('./DTO/LoginDTO');
const RegisterDTO = require('./DTO/RegisterDTO');

const WhoAmIDTO = require('./DTO/WhoAmIDTO');
const BlogDTO = require('./DTO/BlogDTO');
const FullBlogDTO = require('./DTO/Full/FullBlogDTO');
const BlogCommentDTO = require('./DTO/BlogCommentDTO');


const BlogService = require('./Services/BlogService');
services.DTO.LoginDTO = LoginDTO;
services.DTO.RegisterDTO = RegisterDTO;
services.DTO.WhoAmIDTO = WhoAmIDTO;
services.DTO.BlogDTO = BlogDTO;
services.DTO.FullBlogDTO = FullBlogDTO;
services.DTO.BlogCommentDTO = BlogCommentDTO;

//#endregion

//#region Services
//We add to the global variables 'services' the new instances of the blogApp Services.
services.services.badWordsService = new BadWordsService(services);
services.services.bearersService = new BearersService(services);
services.services.commentsService = new CommentsService(services);
services.services.postsService = new PostsService(services);
services.services.usersService = new UsersService(services);


services.services.blogService = new BlogService(services);

//#endregion

//#region BlogMW
blogApp.use(bodyParser.json());
blogApp.use(cors());
blogApp.use(useragent.express());
blogApp.currentLogins = [];
var blogBearerMW = new BlogBearerMW(blogApp.currentLogins);
blogApp.use(bodyParser.urlencoded({
    extended: false
}));
blogApp.use(blogBearerMW.validate.bind(blogBearerMW));
//#endregion

//#region CrudMW
crudAppV0.use(bodyParser.json());
crudAppV0.use(cors());
crudAppV0.use(useragent.express());
crudAppV0.currentLogins = [];
var crudBearerMW = new CrudBearerMW(crudAppV0.currentLogins);
crudAppV0.use(bodyParser.urlencoded({
    extended: false
}));
crudAppV0.use(crudBearerMW.validate.bind(crudBearerMW));
//#endregion


//#region APIs
//CRUDs APIs
const BadWordsAPI = require('./API/BadWordsAPI');
const badWordsAPI = new BadWordsAPI('/api/V0', crudAppV0, services.services);

const BearersAPI = require('./API/BearersAPI');
const bearersAPI = new BearersAPI('/api/V0', crudAppV0, services.services);

const CommentsAPI = require('./API/CommentsAPI');
const commentsAPI = new CommentsAPI('/api/V0', crudAppV0, services.services);

const PostsAPI = require('./API/PostsAPI');
const postsAPI = new PostsAPI('/api/V0', crudAppV0, services.services);

const UsersAPI = require('./API/UsersAPI');
const usersAPI = new UsersAPI('/api/V0', crudAppV0, services.services);

//BLOG (blogApp) API
const BlogAPI = require('./API/BlogAPI');
const blogAPI = new BlogAPI('/api', blogApp, services.services);

//#endregion

async function crudAppInit() {
    console.log("CrudApp Server listening on port 3001");
    await crudAppV0.listen(3001);
    crudAppV0._router.stack.forEach(function (r) {
        if (r.route && r.route.path) {
            console.log(`${r.route.stack[0].method}:${r.route.path}`);
        }
    })
}

async function blogAppInit() {
    for (let service in services.services) {
        if (services.services[service] instanceof BaseService) {
            await services.services[service].seed();
        }
    }
    console.log("BlogApp Server listening on port 3000");
    await blogApp.listen(3000);
    blogApp._router.stack.forEach(function (r) {
        if (r.route && r.route.path) {
            console.log(`${r.route.stack[0].method}:${r.route.path}`);
        }
    })
}

async function startApp() {
    try {
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
        crudAppInit();
        blogAppInit();
    } catch (error) {
        console.log(error);
        console.log("Couldn't connect to Mongoose/skyBlog");
    }
}

startApp();