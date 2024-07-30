describe('Module Management Page', () => {
    beforeEach(() => {
        cy.visit('/auth/sign-in');

        cy.get('input[type="text"][name="username"]').type('0101010101');
        cy.get('input[type="password"][name="password"]').type('2023');
        cy.get('button[type="button"]').click();

        cy.url().should('include', '/settings/modules');
        cy.visit('/settings/modules');
    });

    it('displays the module management interface with required elements', () => {
        cy.get('app-breadcrumb').should('be.visible');
        cy.get('.imako-card h3').contains('FormModule.BODY_TITLE').should('be.visible');
        cy.get('button').contains('LABEL_EXPORT').should('be.visible');
        cy.get('button').contains('LABEL_REFRESH').should('be.visible');
        cy.get('input[type="text"]').should('have.attr', 'placeholder', 'PLACEHOLDER_SEARCH');
    });

    it('allows interaction with the refresh and export buttons', () => {
        cy.get('button').contains('LABEL_REFRESH').click();
        cy.get('button').contains('LABEL_EXPORT').click();
    });

    it('should open the add module dialog', () => {
        cy.get('button').contains('TITLE_MODAL.STORE').click();
        cy.get('.modal-class-name').should('be.visible');
    });

    it('allows searching for a module', () => {
        cy.get('input[type="text"]').type('searchQuery');
    });

    it('performs actions on individual modules', () => {
        cy.get('.p-button-secondary').first().click();
        cy.get('.p-button-danger').first().click();
    });

    it('checks for no data message when there are no modules', () => {
        cy.get('.text-center').contains('NO_DATA').should('be.visible');
    });
});
