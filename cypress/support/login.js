import { locators } from "../support/locators";

Cypress.Commands.add("SignIntoTheApplication", function () {
  cy.visit("/");
  cy.contains("button", "Login").click({ force: true });
  cy.findAllByPlaceholderText("name@example.com")
    .first()
    .type("johnsonoketa+90@africhange.com");
  cy.findAllByPlaceholderText("Your password").first().type("P@ssword1");
  cy.contains("button", "Continue").click();
  cy.get("h4.dashboard-header-title")
    .should("be.visible")
    .and("contain.text", "Hello, Mike");

  //Logout from the application

  //cy.get(locators.SignUp.LogOutModal).click();
});

Cypress.Commands.add("logout", () => {
  // Command to perform logout by clicking the 'Logout' span
  cy.contains("span", "Logout").click({ force: true });

  // After logging out, you can assert the user is redirected to the login page
  cy.url().should("include", "/login");
  cy.get("h3.login-title")
    .should("be.visible")
    .and("contain.text", "Login to your Africhange Business account");

  cy.log("User successfully logged out.");
});

Cypress.Commands.add("NavigateToWallet", function () {
  cy.get('a[href="/wallet"]').click(); // Click the Wallet link
  cy.url().should("include", "/wallet"); // Verify that the URL includes /wallet
  cy.get("span").contains("Wallet").should("be.visible"); // Check that the "Wallet" section is visible
  cy.log("Navigated to Wallet");
});
Cypress.Commands.add("NavigateToSendMoney", function () {
  cy.get('a[href="/send-money"]').click(); // Click the Send Money link
  cy.url().should("include", "/send-money"); // Verify that the URL includes /send-money
  cy.get("span").contains("Send Money").should("be.visible"); // Check that the "Send Money" section is visible
  cy.log("Navigated to Send Money");
});
Cypress.Commands.add("NavigateToTransactionHistory", function () {
  cy.get('a[href="/transaction-history"]').click(); // Click the Transaction History link
  cy.url().should("include", "/transaction-history"); // Verify that the URL includes /transaction-history
  cy.get("span").contains("Transaction History").should("be.visible"); // Check that the "Transaction History" section is visible
  cy.log("Navigated to Transaction History");
});
Cypress.Commands.add("Logout", function () {
  cy.get("a.logout").click(); // Click the Logout button
  cy.url().should("include", "/login"); // Verify that after logout, the user is redirected to the login page
  cy.get('button[type="submit"]').should("contain", "Login"); // Check that the login button is visible after logout
  cy.log("User logged out");
  cy.get("a.logout").click();

  // Assert that after logging out, the URL includes '/login'
  cy.url().should("include", "/login");

  cy.log("User successfully logged out.");
});

Cypress.Commands.add("CheckTodaysRate", function () {
  cy.get(".todays-rate").should("be.visible"); // Check if the Today’s Rate section is visible
  cy.get(".rate")
    .invoke("text")
    .then((rate) => {
      cy.log(`Today's Rate: ${rate.trim()}`);
    });
});

Cypress.Commands.add(
  "System should not allow login with invalid credentials",
  function () {
    cy.visit("/");
    cy.contains("button", "Login").click({ force: true });
    cy.findAllByPlaceholderText(locators.SignUp.UserEmail)
      .first()
      .type(locators.SignUp.WrongEmail);
    cy.findAllByPlaceholderText(locators.SignUp.PasswordSpace)
      .first()
      .type(locators.SignUp.Password);
    cy.contains("button", "Continue").click();

    // Scroll into view, increase the timeout and verify the error message
    cy.get(".error-toast-text", { timeout: 10000 })
      .scrollIntoView()
      .should("be.visible")
      .and("contain.text", "Email or password is incorrect");
  }
);
Cypress.Commands.add("NavigateToDashboard", function () {
  cy.get('a[href="/dashboard"]').within(() => {
    cy.get("span")
      .contains("Dashboard", { matchCase: false })
      .should("be.visible"); // Ensure Dashboard is visible
    // Assert that the URL includes '/dashboard'
    cy.url().should("include", "/dashboard");
    cy.log("Navigated and asserted the Dashboard section.");
  });
});
Cypress.Commands.add("AssertCADAddFunds", function () {
  cy.get(".rates-container").within(() => {
    // Asserting the CAD Rate is displayed properly
    cy.get(".rates")
      .contains("CAD", { matchCase: false })
      .should("be.visible")
      .and("contain.text", "1 CAD");

    // Assert that the 'Add Funds' button for CAD is visible
    cy.get("button")
      .contains("Add Funds", { matchCase: false })
      .should("be.visible")
      .and("not.be.disabled");

    cy.log("CAD Add Funds button and rate asserted successfully.");
  });
});

Cypress.Commands.add("AssertNGNAddFunds", function () {
  cy.get(".rates-container").within(() => {
    // Asserting the NGN Rate is displayed properly
    cy.get(".rates")
      .contains("NGN", { matchCase: false })
      .should("be.visible")
      .and("contain.text", "1 NGN");

    // Assert that the 'Add Funds' button for NGN is visible
    cy.get("button")
      .contains("Add Funds", { matchCase: false })
      .should("be.visible")
      .and("not.be.disabled");

    cy.log("NGN Add Funds button and rate asserted successfully.");
  });
});

