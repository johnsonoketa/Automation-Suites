describe("Send Money Page Tests", () => {

    beforeEach(() => {
        // Log in to the admin API and capture the token
        cy.adminLogin();  // Custom command to log in and capture the admin token
        cy.intercept('POST', 'https://business-api-test.africhange.com/api/Transaction').as('interceptedRequest');
        cy.SignIntoTheApplication();  // Custom login command for the UI
    });

    it("should verify all aspects of the Send Money page and confirm the transaction", () => {
      // Steps to generate transaction reference via UI
      cy.clickSendMoney();
      cy.enterRandomAmount();
      cy.assertAndClickContinueButton(true);
      cy.assertSendMoneyPage();
      cy.clickAddBeneficiary();
      cy.completeBeneficiaryDetails();
      cy.clickAddBeneficiaryButton();
      cy.searchAndSelectSavedBeneficiary();
      cy.assertDynamicTransactionDetails();
      cy.clickConfirmButton();

      const search_ref_endpoint = 'https://adminapi-test.africhange.com/api/Transactions/Transactionref/'; // Define transaction reference search endpoint

      // Wait for the transaction request and capture the transaction reference
      cy.wait('@interceptedRequest').then((interception) => {
        // Log the entire response to check its structure
        cy.log('Interception Response:', JSON.stringify(interception.response.body));
        
        // Check if the response contains the transaction reference
        if (interception && interception.response && interception.response.body && interception.response.body.data) {
          const transactionData = interception.response.body.data;

          // Verify if transactionReference exists within data
          if (transactionData.transactionReference) {
            const transactionReference = transactionData.transactionReference;
            cy.wrap(transactionReference).as("transactionReference");
            cy.log('Transaction Reference:', transactionReference);

            // Proceed with using the transactionReference (e.g., Admin Confirm Transfer)
            cy.get('@transactionReference').then((reference) => {
              cy.get("@admin_token").then((admin_token) => {
                const bearerToken = admin_token;
                cy.request({
                  method: 'GET',
                  url: `${search_ref_endpoint}${reference}`, // Complete the URL with the transaction reference
                  headers: {
                    'Authorization': `Bearer ${bearerToken}`, // Use the captured admin token
                    'accept': 'application/json'
                  }
                }).then((response) => {
                  // Handle the response from the admin transaction search
                  expect(response.status).to.eq(200);  // Ensure the response is successful
                  cy.log('Admin Transaction Search Response:', response.body);
                  // Further assertions or actions based on the response
                });
              });
            });
          } else {
            // Handle case where transactionReference is missing
            throw new Error('Transaction reference not found in response.');
          }
        } else {
          // Handle case where response body doesn't contain expected data
          throw new Error('No valid transaction data found in intercepted response.');
        }
      });
    });
});
