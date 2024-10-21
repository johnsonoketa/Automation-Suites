import locators from "./support/locators";
describe ( 'TransactionHistory', () => {
    it('User should be able to click on Transaction history', () => {
        cy.visit (locators.SignUp.SignInbaseurl)
        cy.contains('button', 'Login').click({ force: true });
        cy.findAllByPlaceholderText(locators.SignUp.UserEmail).first().type(locators.SignUp.EmailAddress);
        cy.findAllByPlaceholderText(locators.SignUp.PasswordSpace).first().type(locators.SignUp.Password);
        cy.contains('button', 'Continue').click();
        cy.get(locators.SignUp.dashboardTitle)
        .should('be.visible')
        .and('contain.text', 'Hello, Efe');

        // click on transaction history
        cy.get(locators.SignUp.LogOutModal).click();
        cy.contains('span', 'Transaction History').should('be.visible').click();
        cy.contains('div', 'Sent').should('be.visible').click();
        cy.contains('div', 'Received').should('be.visible').click();
        cy.get('svg[data-icon="down"]').should('be.visible').click();
        cy.contains('.ant-select-item-option-content', '20').should('be.visible').click();

        // Logout
        cy.get(locators.SignUp.LogOutModal).click();
        cy.contains('span', 'Logout').click();



    });

});