describe('Vendor page test', () => {
  it('Visits the Vendor project page', () => {
  cy.visit('/');
  cy.get('button').click();
  cy.contains('a', 'vendor').click();
  cy.contains('Vendors loaded!!');
  });
  });
