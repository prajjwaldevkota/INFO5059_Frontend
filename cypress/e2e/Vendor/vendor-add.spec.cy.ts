describe('Vendor add test', () => {
  it('visits the Vendor page and adds an vendor', () => {
    cy.visit('/');
    cy.get('button').click();
    cy.contains('a', 'vendor').click();
    cy.contains('control_point').click();
    cy.get('input[formcontrolname=name')
      .click({ force: true })
      .type('Test Vendor');
    cy.get('input[formcontrolname=phone')
      .click({ force: true })
      .type('(222)222-5555');
    cy.get('input[formcontrolname=address1')
      .click({ force: true })
      .type('999 Test St');
    cy.get('input[formcontrolname=city').click({ force: true }).type('Toronto');
    cy.get('mat-select[formcontrolname="province"]').click({ force: true });
    cy.get('mat-option').contains('Ontario').click();
    cy.get('input[formcontrolname=postalcode')
      .click({ force: true })
      .type('T1T1T1');
    cy.get('input[formcontrolname=email')
      .click({ force: true })
      .type('test@vendor.com');
    cy.get('button').contains('Save').click({force: true});
    cy.contains('added!');
  });
});
