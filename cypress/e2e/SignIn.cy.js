/* describe.only( 'SignIn', () => {
    it('User should be able to sign in with valid credentials', () => {
        cy.visit('/');
        cy.contains('button', 'Login').click({ force: true });
        cy.findAllByPlaceholderText(locators.SignUp.UserEmail).first().type(locators.SignUp.EmailAddress);
        cy.findAllByPlaceholderText(locators.SignUp.PasswordSpace).first().type(locators.SignUp.Password);
        cy.contains('button', 'Continue').click();
        cy.get(locators.SignUp.dashboardTitle)
        .should('be.visible')
        .and('contain.text', 'Hello, Mike');

        //Logout from the application

        //cy.get(locators.SignUp.LogOutModal).click();
        cy.contains('span', 'Logout').click();



    });

});

describe ( 'SignIn', () => {
    it('User should not be able to sign in with invalid credentials', () => {


        cy.visit (locators.SignUp.SignInbaseurl)
        cy.contains('button', 'Login').click({ force: true });
        cy.findAllByPlaceholderText(locators.SignUp.UserEmail).first().type(locators.SignUp.WrongEmail);
        cy.findAllByPlaceholderText(locators.SignUp.PasswordSpace).first().type(locators.SignUp.Password);
        cy.contains('button', 'Continue').click();

        // Scroll into view, increase the timeout and verify the error message
    cy.get('.error-toast-text', { timeout: 10000 })
    .scrollIntoView()
    .should('be.visible')
    .and('contain.text', 'Email or password is incorrect');
  

});

}); */

import { locators } from "../support/locators";

describe("E2E Test for Wallet and Chat Functionality", () => {
  // Run before each test to log the user in
  beforeEach(() => {
    cy.SignIntoTheApplication(); // Custom login command
  });

  // Run after each test to log the user out and verify the login page elements
  afterEach(() => {
    cy.logout(); // Custom logout command
    cy.VerifyLoginPageElements(); // Verify the login page elements after logout
  });


  it("Should navigate to Wallet and verify CAD and NGN Add Funds functionality", () => {
    // Navigate to the Wallet section
    cy.NavigateToWallet();

    // Verify wallet elements for CAD
    cy.verifyWalletCardElementsForCAD();

    // Verify wallet elements for NGN
    cy.verifyWalletCardElementsForNGN();
  });

  it("Should navigate to Send Money and Transaction History", () => {
    // Navigate to Send Money section
    cy.NavigateToSendMoney();

    // Navigate to Transaction History section
    cy.NavigateToTransactionHistory();
  });

  it("Should check today's rate", () => {
    // Verify today's rate
    cy.CheckTodaysRate();
  });

  it("Should verify the chat button functionality", () => {
    // Test the chat button functionality
    cy.verifyChatButtonFunctionality();
  });

  it("User should be able to log out", () => {
    cy.logout(); // Ensure correct casing, 'logout' instead of 'Logout'
  });

  it("System should not allow login with invalid credentials", () => {
    // Test login with invalid credentials
    cy.SystemShouldNotAllowLoginWithInvalidCredentials();
  });
});
