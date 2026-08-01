# Cypress E2E Testing Guide for ELPRESY

This document serves as the single source of truth for End-to-End (E2E) testing using Cypress across the ELPRESY application. AI agents or human developers writing tests must follow these detailed instructions to ensure comprehensive coverage, reliability, and proper functionality validation for each page.

## Global Testing Requirements

For **every** page in the application, the following tests MUST be implemented:
1. **Successful Page Load Without Errors:** The page must load with a `200` status code and no uncaught JavaScript exceptions in the console (`cy.on('uncaught:exception', () => false)` should be used sparingly and only for known third-party issues).
2. **Accessibility & Responsive Design:** Test that the page renders correctly on multiple viewport sizes (e.g., mobile `viewport(375, 667)` and desktop `viewport(1280, 720)`).
3. **Multilingual/Locale Routing:** Ensure the page loads properly when accessed via locale prefixes (e.g., `/en/overview` and `/id/overview`). **IMPORTANT:** All Cypress tests `cy.visit()` calls MUST include a valid locale (e.g., `/en/` or `/id/`) to prevent Next.js routing errors.
4. **Layout Verification:** Ensure the global shell (Navbar, Sidebar, Footer) is present and functional where appropriate.

---

## Page-Specific Testing Requirements

### 1. Landing Page (`/en/`)
- **Core Functionality:** Ensure the public-facing landing page successfully explains the product and provides entry points.
- **What to Test:**
  - Verify the page loads (`cy.visit('/en/')`) without authentication.
  - Check for the existence and visibility of the Hero section.
  - Verify that the primary Call to Action (CTA) buttons exist (e.g., "Get Started", "Sign In").
  - Click the CTA buttons and assert they navigate to the correct routes (e.g., `/en/register` or `/en/overview`).
  - Verify the Footer and its links load without error.

### 2. Register & Authentication (`/en/register`)
- **Core Functionality:** User onboarding and secure access.
- **What to Test:**
  - Verify the page loads (`cy.visit('/en/register')`) and the registration/login form is visible.
  - **Form Validation:** Submit the form empty and assert that validation error messages appear for required fields (e.g., email, password).
  - **Input Handling:** Type into the email and password fields and verify their values update correctly.
  - **Authentication Flow (Mocking):** Intercept the authentication API request (`cy.intercept()`) to mock a successful login, submit the form, and assert that the user is redirected to the `/en/overview` dashboard.
  - **Error Handling:** Mock a failed login (e.g., invalid credentials) and assert that an error toast or message is displayed to the user.

### 3. Dashboard Overview (`/en/overview`)
- **Core Functionality:** The main authenticated hub summarizing product activity.
- **What to Test:**
  - **Auth Guard:** Attempt to visit `/en/overview` while unauthenticated and assert that the application redirects to the login page (`/en/register` or `/en/login`).
  - **Page Content:** Mock a valid session and visit `/en/overview`. Assert that the page loads successfully.
  - **Summary Metrics:** Verify that summary cards (e.g., total predictions, average metrics) are visible and contain data (mock the API response to ensure consistent data).
  - **Charts:** Verify that the main overview charts or tables render in the DOM (e.g., check for `<canvas>` or specific chart container classes).
  - **Navigation:** Test the sidebar or top navigation links to ensure they route correctly to `/en/predict`, `/en/evaluation`, etc.

### 4. Prediction Workflow (`/en/predict`)
- **Core Functionality:** The primary feature for generating simulated electricity predictions.
- **What to Test:**
  - **Page Load:** Ensure the prediction input form loads correctly (`cy.visit('/en/predict')`).
  - **Input Validation:** Try to submit the prediction form with missing or invalid parameters (e.g., missing dates, invalid numbers) and assert that error messages are shown.
  - **Successful Prediction:** 
    - Fill in all required form fields with valid data.
    - Intercept the prediction API call and provide a mock successful response.
    - Submit the form and assert that a loading state (spinner/skeleton) is temporarily visible.
    - Assert that the prediction results (tables, charts, or summary cards) are rendered on the screen after the mock API resolves.
  - **Save Functionality:** Click the "Save Prediction" button, mock the database save endpoint, and assert that a success notification (toast) is displayed.

### 5. Evaluation & Metrics (`/en/evaluation`)
- **Core Functionality:** Viewing the quality and accuracy of saved predictions based on canonical thresholds.
- **What to Test:**
  - **Page Load:** Verify the evaluation page loads successfully for an authenticated user (`cy.visit('/en/evaluation')`).
  - **Metrics Display:** Assert that the canonical metrics are visible: **MSE, MAE, RMSE, and R²**.
  - **Threshold Interpretation UI:** 
    - Mock API data with an $R^2 \geq 0.85$ and $MAE \leq 10\%$. Assert that the UI reflects a "good/acceptable" state (e.g., green indicators or positive text).
    - Mock API data with an $R^2 < 0.85$ and $MAE > 10\%$. Assert that the UI reflects a "poor/unacceptable" state (e.g., red indicators, warning text).
  - **Data Visualization:** Ensure that evaluation charts or comparative tables render correctly based on the mocked data.

### 6. Preprocessing (`/en/preprocessing`)
- **Core Functionality:** Managing, viewing, and preparing datasets for prediction.
- **What to Test:**
  - **Page Load:** Verify the preprocessing page loads without error (`cy.visit('/en/preprocessing')`).
  - **Data Table:** Verify that the data table component renders and displays rows of data (using mocked data).
  - **Interactions:** Test table pagination, sorting, or filtering if applicable. Assert that the DOM updates correctly when a filter is applied.
  - **Data Upload/Selection:** If there is a file upload or dataset selection feature, test the interaction flow (e.g., clicking the select button opens the appropriate modal or input).

### 7. Firebase / Database Integration (`/en/firebase`)
- **Core Functionality:** Managing remote database sync, logs, or system statuses.
- **What to Test:**
  - **Page Load:** Ensure the page loads without error (`cy.visit('/en/firebase')`).
  - **Status Indicators:** Mock successful and failed database connection states. Assert that the UI accurately displays "Connected" or "Disconnected/Error" based on the mock.
  - **Action Buttons:** Test any sync or manual trigger buttons to ensure they send the correct API requests and show loading states during the process.

---

## Best Practices for AI Agents Writing Tests
- **Use `cy.intercept()` Heavily:** Do not rely on live production databases for E2E tests. Always mock API responses for `/predict`, `/evaluation`, and authentication to ensure tests are deterministic, fast, and flake-free.
- **Use `data-testid` Attributes:** When selecting elements, prefer `cy.get('[data-testid="submit-button"]')` over brittle CSS selectors or text contents that might change across translations.
- **Test the "Unhappy Path":** Always include tests for network failures (mock a `500` error) and verify the UI handles it gracefully without crashing the page.
