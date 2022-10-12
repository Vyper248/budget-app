describe('Add Transaction', () => {
  beforeEach(() => {
    cy.viewport(1000,1200);
    cy.visit('/');
  });

  it('Allows adding money to a fund', () => {
    cy.get('#header').contains('Add Transaction').click();
    cy.get('#addTransactionPopup #type').select('Add to Fund');
    cy.get('#addTransactionPopup #amount').type(55);
    cy.get('#addTransactionPopup #fund').select('Savings');
    cy.get('#addTransactionPopup #saveTransaction').click();
    cy.get('.trValue').contains('£55.00');
    cy.get('.highlighted').contains('£55.00');
  });
})