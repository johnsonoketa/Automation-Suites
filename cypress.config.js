const { defineConfig } = require("cypress");
const { Client } = require('pg')
module.exports = defineConfig({
  e2e: {
    baseUrl: "https://africhange-business-web-test-af736fe5bea2.herokuapp.com/",
    ADMIN_AUTH: "https://adminapi-test.africhange.com/api/Auth/login",
  
    ADMIN_PASSWORD: "Passw0rd@",
  
   
    
        ADMIN_AUTH: "https://adminapi-stage.africhange.com/api/Auth/login",
        ADMIN_BASEURL: "https://adminapi-stage.africhange.com",
        
       
        
        USER: "/api/User",
       
        AUTH: "https://business-api-test.africhange.com/api/Auth/login",
        "SEARCH_REF": "/api/v2/transactions?TransactionReference=",
       
    
    defaultCommandTimeout: 35000,
    viewportHeight: 1080,
    viewportWidth: 1920,
    watchForFileChanges: true,
    chromeWebSecurity: false,
    pageLoadTimeout: 120000,
    failOnStatusCode: false,
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on("task", {
        async connectDB(query) {
          const client = new Client({
            user: "Africhange",
            password: "Africhangedb2:3",
            host: "africhange-dev-db-instance.conndinkpvf6.us-west-2.rds.amazonaws.com",
            database: "africhangedbstage",
            ssl: false,
            port: 5432,
          });
          await client.connect();
          const res = await client.query(query);
          await client.end();
          return res.rows;
        },
      });
    },
  },
});