Cypress.Commands.add("verifyChatButtonFunctionality", function () {
  // Verify the chat button is visible and has the correct aria-label attribute
  cy.get('button[aria-label="Open messaging window"]')
    
    .and("have.attr", "aria-label", "Open messaging window") // Check the aria-label

    // Click the button to open the chat window
    .click()
    .then(() => {
      // Verify that the chat window opens successfully after clicking the button
      cy.get(this.sme.chatWindow)
        .should("be.visible") // Ensure the chat window is visible
        .within(() => {
          // Optionally, verify the presence of elements within the chat window
          cy.get(this.sme.chatInput)
            .should("be.visible") // Chat input should be visible
            .and("have.attr", "placeholder", "Type your message here"); // Check for placeholder

          // Check for send button inside the chat window
          cy.get(this.sme.chatSendButton)
            .should("be.visible") // Ensure the send button is visible
            .and("contain.text", "Send"); // Ensure it contains 'Send' text
        });
    });
});

Cypress.Commands.add("verifyWalletCardElementsForCAD", function () {
  // Assert the "Add Fund" button is visible and clickable
  cy.get("button#btn-id-867")
    .and("contain.text", "Add Fund")
    .click(); // Click the button

  // Optionally, verify the next steps after clicking
  cy.url().should("include", "/add-fund"); // Check if the URL has changed
  // Or verify some element appears after the action
  cy.get(".some-element-after-add-fund") // Change selector as needed
    .should("be.visible");

  // Assert the country icon (Canada) is displayed correctly
  cy.get('img[alt="Country Icon"]')
    .should("be.visible") // Ensure the icon is visible
    .and("have.attr", "src", "assets/svgs/canada-wallet-icon.svg"); // Validate image source

  // Assert the 'Add Fund' button is visible and contains the correct text
  cy.get("button#btn-id-66972")
  
    .and("have.class", "primary-btn-sm") // Confirm the button has the correct class
    .and("contain.text", "Add Fund"); // Validate button text

  // Assert the wallet amount is visible and formatted correctly
  cy.get(".dashboard-wallets-amount")
    .should("be.visible")
    .invoke("text")
    .then((text) => {
      const amountText = text.trim();
      // Validate the format (currency format with comma separation and CAD suffix)
      expect(amountText).to.match(/^(\d{1,3}(,\d{3})*|0) CAD$/);
    });

  // Assert the wallet currency text is displayed correctly
  cy.get(".dashboard-wallets-currency")
    .should("be.visible") // Ensure the currency text is visible
    .and("contain.text", "Canadian Dollars"); // Validate correct currency text
});

Cypress.Commands.add("verifyWalletCardElementsForNGN", function () {
  // Assert the "Add Fund" button is visible and clickable
  cy.get("button#btn-id-63746")
    .should("be.visible")
    .and("contain.text", "Add Fund")
    .click(); // Click the button

  // Optionally, verify the next steps after clicking
  cy.url().should("include", "/add-fund"); // Check if the URL has changed
  // Or verify some element appears after the action
  cy.get(".some-element-after-add-fund") // Change selector as needed
    .should("be.visible");

  // Assert the country icon (Nigeria) is displayed correctly
  cy.get('img[alt="Country Icon"]')
    .should("be.visible") // Ensure the icon is visible
    .and("have.attr", "src", "assets/svgs/nigeria-wallet-icon.svg"); // Validate image source

  // Assert the 'Add Fund' button is visible and contains the correct text
  cy.get("button#btn-id-63746")
    .should("be.visible") // Ensure the button is visible
    .and("have.class", "primary-btn-sm") // Confirm the button has the correct class
    .and("contain.text", "Add Fund"); // Validate button text

  // Assert the wallet amount is visible and formatted correctly
  cy.get(".dashboard-wallets-amount")
    .should("be.visible")
    .invoke("text")
    .then((text) => {
      const amountText = text.trim();
      // Validate the format (currency format with comma separation and NGN suffix)
      expect(amountText).to.match(/^(\d{1,3}(,\d{3})*|0) NGN$/);
    });

  // Assert the wallet currency text is displayed correctly
  cy.get(".dashboard-wallets-currency")
    .should("be.visible") // Ensure the currency text is visible
    .and("contain.text", "Nigerian Naira"); // Validate correct currency text
});

Cypress.Commands.add("VerifyLoginPageElements", function () {
  // Verify the login page title
  cy.get("h3.login-title")
    .should("be.visible") // Assert the login title is visible
    .and("contain.text", "Login to your Africhange Business account"); // Assert the title contains the expected text

  // Verify the login page subtitle
  cy.get("h4.login-subtitle")
    .should("be.visible") // Assert the subtitle is visible
    .and("contain.text", "Enter your details to get started"); // Assert the subtitle contains the expected text

  // Verify email input field
  cy.findAllByPlaceholderText("name@example.com")
    .first()
    .should("be.visible") // Assert the email input field is visible
    .and("have.attr", "placeholder", "name@example.com"); // Assert the placeholder text is correct

  // Verify password input field
  cy.findAllByPlaceholderText("Your password")
    .first()
    .should("be.visible") // Assert the password input field is visible
    .and("have.attr", "placeholder", "Your password"); // Assert the placeholder text is correct

  // Verify forgot password link
  cy.get("a.login-forgot-password")
    .should("be.visible") // Assert the forgot password link is visible
    .and("have.attr", "href", "/forgot-password") // Assert the href attribute is correct
    .and("contain.text", "Forgot password?"); // Assert the link contains the correct text

  // Verify the Continue button and click it
  cy.contains("button", "Continue");

  // Verify request access link
  cy.get("a.register-new-user")
    .should("be.visible") // Assert the request access link is visible
    .and("have.attr", "href", "/request-access") // Assert the href attribute is correct
    .and("contain.text", "Request access"); // Assert the link contains the correct text
});
