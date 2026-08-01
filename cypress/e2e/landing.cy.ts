export {};

const viewports = [
  { name: 'Mobile', width: 375, height: 667 },
  { name: 'Desktop', width: 1280, height: 720 },
];

describe('Landing Page', () => {
  viewports.forEach((viewport) => {
    context(`Viewport: ${viewport.name}`, () => {
      beforeEach(() => {
        cy.viewport(viewport.width, viewport.height);
        cy.visit('/en/');
      });

      it('should load without errors and render layout', () => {
        cy.url().should('match', /\/en/);
        cy.get('body').should('not.contain', 'Application error');
      });

      it('should verify Hero section and CTA buttons exist', () => {
        cy.get('h1').should('exist');
        cy.get('a, button').filter(':contains("Sign In"), :contains("Get Started"), :contains("Register")').should('exist');
      });

      it('should navigate to correct routes from CTAs', () => {
        cy.get('a[href*="/register"], a[href*="/login"]').first().then(($link) => {
          if ($link.is(':visible')) {
            cy.wrap($link).click({ force: true });
            cy.url().should('match', /\/en\/(register|login)/);
          }
        });
      });

      it('should render the Footer', () => {
        cy.get('footer').should('exist');
      });
    });
  });
});
