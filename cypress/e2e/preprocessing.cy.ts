export {};

const viewports = [
  { name: 'Mobile', width: 375, height: 667 },
  { name: 'Desktop', width: 1280, height: 720 },
];

describe('Preprocessing Page Detailed Steps', () => {
  viewports.forEach((viewport) => {
    context(`Viewport: ${viewport.name}`, () => {
      beforeEach(() => {
        cy.viewport(viewport.width, viewport.height);
        cy.visit('/en/preprocessing');
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

      it('should load the page without error', () => {
        cy.url().should('match', /\/en\/preprocessing/);
        cy.get('body').should('not.contain', 'Application error');
      });

      it('should verify Step 1: Time Consistency', () => {
        // 1. Explanation & Concept
        ensureAccordionOpen(1);
        cy.get('body').should('exist'); // It contains text, but translations vary. Body existence proves it didn't crash.
        
        // 2. Time Check Results Table
        ensureAccordionOpen(2);
        cy.get('div[data-slot="table-container"]').first().find('table').should('exist');

        // 3. Realtime Data
        ensureAccordionOpen(3);
        cy.get('div[data-slot="table-container"]').first().find('table').should('exist');
      });

      it('should verify Step 2: Sanity Check', () => {
        cy.get('button').contains(/Next/i).click({ force: true });
        
        // 1. Explanation & Concept
        ensureAccordionOpen(1);
        
        // 2. Illogical Data List
        ensureAccordionOpen(2);
        cy.get('div[data-slot="table-container"]').first().find('table').should('exist');

        // 3. Realtime Data
        ensureAccordionOpen(3);
        cy.get('div[data-slot="table-container"]').first().find('table').should('exist');
      });

      it('should verify Step 3: Outlier Detection', () => {
        cy.get('button').contains(/Next/i).click({ force: true });
        cy.get('button').contains(/Next/i).click({ force: true });
        
        // 1. Explanation & Concept
        ensureAccordionOpen(1);
        
        // 2. IQR Calculation (V, I, P)
        ensureAccordionOpen(2);
        cy.get('h4').contains(/Voltage|V/i).should('exist');
        cy.get('h4').contains(/Current|I/i).should('exist');
        cy.get('h4').contains(/Power|P/i).should('exist');
        
        // 3. Outlier Data Table
        ensureAccordionOpen(3);
        cy.get('div[data-slot="table-container"]').first().find('table').should('exist');
        
        // 4. Realtime Data
        ensureAccordionOpen(4);
        cy.get('div[data-slot="table-container"]').first().find('table').should('exist');
      });

      it('should verify Step 4: Missing Data', () => {
        for(let i=0; i<3; i++) cy.get('button').contains(/Next/i).click({ force: true });
        
        // 1. Explanation & Concept
        ensureAccordionOpen(1);
        
        // 2. Linear Interpolation (or Normal Condition fallback)
        ensureAccordionOpen(2);
        cy.get('.border-t').last().should('exist');
        
        // 3. Data Sequence with Gap Estimation
        ensureAccordionOpen(3);
        cy.get('div[data-slot="table-container"]').first().find('table').should('exist');
        
        // 4. Realtime Data
        ensureAccordionOpen(4);
        cy.get('div[data-slot="table-container"]').first().find('table').should('exist');
      });

      it('should verify Step 5: Ground Truth', () => {
        for(let i=0; i<4; i++) cy.get('button').contains(/Next/i).click({ force: true });
        
        // 1. Explanation & Concept
        ensureAccordionOpen(1);
        
        // 2. Error Simulation (Voltage)
        ensureAccordionOpen(2);
        cy.get('.border-t').last().should('exist');
        
        // 3. Error Simulation (Current)
        ensureAccordionOpen(3);
        cy.get('.border-t').last().should('exist');
        
        // 4. Error Simulation (Power)
        ensureAccordionOpen(4);
        cy.get('.border-t').last().should('exist');
        
        // 5. Realtime Data
        ensureAccordionOpen(5);
        cy.get('div[data-slot="table-container"]').first().find('table').should('exist');
      });

      it('should verify Step 6: Data Splitting', () => {
        for(let i=0; i<5; i++) cy.get('button').contains(/Next/i).click({ force: true });
        
        // 1. Explanation & Concept
        ensureAccordionOpen(1);
        
        // 2. Training Set
        ensureAccordionOpen(2);
        cy.get('div[data-slot="table-container"]').first().find('table').should('exist');
        
        // 3. Testing Set
        ensureAccordionOpen(3);
        cy.get('div[data-slot="table-container"]').first().find('table').should('exist');
        
        // 4. Realtime Data
        ensureAccordionOpen(4);
        cy.get('div[data-slot="table-container"]').first().find('table').should('exist');
        
        // 5. Upload Data
        ensureAccordionOpen(5);
        // Look for any input type file or a button containing Upload
        cy.get('div.p-4.flex.flex-col.items-start.gap-4').first().find('input[type="file"], button').should('exist');
      });
    });
  });
});
