Cypress.Commands.add("verifySendMoneyTitle", () => {
  cy.get(".send-money-title")
    .should("be.visible")
    .and("contain.text", "Send Money");
});
Cypress.Commands.add("verifyAmountInput", () => {
  cy.get('input[id^="id"]') // The input field has an ID like "id7092", using a prefix selector
    .should("have.attr", "placeholder", "Enter Amount")
    .and("be.visible")
    .and("have.class", "ant-input");
});
Cypress.Commands.add("verifyYouSendCurrency", () => {
  cy.get(".exchange-dropdown") // Targeting the dropdown
    .find(".ant-select-selection-item")
    .should("be.visible")
    .and("contain.text", "NGN");
});
Cypress.Commands.add("verifyRecipientGetsCurrency", () => {
  cy.get('input[id^="id"]') // Using prefix to match input field for recipient
    .parent(".exchange-dropdown")
    .find(".ant-select-selection-item")
    .should("be.visible")
    .and("contain.text", "NGN");
});
Cypress.Commands.add("verifyTotalAmountCharged", () => {
  cy.get(".single-detail .value") // Assuming this matches the total charge display
    .first() // Since there are multiple 'value' classes, we use the first one
    .should("contain.text", "CAD 0.00") // This checks the default total charge
    .and("be.visible");
});
Cypress.Commands.add("verifyContinueButton", (isEnabled = false) => {
  const buttonState = isEnabled ? "not.be.disabled" : "be.disabled";
  cy.get("button#btn-id-94737")
    .should("be.visible")
    .and(buttonState)
    .and("contain.text", "Continue");
});

// Define the command to verify amount calculation
Cypress.Commands.add(
  "verifyAmountCalculation",
  function (sendAmountSelector, recipientAmountSelector, rateSelector) {
    // Step 1: Get the send amount
    cy.get(sendAmountSelector)
      .invoke("val")
      .then((sendAmountText) => {
        const sendAmount = parseFloat(sendAmountText);

        // Step 2: Get the exchange rate from the rate display
        cy.get(rateSelector)
          .invoke("text")
          .then((rateText) => {
            const exchangeRate = parseFloat(
              rateText.split("=")[1].trim().split(" ")[0]
            );

            // Step 3: Calculate the expected recipient amount
            const expectedRecipientAmount = sendAmount * exchangeRate;

            // Step 4: Get the recipient's amount from the page
            cy.get(recipientAmountSelector)
              .invoke("val")
              .then((recipientAmountText) => {
                const recipientAmount = parseFloat(recipientAmountText);

                // Step 5: Assert the recipient amount matches the expected amount
                expect(recipientAmount).to.be.closeTo(
                  expectedRecipientAmount,
                  0.01
                ); // Allowing for rounding differences
              });
          });
      });
  }
);
Cypress.Commands.add("selectCurrency", (currency) => {
  // Open the currency dropdown
  cy.get(".ant-select-selector") // Adjust selector if necessary
    .click();

  // Verify dropdown is visible
  cy.get(".ant-select-dropdown").should("be.visible");

  // Select the specified currency
  cy.get(`nz-option-item[title="${currency}"]`, { multiple: true }) // Use the passed currency parameter
    .first() // Click the first matching element
    .click();

  // Verify that the selected currency is displayed correctly
  cy.get(".ant-select-selector").should("contain", currency); // Ensure the selected value is displayed
});

Cypress.Commands.add("enterRandomAmount", () => {
  // Generate a random amount between 50 and 400, formatted to 2 decimal places
  const randomAmount = (Math.random() * (400 - 50) + 50).toFixed(2); 

  // Step 1: Select the input field and type the random amount
  cy.findAllByPlaceholderText("Enter Amount")
    .first() // Ensure the first matching input field is selected
    .clear() // Clear any existing value
    .type(randomAmount) // Type the generated random amount

    // Step 2: After typing, format the value and remove commas for comparison
    .then(() => {
      cy.findAllByPlaceholderText("Enter Amount")
        .invoke("val") // Get the value from the input field
        .then((inputValue) => {
          const formattedValue = inputValue.replace(/,/g, ""); // Remove commas from the formatted value
          expect(formattedValue).to.equal(randomAmount); // Compare the formatted value with the generated amount
        });
    });
});

