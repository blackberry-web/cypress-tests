import selectors from '../support/selectors.js';

Cypress.Commands.add('login', (username, password) => {
        cy.visit(selectors.loginPage);
        cy.get(selectors.username).type(username);
        cy.get(selectors.password).type(password);
        cy.get(selectors.loginButton).click();
})

Cypress.Commands.add('validateLogo', () => {
        cy.get(selectors.logo).should('contain', 'AI');
        cy.get('h1').should('contain', 'Company');
})