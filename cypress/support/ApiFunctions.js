Cypress.Commands.add("adminLogin", () => {
    const loginDetails = {
      email: "loray@africhange.com", // Replace with actual email
      password: "Passw0rd@"          // Replace with actual password
    };
  
    cy.request({
      method: 'POST',
      url: 'https://adminapi-test.africhange.com/api/Auth/login',
      headers: {
        'accept': '*/*',
        'Content-Type': 'application/json-patch+json'
      },
      body: loginDetails,
      failOnStatusCode: false // Prevent test from failing on non-2xx status codes
    }).then((response) => {
      // Log the entire response to check its structure
      cy.log('Login API Response:', JSON.stringify(response.body));
  
      // Verify the status code of the response
      expect(response.status).to.eq(200); // Ensure status is 200 OK
  
      // Check for accessToken in the response
      if (response.body && response.body.data && response.body.data.accessToken) {
        const adminToken = response.body.data.accessToken;
        cy.wrap(adminToken).as("admin_token");
        cy.log('Captured admin token:', adminToken);
      } else {
        // If no accessToken, log the full response for debugging
        throw new Error('Login failed: No accessToken received. Response: ' + JSON.stringify(response.body));
      }
    });
  });
  
  Cypress.Commands.add("Search_Admin_transactions", (adminurl, adminToken) => {
    cy.request({
      method: 'GET',
      adminurl: adminurl, // The complete URL with transaction reference
      headers: {
        'Authorization': `Bearer ${adminToken}`, // Pass the Bearer token
        'accept': 'application/json'
      }
    }).then((response) => {
      // Log the response for debugging
      cy.log('Admin Transaction Search Response:', response.body);
  
      // Check if the request was successful
      expect(response.status).to.eq(200); // Ensure the status is 200
      // Handle response data, e.g., log or assert
      expect(response.body).to.have.property('data'); // Ensure data exists in the response
    });
  });
  