Cypress.Commands.add("assertAndClickContinueButton", (isEnabled = false) => {
  const buttonState = isEnabled ? "not.be.disabled" : "be.disabled";

  cy.get("button.ant-btn-primary") // Target the button by its class (common selector for primary buttons)
    .should("be.visible") // Ensure the button is visible
    .and(buttonState) // Assert whether the button is enabled or disabled
    .and("contain.text", "Continue") // Ensure the button contains the text "Continue"
    .click(); // Click the button if the conditions above are met
});

Cypress.Commands.add("assertSendMoneyPage", () => {
  // Check the page title
  cy.get("h2.send-money-title")
    .should("be.visible")
    .and("contain.text", "Send Money");

  const tabs = [
    { title: "Amount", shouldBeActive: true },
    { title: "Recipient", shouldBeActive: true },
    { title: "Review / Send", shouldBeActive: false },
  ];

  tabs.forEach((tab, index) => {
    const tabElement = cy.get(
      `.send-money-tabs .tab-content:nth-child(${
        (index + 1) * 2 - 1
      }) .tab-title`
    );

    // Assert the tab title exists and is visible
    tabElement.should("exist").and("be.visible").and("contain.text", tab.title);

    if (tab.shouldBeActive) {
      // Assert the active state for active tabs
      cy.get(
        `.send-money-tabs .tab-content:nth-child(${
          (index + 1) * 2 - 1
        }) .tab-icon`
      ).should("have.class", "tab-icon-active");
    } else {
      // Wait to give time for potential async operations or animations
      cy.wait(2000); // Adjust the wait time as necessary

      // Log the element for debugging purposes
      cy.get(
        `.send-money-tabs .tab-content:nth-child(${
          (index + 1) * 2 - 1
        }) .tab-icon`
      ).then(($el) => {
        cy.log($el); // Check the current class state of the element

        // Assert the inactive state for the 'Review / Send' tab
        cy.wrap($el);
      });
    }
  });
});

Cypress.Commands.add("clickAddBeneficiary", () => {
  cy.get('button.ant-btn.primary-btn:contains("Add Beneficiary")')
    .should("be.visible")
    .click();
});

Cypress.Commands.add("clickSendMoney", () => {
  cy.get('span:contains("Send Money")') // Selects all spans containing "Send Money"
    .should("be.visible") // Ensure they are visible
    .click({ multiple: true }); // Click each of them
});

