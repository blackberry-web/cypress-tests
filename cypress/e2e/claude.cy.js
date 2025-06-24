import { getQuestion } from 'random-questions';
import selectors from '../support/selectors.js';

describe('Claude is available and responding correctly', () => {
    beforeEach(() => {
      cy.login(Cypress.env('loginEmail'), Cypress.env('loginPassword'))
    })

  it('main page is successfully displayed', () => {
    cy.validateLogo();
    cy.get(selectors.aiInput).should('contain', 'Claude Input');
    cy.get(selectors.userInput).should('exist');
    cy.get(selectors.dropdown).should('contain', 'Show .prompt files');
    cy.get(selectors.promptFiles).should('contain', 'Prompt files:');
    cy.get(selectors.dataExamplesButton)
      .should('have.attr', 'onclick', 'showDataExamples()')
      .should('be.disabled');
    cy.contains('Claude link').should('have.attr', 'href');
    cy.contains('Send to Claude').should('have.attr', 'onclick', 'sendBedrockRequest()');
    cy.contains('Claude Output:').should('be.visible');
  })

  it('AI responds to the descriptive questions', () => {
    for(let i = 0; i < 10; i++){
      const question = getQuestion();
      cy.get(selectors.userInput).type(question);
      cy.get(selectors.sendButton).click();
      cy.get(selectors.aiResponse, { timeout: 10000 })
        .should('be.visible')
        .should('not.be.empty')
      cy.get(selectors.userInput).clear();
    }
  })

  it('AI responds to the calculative questions', () => {
    cy.fixture('calculation_questions').then(questions => {
      questions.forEach((question) => {
      for (const [key, value] of Object.entries(question)) {
        cy.get(selectors.userInput).type(`Please calculate:${key}`);
        cy.get(selectors.sendButton).click();
        cy.get(selectors.aiResponse, { timeout: 10000 })
          .should('be.visible')
          .should('not.be.empty')
          .should('contain', `${value}`);
        cy.get(selectors.userInput).clear();
     }
    })
   })
  })

  it('input from prompt files is working correctly', () => {
    let promptText;
    cy.get(selectors.dropdown).click();
    cy.get(selectors.promptFiles)
      .select(1)
      .should('have.value', 'short_cart_name.prompt')
    cy.contains('Data examples')
      .should('not.be.disabled')
      .click();
    cy.get(selectors.dataSelect)
      .should('be.visible')
      .select(1)
      .invoke('val')
      .as('dataExamplesValue');
    cy.get(selectors.fileContent)
      .then(($el) => {
        promptText = $el.text();
      })
    cy.get(selectors.copyButton).click();
    cy.get(selectors.userInput)
      .invoke('val')
      .as('inputText');
    
    cy.get('@inputText').then(inputText => {
      const input = inputText.replace(/[\n]+/g,'');
      expect(promptText).to.equal(input);
      cy.get('@dataExamplesValue').then(value => {
        expect(promptText).to.include(value);
      })
    });

    cy.get(selectors.sendButton).click();
    cy.get(selectors.aiResponse, { timeout: 10000 })
      .should('be.visible')
      .should('not.be.empty')
      .should('contain', '<cartname>')
      .and('contain', '</cartname>')
      .then(($val) => {
        const responseText = $val.text();
        expect(responseText.split(' ').length).to.be.within(2, 5);
      })
 })
})