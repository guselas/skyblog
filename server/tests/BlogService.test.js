class BlogContext {
    constructor(host, dbName) {
        this.host = host;
        this.dbName = dbName;

        this.mongoose = require('mongoose');

        //Create an auxiliar object services to hold .services, .DTO & .DAO
        let Services = require('../Services/Services');
        let services = new Services();

        //Crud Services
        //DAO constructors
        services.DAO.BadWordDAO = require('../DAO/BadWordDAO');
        services.DAO.BearerDAO = require('../DAO/BearerDAO');
        services.DAO.CommentDAO = require('../DAO/CommentDAO');
        services.DAO.PostDAO = require('../DAO/PostDAO');
        services.DAO.UserDAO = require('../DAO/UserDAO');
        //DTO constructors
        services.DTO.BadWordDTO = require('../DTO/BadWordDTO');
        services.DTO.BearerDTO = require('../DTO/BearerDTO');
        services.DTO.CommentDTO = require('../DTO/CommentDTO');
        services.DTO.PostDTO = require('../DTO/PostDTO');
        services.DTO.UserDTO = require('../DTO/UserDTO');
        //FullDTO constructors
        services.DTO.FullBadWordDTO = require('../DTO/Full/FullBadWordDTO');
        services.DTO.FullBearerDTO = require('../DTO/Full/FullBearerDTO');
        services.DTO.FullCommentDTO = require('../DTO/Full/FullCommentDTO');
        services.DTO.FullPostDTO = require('../DTO/Full/FullPostDTO');
        services.DTO.FullUserDTO = require('../DTO/Full/FullUserDTO');
        //services constructors
        let BadWordsService = require('../Services/BadWordsService');
        let BearersService = require('../Services/BearersService');
        let CommentsService = require('../Services/CommentsService');
        let PostsService = require('../Services/PostsService');
        let UsersService = require('../Services/UsersService');

        //new instances of the services
        services.services.badWordsService = new BadWordsService(services);
        services.services.bearersService = new BearersService(services);
        services.services.commentsService = new CommentsService(services);
        services.services.postsService = new PostsService(services);
        services.services.usersService = new UsersService(services);

        //Blog Service alone
        services.DTO.BlogDTO = require('../DTO/BlogDTO');
        services.DTO.BlogCommentDTO = require('../DTO/BlogCommentDTO');
        services.DTO.FullBlogDTO = require('../DTO/Full/FullBlogDTO');

        let BlogService = require('../Services/BlogService');

        services.services.blogService = new BlogService(services);

        //We catch the properties of variable services & paste in the context directly as properties. 
        this.services = services.services;
        this.DAO = services.DAO;
        this.DTO = services.DTO;

        //Also we have to paste the created service as properties of context
        this.badWordsService = services.services.badWordsService;
        this.bearersService = services.services.bearersService;
        this.commentsService = services.services.commentsService;
        this.postsService = services.services.postsService;
        this.usersService = services.services.usersService;

        this.blogService = services.services.blogService;
    }

    async connect(host, dbName) {
        if (!host) {
            host = this.host;
        }
        if (!dbName) {
            dbName = this.dbName;
        }
        this.db = await this.mongoose.connect(`mongodb://${host}/${dbName}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            connectTimeoutMS: 4000
        });
        return this.db;
    }

    disconnect() {

    }

    async clearContextData() {
        if (this.db) {
            for (let dao in this.DAO) {
                await this.DAO[dao].deleteMany({});
            }
        }
    }

    async execTest(fnToTest) {
        await this.connect();
        expect(this.db).not.toBe(null);
        if (this.db) {
            try {
                await fnToTest(this);
            } finally {
                //await this.disconnect();
            }
        }
    }
}

beforeAll(async () => {
    let context = new BlogContext("localhost", "skyBlogTest");
    await context.connect();
    await context.clearContextData();
    await context.blogService.seed();
    await context.usersService.seed();
});

afterAll(async () => {
    let context = new BlogContext("localhost", "skyBlogTest");
    await context.connect();
    expect(context.db).not.toBe(null);
    if (context.db) {
        context.db.disconnect();
    }
});

test('After doing the blogService.seed(), we should have all the bad words lists + count ', async () => {
    let context = new BlogContext("localhost", "skyBlogTest");
    try {
        await context.execTest(async (context) => {
            //----------------------------------
            //code to test
            //----------------------------------
            let errors = [];
            let count = await context.blogService.getBadWordsCount(5, {}, errors);
            expect(count).not.toBe(null);
            if (count) {
                expect(count).not.toBe(0);
            }
            //----------------------------------
            //end code to test
            //----------------------------------
        });
    } finally {

    }
    context.disconnect();
});

test('Insert a new blog entry without offensive words', async () => {
    let context = new BlogContext("localhost", "skyBlogTest");
    try {
        await context.execTest(async (context) => {
            //----------------------------------
            //code to test
            //----------------------------------
            let errors = [];
            await context.blogService.seed();
            await context.usersService.seed();
            let usersDTO = await context.usersService.readAll({}, errors);
            expect(usersDTO).not.toBe(null);
            if (usersDTO) {
                expect(usersDTO.length).not.toBe(0);
                if (usersDTO.length > 0) {
                    let authorDTO = usersDTO[0];
                    let blogDTO = new context.DTO.BlogDTO();
                    let postBlogDTO = blogDTO.postModel();
                    postBlogDTO.postTitle = "Hello World";
                    postBlogDTO.postText = "This post is great";
                    let newBlogDTO = await context.blogService.newBlog(authorDTO.id, postBlogDTO, errors);
                    expect(newBlogDTO).not.toBe(null);
                    expect(newBlogDTO.postTitle).toBe("Hello World");
                    expect(newBlogDTO.postText).toBe("This post is great");
                    expect(newBlogDTO.email).toBe(authorDTO.email);
                    expect(newBlogDTO.nickName).toBe(authorDTO.nickName);
                    expect(newBlogDTO.comments.length).toBe(0);
                    let deleteResult = await context.blogService.deleteBlog(authorDTO.id, newBlogDTO.id, errors);
                    expect(deleteResult).toBe(true);
                }
            }
            //----------------------------------
            //end code to test
            //----------------------------------
        });
    } finally {

    }
    context.disconnect();
});

test('When insert a blog with an offensive word in the postTittle or in the postText we get "Post too offensive"', async () => {
    let context = new BlogContext("localhost", "skyBlogTest");
    try {
        await context.execTest(async (context) => {
            //----------------------------------
            //code to test
            //----------------------------------
            let errors = [];
            await context.usersService.seed();

            await context.blogService.seed();
            await context.blogService.checkValidator();
            let usersDTO = await context.usersService.readAll({}, errors);
            expect(usersDTO).not.toBe(null);
            if (usersDTO) {
                expect(usersDTO.length).not.toBe(0);
                if (usersDTO.length > 0) {
                    let badWord = "";
                    //we grant that for each level of the offensive words we get at least one offensive word
                    for (let level in context.blogService.validator.badWords) {
                        for (let word in context.blogService.validator.badWords[level]) {
                            badWord = word;
                            break;
                        }
                        if (badWord) {
                            break;
                        }
                    }
                    expect(badWord).not.toBe("");
                    if (badWord) {
                        let authorDTO = usersDTO[0];
                        let blogDTO = new context.DTO.BlogDTO();
                        let postBlogDTO = blogDTO.postModel();
                        //Test for postTitle
                        postBlogDTO.postTitle = `Hello ${badWord}`;
                        postBlogDTO.postText = "This post is great";
                        let newBlogDTO = await context.blogService.newBlog(authorDTO.id, postBlogDTO, errors);
                        expect(newBlogDTO).toBe(null);
                        expect(errors.length).not.toBe(0);
                        if (errors.length > 0) {
                            expect(errors[0].indexOf("Post too offensive")).toBe(0);
                        }
                        //Test for postText
                        postBlogDTO.postTitle = `Hello World`;
                        postBlogDTO.postText = `This post ${badWord} is great`;
                        newBlogDTO = await context.blogService.newBlog(authorDTO.id, postBlogDTO, errors);
                        expect(newBlogDTO).toBe(null);
                        expect(errors.length).not.toBe(0);
                        if (errors.length > 0) {
                            expect(errors[0].indexOf("Post too offensive")).toBe(0);
                        }
                    }
                }
            }
            //----------------------------------
            //end code to test
            //----------------------------------
        });
    } finally {

    }
    context.disconnect();
});

test('When we insert a comment (not offensive) to a blog entry we can read that comment in the blog comments list', async () => {
    let context = new BlogContext("localhost", "skyBlogTest");
    try {
        await context.execTest(async (context) => {
            //----------------------------------
            //code to test
            //----------------------------------
            let errors = [];
            await context.blogService.seed();
            await context.usersService.seed();
            let usersDTO = await context.usersService.readAll({}, errors);
            expect(usersDTO).not.toBe(null);
            if (usersDTO) {
                expect(usersDTO.length).not.toBe(0);
                if (usersDTO.length > 0) {
                    let authorDTO = usersDTO[0];
                    let blogDTO = new context.DTO.BlogDTO();
                    let postBlogDTO = blogDTO.postModel();
                    postBlogDTO.postTitle = "Hello World";
                    postBlogDTO.postText = "This post is great";
                    let newBlogDTO = await context.blogService.newBlog(authorDTO.id, postBlogDTO, errors);
                    expect(newBlogDTO).not.toBe(null);
                    if (newBlogDTO) {
                        let blogCommentDTO = new context.DTO.BlogCommentDTO();
                        postBlogCommentDTO = blogCommentDTO.postModel();
                        postBlogCommentDTO.commentText = "This is a comment for this test post";
                        let updatedBlogDTO = await context.blogService.newComment(authorDTO.id, newBlogDTO.id, postBlogCommentDTO, errors);
                        expect(updatedBlogDTO).not.toBe(undefined);
                        if (updatedBlogDTO) {
                            expect(updatedBlogDTO.comments.length).not.toBe(0);
                            if (updatedBlogDTO.comments.length > 0) {
                                expect(updatedBlogDTO.comments[0].commentText).toBe("This is a comment for this test post");
                            }
                            let deleteResult = await context.blogService.deleteBlog(authorDTO.id, updatedBlogDTO.id, errors);
                            expect(deleteResult).toBe(true);
                        }
                    }
                }
            }
            //----------------------------------
            //end code to test
            //----------------------------------
        });
    } finally {

    }
    context.disconnect();
});

test('When we insert an OFFENSIVE comment to a blog entry we get "Comment too offensive"', async () => {
    let context = new BlogContext("localhost", "skyBlogTest");
    try {
        await context.execTest(async (context) => {
            //----------------------------------
            //code to test
            //----------------------------------
            let errors = [];
            await context.usersService.seed();

            await context.blogService.seed();
            await context.blogService.checkValidator();
            let usersDTO = await context.usersService.readAll({}, errors);
            expect(usersDTO).not.toBe(null);
            if (usersDTO) {
                expect(usersDTO.length).not.toBe(0);
                if (usersDTO.length > 0) {
                    let badWord = "";
                    //we grant that for each level of the offensive words we get at least one offensive word
                    for (let level in context.blogService.validator.badWords) {
                        for (let word in context.blogService.validator.badWords[level]) {
                            badWord = word;
                            break;
                        }
                        if (badWord) {
                            break;
                        }
                    }
                    expect(badWord).not.toBe("");
                    if (badWord) {
                        let authorDTO = usersDTO[0];
                        let blogDTO = new context.DTO.BlogDTO();
                        let postBlogDTO = blogDTO.postModel();
                        postBlogDTO.postTitle = "Hello World";
                        postBlogDTO.postText = "This post is great";
                        let newBlogDTO = await context.blogService.newBlog(authorDTO.id, postBlogDTO, errors);
                        expect(newBlogDTO).not.toBe(null);
                        if (newBlogDTO) {
                            let blogCommentDTO = new context.DTO.BlogCommentDTO();
                            postBlogCommentDTO = blogCommentDTO.postModel();
                            postBlogCommentDTO.commentText = `This is a comment ${badWord} for this test post`;
                            let updatedBlogDTO = await context.blogService.newComment(authorDTO.id, newBlogDTO.id, postBlogCommentDTO, errors);
                            expect(updatedBlogDTO).toBe(null);
                            expect(errors.length).not.toBe(0);
                            if (errors.length > 0) {
                                expect(errors[0].indexOf("Comment too offensive")).toBe(0);
                            }
                            let deleteResult = await context.blogService.deleteBlog(authorDTO.id, newBlogDTO.id, errors);
                            expect(deleteResult).toBe(true);
                        }
                    }
                }
            }
            //----------------------------------
            //end code to test
            //----------------------------------
        });
    } finally {

    }
    context.disconnect();
});