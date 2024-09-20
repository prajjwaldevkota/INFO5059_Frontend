describe('Product add test', () => {
  it('visits the Prodcut page and adds a Product', () => {
    cy.visit('/');
    cy.get('button').click();
    cy.contains('a', 'Products').click();
    cy.contains('control_point').click();
    cy.get('input[formcontrolname="id"]').clear();
    cy.get('input[formcontrolname="id"]').type('AZ7764H');
    cy.get('mat-select[formcontrolname="vendorid"]').click({ force: true });
    cy.get('mat-option').contains('Prajjwal').click();
    cy.get('input[formcontrolname=name')
      .click({ force: true })
      .type('iPhone 16');
    cy.get('input[formcontrolname=costprice]').clear();
    cy.get('input[formcontrolname=costprice]').type('799.99');
    cy.get('input[formcontrolname=msrp]').clear();
    cy.get('input[formcontrolname=msrp]').type('850.99');
    cy.get('.mat-expansion-indicator').eq(0).click();
    cy.get('.mat-expansion-indicator').eq(1).click();
    cy.get('input[formcontrolname=rop]').clear();
    cy.get('input[formcontrolname=rop]').type('10');
    cy.get('input[formcontrolname=eoq]').clear();
    cy.get('input[formcontrolname=eoq]').type('4');
    cy.get('input[formcontrolname=qoh]').clear();
    cy.get('input[formcontrolname=qoh]').type('15');
    cy.get('input[formcontrolname=qoo]').clear();
    cy.get('input[formcontrolname=qoo]').type('100');
    cy.get('button').contains('Save').click();
    cy.contains('added!');
  });
});