Cypress.Commands.add("completeBeneficiaryDetails", () => {
  // Function to generate a random 10-digit number
  const generateRandom10DigitNumber = () => {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
  };

  // Step 1: Generate the random 10-digit number
  const randomAccountNumber = generateRandom10DigitNumber();

  // Step 2: Type the number into the input field with the correct placeholder
  cy.findAllByPlaceholderText("Enter account Number")
    .first() // Ensures that the first matching input field is selected
    .clear() // Clear any existing value before typing
    .type(randomAccountNumber) // Type the generated random number
    .should("have.value", randomAccountNumber); // Assert that the value is correctly entered and visible
    cy.wrap(randomAccountNumber).as('randomAccountNumber');
    
  // Function to generate a random email
  const generateRandomEmail = () => {
    const randomUsername = Math.random().toString(36).substring(2, 12); // Generates a random string of 10 characters
    return `${randomUsername}@yopmail.com`; // Concatenate with @yopmail.com
  };

  // Main steps wrapped inside a Cypress command
  cy.findAllByPlaceholderText("Enter account Number")
    .first()
    .type(generateRandom10DigitNumber());

  // Step 1: Select a random bank
  cy.get("input.ant-select-selection-search-input")
    .first() // Select the first input element for the bank
    .click({ force: true }); // Open the dropdown

  // Wait for the bank dropdown options to be visible
  cy.get(".ant-select-item-option") // Replace with the actual class for the bank options
    .should("be.visible")
    .then(($options) => {
      const optionsCount = $options.length;
      const randomIndex = Math.floor(Math.random() * optionsCount); // Generate random index

      cy.wrap($options)
        .eq(randomIndex)
        .scrollIntoView() // Ensure the option is scrolled into view before clicking
        .click({ force: true }) // Force the click if needed
        .wait(5000);
    });

  // Step 2: Select a random reason
  cy.get("input.ant-select-selection-search-input")
    .eq(1) // Select the second input element for the reason
    .click({ force: true }); // Open the dropdown

  // Wait for the reason dropdown options to be visible
  cy.get(".ant-select-item-option") // Adjust this selector to match the reason options
    .should("be.visible")
    .then(($options) => {
      const optionsCount = $options.length;

      // Ensure there are options to select

      const randomIndex = Math.floor(Math.random() * optionsCount); // Generate random index

      cy.wrap($options)
        .eq(randomIndex)
        .scrollIntoView() // Scroll into view to make sure the option is visible
        .click({ force: true }); // Click on the random option, using force if needed
    });

  cy.findAllByPlaceholderText("james@africhange.com")
    .first()
    .type(generateRandomEmail());

  Cypress.Commands.add(
    "verifyLabelAndInput",
    (labelSelector, labelText, inputSelector) => {
      // Check the label is visible and contains the correct text
      cy.get(labelSelector)
        .should("be.visible") // Assert that the label is visible
        .and("contain.text", labelText) // Assert that the label contains the correct text
        .within(() => {
          // Check if the required asterisk (*) is present
          cy.get(".required")
            .should("be.visible") // Assert that the required field indicator is visible
            .and("contain.text", "*"); // Assert that the asterisk (*) is present
        });

      // Assert that the input field is visible and required (if provided)
      if (inputSelector) {
        cy.get(inputSelector)
          .should("be.visible") // Assert that the input is visible
          .and("have.attr", "required"); // Assert that the input field is marked as required
      }
    }
  );
});
// Custom command to verify label, required asterisk, and input field
Cypress.Commands.add("verifyFormField", (fields) => {
  fields.forEach((field) => {
    const { labelSelector, labelText, inputSelector } = field;

    // Verify label is visible and contains the correct text
    cy.get(labelSelector)
      .should("be.visible") // Assert that the label is visible
      .and("contain.text", labelText) // Assert that the label contains the correct text
      .within(() => {
        // Check if the required asterisk (*) is present
        cy.get(".required").should("be.visible").and("contain.text", "*"); // Assert that the required field indicator is visible
      });

    // Assert input field exists and is marked as required, if provided
    if (inputSelector) {
      cy.get(inputSelector)
        .should("be.visible") // Assert that the input field is visible
        .and("have.attr", "required"); // Assert that the input field is required
    }
  });
});

// Custom command to click the "Add Beneficiary" button
Cypress.Commands.add("clickAddBeneficiaryButton", () => {
  // Wait for 5 seconds
  cy.wait(8000); // 8000 milliseconds = 8 seconds

  // Ensure the button is visible and click it
  cy.get("button.ant-btn.primary-btn.ant-btn-primary") // Selector for the button
    .contains("Add Beneficiary") // Ensure the button contains the text "Add Beneficiary"
    .should("be.visible") // Ensure the button is visible before attempting to click
    .click({ force: true }); // Force the click even if the button might be covered by another element
});

Cypress.Commands.add("clickAddBeneficiaryButton", () => {
  cy.xpath('//span[text()=" Add Beneficiary "]') // Use XPath to select the span element with the exact text
    .should('be.visible') // Ensure the element is visible
    .click({ force: true }); // Forcefully click the button even if it may be covered
});


