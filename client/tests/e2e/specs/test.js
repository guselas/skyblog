// https://docs.cypress.io/api/introduction/api.html

describe('Posts', function () {
  it('Creates a post with NO offensive words', function () {
    cy.visit('http://localhost:8080/login');
    cy.get('#InputEmail1').type("blogger1@gmail.com");
    cy.get('#InputPassword1').type("123");
    cy.get('#loginSubmit').click();
    cy.get('#newPostBtn').click();
    cy.get('#textarea-large-postTitle').type('Mortadelo y Filemon');
    cy.get('#textarea-large-postContent').type('Son dos superheroes españoles');
    cy.get('#inline-form-input-category').type('Español');
    cy.contains('OK').click();
    cy.contains('Mortadelo y Filemon');
  })

  it('Dont create a post with offensive words', function () {
    cy.visit('http://localhost:8080/login');
    cy.get('#InputEmail1').type("blogger1@gmail.com");
    cy.get('#InputPassword1').type("123");
    cy.get('#loginSubmit').click();
    cy.get('#newPostBtn').click();
    cy.get('#textarea-large-postTitle').type('abbo');
    cy.get('#textarea-large-postContent').type('abbo');
    cy.get('#inline-form-input-category').type('Marvel');
    cy.contains('OK').click();
    cy.contains('Post too offensive: word: abbo(level 1),word: abbo(level 1)');
  })
})


describe('Comments', function () {
  it('Creates a comment with no offensive words', function () {
    cy.visit('http://localhost:8080/login');
    cy.get('#InputEmail1').type("blogger1@gmail.com");
    cy.get('#InputPassword1').type("123");
    cy.get('#loginSubmit').click();
    cy.get("#5e33eff66c065826b9bacb01").click();
    cy.get('#newCommentBtn').click();
    cy.get('#commentTextInput').type('A great comment by Cypress');
    cy.contains('OK').click();
    cy.contains('comment correctly posted!');

  })

  it('Dont create a comment with Offensive words', function () {
    cy.visit('http://localhost:8080/login');
    cy.get('#InputEmail1').type("blogger1@gmail.com");
    cy.get('#InputPassword1').type("123");
    cy.get('#loginSubmit').click();
    cy.get("#5e33eff66c065826b9bacb01").click();
    cy.get('#newCommentBtn').click();
    cy.get('#commentTextInput').type('abbo');
    cy.contains('OK').click();
    cy.contains('Comment too offensive: word: abbo(level 1),word: abbo(level 1)');

  })
})