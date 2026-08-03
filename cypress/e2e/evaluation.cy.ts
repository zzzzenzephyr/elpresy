export {};

const viewports = [
  // { name: 'Mobile', width: 375, height: 667 }, // Mobile viewport is commented out
  { name: 'Desktop', width: 1280, height: 720 },
];

describe('Evaluation Workflow Detailed Steps', () => {
  viewports.forEach((viewport) => {
    context(`Viewport: ${viewport.name}`, () => {
      beforeEach(() => {
        cy.viewport(viewport.width, viewport.height);
        
        // Mock data to ensure tables render
        cy.intercept('GET', '**/firebase**', {
          statusCode: 200,
          body: {
            data: [
              { id: 1, last_updated: '1700000000000', voltage: 220, current: 5, power_watt: 1100 },
              { id: 2, last_updated: '1700000006000', voltage: 230, current: 4, power_watt: 920 },
              { id: 3, last_updated: '1700000008000', voltage: 240, current: 6, power_watt: 1440 },
            ]
          }
        }).as('firebaseData');
        
        cy.visit('/en/evaluation');
      });

      const ensureAccordionOpen = (seq: number) => {
        // Find the sequence number circle, go up to the button
        cy.get('.w-8.h-8').contains(new RegExp(`^${seq}$`)).parents('button').then(($btn) => {
          // If chevron is NOT rotated, it's closed, so we click it
          if (!$btn.find('.rotate-90').length) {
            cy.wrap($btn).click({ force: true });
            cy.wait(300);
          }
        });
      };

      const step1 = () => {
        // 1. Data Selection
        ensureAccordionOpen(1);
        cy.get('body').should('exist');
        
        // 2. List of Predicted Data
        ensureAccordionOpen(2);
        cy.get('div[data-slot="table-container"], .border-t').last().find('table').should('exist');
        
        // Click action button on top item
        cy.get('.border-t').last().find('table tbody tr, [role="row"]').first().find('button').first().click({ force: true });
        
        cy.wait(1000);
        
        // 3. Preview Selected Predictions
        ensureAccordionOpen(3);
        cy.get('.border-t').last().find('table').should('exist');
      };

      const step2 = () => {
        step1();
        cy.wait(1000);

        cy.get('button').contains(/Next/i).click({ force: true });
        
        // 1. Evaluation Metrics
        ensureAccordionOpen(1);
        
        // 2. Calculate Metrics
        ensureAccordionOpen(2);
        cy.get('.border-t').last().find('button').contains(/Calculate Metrics/i).click({ force: true });
        cy.wait(1000);
        
        // 3. Evaluation Results
        ensureAccordionOpen(3);
        // Assert 4 title boxes exist
        cy.get('.border-t').last().contains(/Avg Actual Power/i).should('exist');
        cy.get('.border-t').last().contains(/Mean Absolute Error/i).should('exist');
        cy.get('.border-t').last().contains(/Root Mean Sq Error/i).should('exist');
        cy.get('.border-t').last().contains(/R-Squared/i).should('exist');
      };

      const step3 = () => {
        step2();
        cy.wait(1000);

        cy.get('button').contains(/Next/i).click({ force: true });
        
        // 1. Residual Analysis
        ensureAccordionOpen(1);
        
        // 2. Actual vs Predicted Visualization
        ensureAccordionOpen(2);
        // Ensure svg tag exists
        cy.get('.border-t').last().find('svg').should('exist');
      };

      const step4 = () => {
        step3();
        cy.wait(1000);

        cy.get('button').contains(/Next/i).click({ force: true });
        
        // 1. 1-Feature vs 2-Feature
        ensureAccordionOpen(1);
        
        // 2. Run Feature Comparison
        ensureAccordionOpen(2);
        cy.get('.border-t').last().find('button').contains(/Run Comparison/i).click({ force: true });
        cy.wait(2000);
        
        // 3. Comparison Results
        ensureAccordionOpen(3);
        cy.get('.border-t').last().find('table').should('exist');
      };

      const step5 = () => {
        step4();
        cy.wait(1000);

        cy.get('button').contains(/Next/i).click({ force: true });
        
        // 1. Validation Checklist (Explanation)
        ensureAccordionOpen(1);
        
        // 2. Validation Checklist (Items)
        ensureAccordionOpen(2);
        // Assert there are 3 boxes with sequence numbers 1-3
        cy.get('.border-t').last().contains(/1\./).should('exist');
        cy.get('.border-t').last().contains(/2\./).should('exist');
        cy.get('.border-t').last().contains(/3\./).should('exist');
        
        // 3. Save Evaluation Results
        ensureAccordionOpen(3);
        // Ensure Save Evaluation (or Upload) button is visible
        cy.get('.border-t').last().find('button').contains(/Save|Upload/i).should('be.visible');
      };

      it('should verify Step 1: Data Selection', () => {
        step1();
      });

      it('should verify Step 2: Model Evaluation', () => {
        step2();
      });

      it('should verify Step 3: Scatter Plot Residual', () => {
        step3();
      });

      it('should verify Step 4: Model Comparison', () => {
        step4();
      });

      it('should verify Step 5: Success Criteria', () => {
        step5();
      });
    });
  });
});
