describe('Product update test', () => {
  it('visits the product page and update a product', () => {
    cy.visit('/');
    cy.get('button').click();
    cy.contains('a', 'Products').click();
    cy.get("td").last().click();
    cy.get('input[formcontrolname=name').click({ force: true }).clear();
    cy.get('input[formcontrolname=name')
      .click({ force: true })
      .type('iPhone 16 plus');
    cy.get('button').contains('Save').click();
    cy.contains('updated!');
  });
});
