import selectors from '../support/selectors.js';

describe('Login page functionality', () => {
  let credentials;
  context('Login page and login are working correctly', () => {
      beforeEach(() => {
        cy.fixture("user").then(()=>{
          credentials = {
            username: Cypress.env('loginEmail'),
            password: Cypress.env('loginPassword')
          };
        })
      })
  
      it('login page successfully loads and is displayed correctly', () => {
        cy.visit(selectors.claudePage);
        cy.url().should('include', selectors.loginPage);
        cy.validateLogo();
        cy.get(selectors.loginContainer).within(() => {
            cy.get(selectors.usernameText).should('have.attr', 'placeholder', 'Username');
            cy.get(selectors.passwordText).should('have.attr', 'placeholder', 'Password');
            cy.get(selectors.loginButton).should('have.text', 'Login');
        })
      })

      it('user is able to log in with valid credentials', () => {
          cy.login(credentials.username, credentials.password);
          cy.url().should('include', 'claude');
          cy.getCookie('session').should('exist');
      })
  })
    context('Login page shows errors correctly', () => {
      it('User is not able to log in with invalid username', () => {
        cy.login('test', credentials.password);
        cy.get(selectors.errorMessage)
          .should("be.visible")
          .and("include.text", "Invalid credentials");
      })

      it('User is not able to log in with invalid password', () => {
        cy.login(credentials.username, "TestPassword");
        cy.get(selectors.errorMessage)
          .should("be.visible")
          .and('include.text', "Invalid credentials");
      })

      it('User is not able to log in with no credentials', () => {
        cy.visit(selectors.loginPage);
        cy.get(selectors.loginButton).click();
        cy.get(selectors.errorMessage)
          .should("be.visible")
          .and("include.text", "Invalid credentials");
      })
    })
});

