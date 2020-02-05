# SkyBlog

This is a blog where users can leave posts, comments and react to other user's posts.

## Installation 
1. Clone the repository
2. In a terminal do *git clone + git repository web URL*
3. Access the folder with *cd skyblog*

You will found two areas for this blog, a server part and a client part. We have to make the installation for both, so for that:
4. Access the server area with *cd server* and install all its dependencies by doing *npm install* in the terminal.
5. The same for the client part, so from skyblog folder, do *cd client* and then *npm install* 

With that, you will install:
1. In the server:
    - bcryptjs: to crypt all the passwords used in the blog
    - body-parser: extract the entire body portion of an incoming request stream and exposes it on req.body
    - cors: Cross-Origin Resource Sharing (CORS) is a mechanism that uses additional HTTP headers to tell browsers to give a web application running at one origin, access to selected resources from a different origin. 
    - Express: Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
    - https: to use secure HTTP protocol.
    - jsonwebtoken: JSON Web Token is an Internet standard for creating JSON-based access tokens that assert some number of claims. 
    - mongoose: it's the mongoDB ORM
    - node.js
    - babel: is a toolchain that is mainly used to convert ECMAScript 2015+ code into a backwards compatible version of JavaScript in current and older browsers or environments. 
    - Jest: to make the unit tests (only for development)
    - nodemon: to autorun the server when changes are made. Avoid to restart the server for every change made. 
    - supertest: to make the REST API tests. 
 
2. In the client:
    - Vue: the framework used to design the client part of the app. 
    - Axios: to make the fetch requests to the server
    - bootstrap: to make easier the components design and drawing. Also for responsive styling.
    - moment: library used to convert date times to "human" reading
    - vuex: it serves as a centralized store for all the components in an application, with rules ensuring that the state can only be mutated in a predictable fashion. We use it to use global variables for all the client app. 
    - core-js: Modular standard library for JavaScript. Includes polyfills for ECMAScript up to 2019: promises, symbols, collections, iterators, typed arrays, many other features, ECMAScript proposals, some cross-platform WHATWG / W3C features and proposals like URL.

## Usage

This blog has several kind of users:
- [ ]  Admin 
- [ ]  Author
- [ ]  Blogger

To start the blog we will need to run two applications: *server* & *client*.
In order to do that, we will need to open two terminals. 

Server Terminal | Client Terminal
------------ | -------------
SkyBlog/server: npm run start (to run the server with nodemon) | SkyBlog/client: npm run serve (to run the Vue instance of the app)

Once done, we will have to go to [app](http://localhost:8080/) to use the blog.

Depending on the user kind some options are available or not. 
Let's dive into them, we'll start with the most complete *the adminnistrator*.

## Admin
![home Main](/public/gitScreenShoots/homeMain.png)

This is the main vue for SkyBlog. If we log in as admin we will see another kind of view.
![home Main admin](/public/gitScreenShoots/adminHomeMain.png)

As you can see the admin user has other kind of buttons and options. 

For example the admin has the capacity to create, edit and delete offensive words. 

 ![admin Badwords](/public/gitScreenShoots/adminBadWords.png)

 Also the admin has the capacity to delete any post even if he's not the author of it. 

  ![admin delete post](/public/gitScreenShoots/adminDeletePost.png)

He can create new posts.

  ![admin new post](/public/gitScreenShoots/newPost.png)

And make new comments.

  ![admin new comment](/public/gitScreenShoots/newComment.png)


## Author

Authors have the capacity to create new posts as the admin. 
They also have a section *my posts* where they will see their own posts.

  ![author myposts](/public/gitScreenShoots/myposts.png)

You will see only the posts you've created, and as you are the author of them you have the posibility to edit the post or to delete it. 

  ![author editpost](/public/gitScreenShoots/editPost.png)

If a post has comments associated you can check them in the post details. Below the post you will see a list of comments, with the comment author, the comment date and the comment last update date. To have some details about the comment. 

## Blogger

Bloggers have the posibility to make only comments, they don't have the option to create posts because they are not authors. 


  ![blogger home Main](/public/gitScreenShoots/bloggerHomeMain.png)

  As you can see the **new post** button is disabled. Bloggers will only be abble to make comments and report posts. 

## General

Some options you have to this blog is to filter by category, to search by words and to restart filters.

  ![filter](/public/gitScreenShoots/filter.png)

Categories filters are dinamic, so if a new category post is added you will see a new category filter. Also the **search** button will find in any post title or post text the inserted text. It's not case sensitive. 

Users can register in the app and by default they will have the blogger user associated. 

  ![register](/public/gitScreenShoots/register.png)

Once registered you will be redirected to the login area. Once logged your nickName will be shown in the whole app at the top with a welcome message. 

## Important

There is a middleware that checks for any offensive word you can't make. If you insert any offensive word an alert message will appear informing about the offensive word included in the text and the level associated to it. 


  ![badwords Alert](/public/gitScreenShoots/badwordAlert.png)

  As you can see if you insert an offensive word in the post or the comment an alert message will appear telling you wich is the offensive word you've included and it's level. Obviously the post/comment will not be inserted. 

## Contributing

There are many things we can do to improve this blog.

For example: 
- we could add an images service to add pictures to the blog.
- we can create a reports service where if a post get X reports the author will pass from author to blogger.
- we could add likes, views, etc. to the posts. 

## Project status

Right now the poject is under development, so any contribution,bug report or feedback is welcome! 
Happy coding! 








