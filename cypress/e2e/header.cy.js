describe('Header', () => {
  beforeEach(() => {
    cy.viewport(1000,1200);
    cy.visit('/');
  });

  it('Links work', () => {
    cy.get('#header').contains('Home').click();
    cy.contains('Period Summaries');

    cy.get('#header').contains('Categories').click();
    cy.contains('Categories');

    cy.get('#header').contains('Funds').click();
    cy.contains('Funds');

    cy.get('#header').contains('Accounts').click();
    cy.contains('Accounts');

    cy.get('#header').contains('Tools').click();
    cy.contains('Tools');

    cy.get('#header').contains('Settings').click();
    cy.contains('Settings');
  });

  it('Add Transaction opens and closes', () => {
    cy.get('#header').contains('Add Transaction').click();
    cy.get('#addTransactionPopup').should('exist');

    cy.get('#header').contains('Add Transaction').click();
    cy.get('#addTransactionPopup').should('not.exist');

    //closes when clicking on another header link
    cy.get('#header').contains('Add Transaction').click();
    cy.get('#header').contains('Home').click();
    cy.get('#addTransactionPopup').should('not.exist');

    cy.get('#header').contains('Add Transaction').click();
    cy.get('#header').contains('Categories').click();
    cy.get('#addTransactionPopup').should('not.exist');

    cy.get('#header').contains('Add Transaction').click();
    cy.get('#header').contains('Funds').click();
    cy.get('#addTransactionPopup').should('not.exist');

    cy.get('#header').contains('Add Transaction').click();
    cy.get('#header').contains('Accounts').click();
    cy.get('#addTransactionPopup').should('not.exist');

    cy.get('#header').contains('Add Transaction').click();
    cy.get('#header').contains('Tools').click();
    cy.get('#addTransactionPopup').should('not.exist');

    cy.get('#header').contains('Add Transaction').click();
    cy.get('#header').contains('Settings').click();
    cy.get('#addTransactionPopup').should('not.exist');
  });
})