describe('vendor delete test', () => {
  it('visits the vendor page and deletes an vendor', () => {
    cy.visit('/');
    cy.get('button').click();
    cy.contains('a', 'vendor').click();
    cy.contains('Vendor').click();
    cy.get('button').contains('Delete').click();
    cy.contains('deleted!');
  });
});
