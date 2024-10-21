import { locators } from '../support/locators';

describe ( 'Wallet', () => {
    it('User should be able to click on wallet', () => {
        cy.visit (locators.SignUp.SignInbaseurl)
        cy.contains('button', 'Login').click({ force: true });
        cy.findAllByPlaceholderText(locators.SignUp.UserEmail).first().type(locators.SignUp.EmailAddress);
        cy.findAllByPlaceholderText(locators.SignUp.PasswordSpace).first().type(locators.SignUp.Password);
        cy.contains('button', 'Continue').click();
        cy.get(locators.SignUp.dashboardTitle)
        .should('be.visible')
        .and('contain.text', 'Hello, Efe');

        // click on wallet module
        cy.get(locators.SignUp.LogOutModal).click();
        cy.contains('span', 'Wallet').click();
        cy.get(locators.SignUp.CanadaWallet).should('be.visible');
        cy.get(locators.SignUp.NigeriaWallet).should('be.visible');
        //Logout from the application

        cy.get(locators.SignUp.LogOutModal).click();
        cy.contains('span', 'Logout').click();



    });

});