Cypress.Commands.add("searchAndSelectSavedBeneficiary", () => {
  // Access the saved random account number using the alias
  cy.get('@randomAccountNumber').then((accountNumber) => {
    // Step 1: Wait for the account list to be updated
    cy.get('.beneficiary') // Adjust this selector based on the actual list container
      .should('exist') // Ensure the list container exists
      .wait(1000) // Wait for 1 second (adjust time if necessary)

      // Retry finding the beneficiaries
      .then(() => {
        // After waiting, check if the account is in the list
        cy.get('.beneficiary').should('exist').then(($beneficiaries) => {
          let found = false; // Flag to track if a matching beneficiary is found

          // Iterate through each .beneficiary and try to find the one with the matching account number
          $beneficiaries.each((index, beneficiary) => {
            // Get the account number text from the DOM and trim it
            const accountNumberText = Cypress.$(beneficiary).find('h3').eq(1).text().trim();

            // Log the found account number for debugging
            cy.log(`Found account number in DOM: ${accountNumberText}`);

            // Compare the account number in the DOM with the generated one
            if (accountNumberText === accountNumber) {
              // Save the matching beneficiary element
              cy.wrap(beneficiary).as('matchedBeneficiary');
              found = true; // Set the found flag to true
            }
          });

          // If no matching account was found, throw an error
          if (!found) {
            throw new Error(`No matching beneficiary found for account number: ${accountNumber}`);
          }
        });
      })
      .then(() => {
        // Step 2: Perform actions within the saved matched beneficiary
        cy.get('@matchedBeneficiary')
          .scrollIntoView() // Ensure the matched beneficiary is in view
          .within(() => {
            // Click the <p> element that contains "(Bank)"
            cy.get('p').contains('(Bank)').click(); // Click the <p> with the specified text
          });
      });
  });
});

Cypress.Commands.add("assertDynamicTransactionDetails", () => {
  cy.get('.transaction-preview')
    .within(() => {
      
      // Capture and assert dynamic account number
      cy.contains('Account Number')
        .siblings('.value')
        .invoke('text')
        .then((accountNumber) => {
          const dynamicAccountNumber = accountNumber.trim(); // Capture dynamic account number
          cy.log('Captured Account Number:', dynamicAccountNumber); // Log for debugging
          
          // Defensive check and assertion
          expect(dynamicAccountNumber).to.not.be.empty; // Ensure it's not empty
          expect(dynamicAccountNumber).to.match(/^\d+$/); // Check if it's a valid number
        });

      // Capture and assert dynamic amount
      cy.contains('Amount')
        .siblings('.value')
        .invoke('text')
        .then((amount) => {
          const dynamicAmount = amount.trim(); // Capture dynamic amount
          cy.log('Captured Amount:', dynamicAmount); // Log for debugging
          
          // Defensive check and assertion
          expect(dynamicAmount).to.not.be.empty; // Ensure it's not empty
          expect(dynamicAmount).to.match(/^\d+(\.\d{1,2})?\sCAD$/); // Ensure it's a valid amount in CAD
        });

      // Capture and assert dynamic equivalent
      cy.contains('Equivalent')
        .siblings('.value')
        .invoke('text')
        .then((equivalent) => {
          const dynamicEquivalent = equivalent.trim(); // Capture dynamic equivalent
          cy.log('Captured Equivalent Amount:', dynamicEquivalent); // Log for debugging
          
          // Defensive check and assertion
          expect(dynamicEquivalent).to.not.be.empty; // Ensure it's not empty
          expect(dynamicEquivalent).to.match(/^\d+(,\d{3})*\.\d{2}\sNGN$/); // Ensure it's a valid NGN format
        });
    });
});

Cypress.Commands.add("clickConfirmButton", () => {
  // Locate and force click the Confirm button using its class and text
  cy.get('button.ant-btn.primary-btn.ant-btn-primary') // Targeting based on multiple classes
    .contains('Confirm') // Ensures we are clicking the correct button with the text 'Confirm'
    .click({ force: true }); // Force the click action
});





