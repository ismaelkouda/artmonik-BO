describe('SignInFormComponent', () => {
    beforeEach(() => {
        cy.visit('/auth/sign-in');
    });

    it('displays the login form with all required elements', () => {
        cy.get('.imako__form-title').should('contain', 'Connexion');
        cy.get('input[type="text"][name="username"]').should('be.visible');
        cy.get('input[type="password"][name="password"]').should('be.visible');
        cy.get('input[type="checkbox"][name="checkbox"]').should('be.visible');
        cy.get('button[type="button"]').should('be.disabled');
    });

    it('enables the login button when username and password are provided', () => {
        cy.get('input[type="text"][name="username"]').type('testuser');
        cy.get('input[type="password"][name="password"]').type('testpassword');
        cy.get('button[type="button"]').should('not.be.disabled');
    });

    it('handles login attempt', () => {
        cy.get('input[type="text"][name="username"]').type('testuser');
        cy.get('input[type="password"][name="password"]').type('testpassword');
        cy.get('button[type="button"]').click();

        cy.get('.backdrop').should('be.visible');
    });

    it('navigates to forgot password page', () => {
        cy.get('a.forgot-pass').click();
        cy.url().should('include', '/auth/forgot-password');
    });
});
