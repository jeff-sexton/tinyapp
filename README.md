# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

The project uses hashed passwords and user sessions to maintain user security. This application allows user account creation to store, maintain and monitor private shortened URLs. Analytics about total visits, unique visitors and visit history are provided to the URL owner.

## Final Product

!["Screenshot of Login Page"](https://raw.githubusercontent.com/jeff-sexton/tinyapp/master/docs/TinyAppLogin.png)
!["Screenshot of User Registration Page"](https://raw.githubusercontent.com/jeff-sexton/tinyapp/master/docs/TinyAppRegister.png)
!["Screenshot of User URL Index Page"](https://raw.githubusercontent.com/jeff-sexton/tinyapp/master/docs/TinyAppUserIndex.png)
!["Screenshot of Edit URL Page"](https://raw.githubusercontent.com/jeff-sexton/tinyapp/master/docs/TinyAppEditURL.png)
!["Screenshot of Edit URL Page with more Analytics"](https://raw.githubusercontent.com/jeff-sexton/tinyapp/master/docs/TinyAppEditURL2.png)
!["Screenshot of New URL Page"](https://raw.githubusercontent.com/jeff-sexton/tinyapp/master/docs/TinyAppNewURL.png)



## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session
- dotenv
- morgan
- method-override

## Getting Started

- Install all dependencies (using the `npm install` command).
- Setup enviorment variales by renaming '.env.example' to '.env'; set parameters as needed.
- Run the development web server using the `node express_server.js` command.


## Possible Future Features

- Store data in a database
- Localize timestamp display for client browser time zone
- Provide user option to reset TinyURL analytics