export {};

const viewports = [
  { name: 'Mobile', width: 375, height: 667 },
  { name: 'Desktop', width: 1280, height: 720 },
];

describe('Register & Authentication', () => {
  viewports.forEach((viewport) => {
    context(`Viewport: ${viewport.name}`, () => {
      beforeEach(() => {
        cy.viewport(viewport.width, viewport.height);
        cy.visit('/en/register');
      });

      it('should load the page without errors', () => {
        cy.get('form').should('exist');
        cy.get('body').should('not.contain', 'Application error');
      });

      it('should show validation errors when submitting empty form', () => {
        cy.get('button[type="submit"]').click({ force: true });
        
        cy.get('form').then(($form) => {
          if ($form.find(':invalid').length > 0) {
            cy.get(':invalid').should('exist');
          } else {
            cy.get('form').contains(/required|error|invalid/i).should('exist');
          }
        });
      });

      it('should handle input correctly', () => {
        cy.get('input[id="name"]').type('John Doe').should('have.value', 'John Doe');
        cy.get('input[type="email"]').type('test@example.com').should('have.value', 'test@example.com');
        cy.get('input[type="password"]').type('password123').should('have.value', 'password123');
      });

      it('should successfully login/register and redirect (Happy Path)', () => {
        cy.intercept('POST', '/api/auth/**', {
          statusCode: 200,
          body: { session: { user: { email: 'test@example.com' } } }
        }).as('authSuccess');

        cy.get('input[id="name"]').type('John Doe');
        cy.get('input[type="email"]').type('test@example.com');
        cy.get('input[type="password"]').type('password123');
        cy.get('button[type="submit"]').click();

        cy.url().should('match', /\/en\/overview/);
      });
    });
  });
});
