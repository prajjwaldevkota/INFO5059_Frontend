describe('Vendor update test', () => {
  it('visits the Vendor page and updates an Vendor', () => {
    cy.visit('/');
    cy.get('button').click();
    cy.contains('a', 'vendor').click();
    cy.contains('Vendor').click();
    cy.get("[type='email']").clear();
    cy.get("[type='email']").type('testUpdateVendor@toronto.com');
    cy.get('form').submit();
    cy.contains('updated!');
  });
});
