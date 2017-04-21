Describing the flow of what happens when a user request verification of an attribute verifiable by an automated provider (e-mail, phone) in detail:
1. User requests verification of phone/email
2. User agent makes request to /{email,phone}/start-verification
3. Express server found in server.ts unpacks POST parameters and calls the startVerification() method on either the e-mail or phone Verifier class
4. The server generates a code stored in persistent storage (Redis) with an expiry time
5. A confirmation e-mail or SMS is sent through the appropriate ConfirmationSender
6a. User clicks confirmation link
6b. User enters confirmation code received by SMS
7. User agent makes request to /{email,phone}/verify with attribute and verification code
8. Received verification is checked for attribute, error is returned if invalid
9. Claim is written to Blockchain
10. Verification code is deleted from persistent storage
11. Front-end get OK status
