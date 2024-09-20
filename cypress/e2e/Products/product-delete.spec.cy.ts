describe('Product update test', () => {
  it('visits the product page and update a product', () => {
    cy.visit('/');
    cy.get('button').click();
    cy.contains('a', 'Products').click();
    cy.get("td").last().click();
    cy.get('button').contains('Delete').click();
    cy.contains('deleted!');
  });
});
