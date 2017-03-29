The components and Redux module(s) can be found in the wallet/ directories in the components/ and redux/modules/ directories. The component

The different screens and their respective container components of the registration process each have their own routes to enable the browser history button functionality and allow for easier testing. They're located in components/screens/ named after their component names.

Relevant walkthroughs:
https://files.slack.com/files-pri/T03K1SCA9-F4FDEGVM1/170308_jolocom_wallet_verification-05.jpg
https://files.slack.com/files-pri/T03K1SCA9-F4N1QENKV/170322_jolocom_wallet-10.png

======================================

Parts:
- Menu
  - Seperate menu for wallet
- Wallet home
  - TODO: Shouldn't get started provide something helpful?
    - Only first login, start at money next login
- Tabs
  - Connecting subroutes to tabs
- Money
  - Digital currency
    - Display
    - Details (define!)
  - Bank accounts (define! talk with team)
- Identity
  - Username (discuss with team)
  - Name and surname (discuss with team)
  - Contact
    - Common
      - Save changes (define further)
    - Phone
      - Display
        - Verification status
        - Request verification (link shown on click? what happens with multiple unverified numbers?)
        - Verification popup
        - TODO: define UI in terms of spacing for multiple numbers
      - Edit
        - Add another (define further, leave out additional phone number)
        - Type select box (does changing this invalidate verification? NO! And no fax)
        - Clear button (or delete button? delete on saving empty field)
        - TODO: define UI in terms of spacing for multiple numbers
        - SMS sending
          - Activation code generation and storage
      - Verification screen (how does the user get here? what if it's multiple at once? straight after saving, no multiple)
        - 'Extended pin entry'
    - Email
      - Display
        - Verification status
      - Edit
      - Verify
        - TODO: define when verification starts
        - Send e-mail
        - Verify link
    - Address (define, leave out for now, discuss with team)
  - Passport
    - Take or pick pictures (require front and back)
    - Fields: number, surname, give name, date of birth, age auto update, address? (street, city, state, country select with search)
  - Drivers license

TODO
- User type images
- Entropy screen text and images
- Username checking backend
