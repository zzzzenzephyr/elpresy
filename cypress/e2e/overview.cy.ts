export {};

const viewports = [
  { name: 'Mobile', width: 375, height: 667 },
  { name: 'Desktop', width: 1280, height: 720 },
];

describe('Overview Page', () => {
  viewports.forEach((viewport) => {
    context(`Viewport: ${viewport.name}`, () => {
      beforeEach(() => {
        cy.viewport(viewport.width, viewport.height);
        cy.visit('/en/overview');
      });

      it('should load without errors on browser', () => {
        cy.url().should('match', /\/en\/overview/);
        cy.get('body').should('not.contain', 'Application error');
        cy.get('body').should('not.contain', 'Internal Server Error');
      });

      it('should render main components: header, cards, charts, and tables', () => {
        cy.get('h1').should('exist');
        cy.get('.rounded-xl').should('exist');
        cy.get('svg, canvas, .recharts-wrapper').should('exist');
        cy.get('table, [role="table"], .grid').should('exist');
      });

      it('should display data according to layout structure', () => {
        cy.get('nav').should('exist');
        cy.get('.flex.flex-col').should('exist');
        cy.get('.flex.flex-col.gap-6').children().should('have.length.at.least', 1);
      });

      it('should test navigation, buttons, and interactive elements', () => {
        cy.get('nav a').should('exist').and('have.length.greaterThan', 0);
        
        if (viewport.name === 'Desktop') {
          cy.get('nav a[href*="/"]').not('[href*="/overview"]').first().then(($link) => {
            if ($link.is(':visible')) {
              cy.wrap($link).click({ force: true });
              cy.url().should('not.include', '/overview');
            }
          });
        }
      });
    });
  });
});
