export {};

const viewports = [
  // { name: 'Mobile', width: 375, height: 667 }, // Mobile viewport is commented out as requested
  { name: 'Desktop', width: 1280, height: 720 },
];

describe('Prediction Workflow Detailed Steps', () => {
  viewports.forEach((viewport) => {
    context(`Viewport: ${viewport.name}`, () => {
      beforeEach(() => {
        cy.viewport(viewport.width, viewport.height);
        cy.visit('/en/predict');
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
        
        // 2. List of Preprocessed Data
        ensureAccordionOpen(2);
        cy.get('div[data-slot="table-container"], .border-t').last().find('table').should('exist');
        
        // Click action button on top item
        cy.get('.border-t').last().find('table tbody tr, [role="row"]').first().find('button').first().click({ force: true });
        
        // 3. Training & Testing Data Split
        cy.wait(1000);
        // ensureAccordionOpen(3);
        // Expect 2 tables (train & test)
        cy.get('.border-t').last().find('table').should('have.length.at.least', 2);
      }

      const step2 = () => {
        step1();
        cy.wait(1000);

        cy.get('button').contains(/Next/i).click({ force: true });
        
        // 1. Data Specification
        ensureAccordionOpen(1);
        
        // 2. Input Features (Attributes)
        ensureAccordionOpen(2);
        cy.get('.border-t').last().should('exist');
        
        // 3. Target Variable
        ensureAccordionOpen(3);
        cy.get('.border-t').last().should('exist');
        
        // 4. Hyperparameter Configuration
        ensureAccordionOpen(4);
        
        // Ensure input fields have values > 0
        cy.get('.border-t').eq(1).find('input[type="number"]').each(($input) => {
          cy.wrap($input).should(($el) => {
            const val = parseFloat($el.val() as string);
            expect(val).to.be.gt(0);
          });
        });
        
        // Click Train Model
        cy.get('.border-t').last().find('button').contains(/Train/i).click();
      }

      const step3 = () => {
        step2();
        cy.wait(1000);

        cy.get('button').contains(/Next/i).click({ force: true });
        
        // 1. Tree Splitting
        ensureAccordionOpen(1);
        cy.get('.border-t').last().should('exist');
        
        // 2. Recursive Splitting (Model Tree Output)
        ensureAccordionOpen(2);
        cy.get('.font-mono').should('exist');
        
        // 3. Decision Tree Structure
        ensureAccordionOpen(3);
        cy.get('svg').last().should('exist');
      }

      const step4 = () => {
        step3();
        cy.wait(1000);

        cy.get('button').contains(/Next/i).click({ force: true });
        
        // 1. Inference Output
        ensureAccordionOpen(1);
        cy.get('.border-t').last().should('exist');
        
        // 2. Run Prediction
        ensureAccordionOpen(2);
        cy.get('.border-t').last().find('button').contains(/Predict/i).click();
        
        // 3. Generated Predictions (Upload Data)
        ensureAccordionOpen(3);
        cy.get('.border-t').last().find('button').contains(/Submit|Upload/i).should('be.visible');
      }

      it('should verify Step 1: Data Selection', () => {
        step1();
      });

      it('should verify Step 2: Data Specification', () => {
        step2()
      });

      it('should verify Step 3: Recursive Splitting', () => {
        step3()
      });

      it('should verify Step 4: Prediction Result', () => {
        step4();
      });
    });
  });
});
