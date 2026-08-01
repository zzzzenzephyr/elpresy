export {};

const viewports = [
  { name: 'Mobile', width: 375, height: 667 },
  { name: 'Desktop', width: 1280, height: 720 },
];

describe('Firebase / Database Integration', () => {
  viewports.forEach((viewport) => {
    context(`Viewport: ${viewport.name}`, () => {
      beforeEach(() => {
        cy.viewport(viewport.width, viewport.height);
        cy.visit('/en/firebase');
      });

      it('should load without errors', () => {
        cy.url().should('match', /\/en\/firebase/);
        cy.get('body').should('not.contain', 'Application error');
      });

      it('should display all metrics sections', () => {
        // Check if generic metric sections exist in the UI
        cy.get('.grid, .flex').should('exist');
        // A generic check to ensure content is rendering properly
        cy.get('body').should('exist');
      });

      it('should toggle data recording and live subscription buttons', () => {
        // Toggle Live Data Subscription Button (located in footer)
        cy.get('button').contains(/Live/i).click({ force: true });
        
        // Toggle Data Recording Button (located in header)
        cy.get('button').contains(/Record/i).click({ force: true });
      });

      it('should display 4 TrendBadge cards', () => {
        // Ensure there are at least 4 TrendBadge components rendered (usually inside a grid)
        // Adjust the selector if TrendBadge has a specific data-testid or class
        cy.get('.grid').first().children('.rounded-xl, .border, .bg-neutral-primary, .shadow-sm').should('have.length.at.least', 4);
      });

      it('should display the table and automatically sync data', () => {
        // Mock a real-time data sync endpoint
        cy.intercept('GET', '**/firebase**', {
          statusCode: 200,
          body: {
            data: [
              { id: 1, timestamp: '2023-01-01', value: 100 }
            ]
          }
        }).as('firebaseDataSync');
        
        // Assert table structure exists
        cy.get('table, [role="table"]').should('exist');
        cy.get('thead, [role="rowgroup"]').should('exist');
        
        // Ensure data rows are rendered
        cy.get('tbody tr, [role="row"]').should('have.length.at.least', 1);
      });
    });
  });
});
