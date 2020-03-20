# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

The project uses hashed passwords and user session to maintain user security. Database connections could be added as a future feature.

## Final Product

!["Screenshot of Login Page"](https://raw.githubusercontent.com/jeff-sexton/tinyapp/master/docs/TinyAppLogin.png)
!["Screenshot of User Registration Page"](https://raw.githubusercontent.com/jeff-sexton/tinyapp/master/docs/TinyAppRegister.png)
!["Screenshot of User URL Index Page"](https://raw.githubusercontent.com/jeff-sexton/tinyapp/master/docs/TinyAppUserIndex.png)
!["Screenshot of Edit URL Page"](https://raw.githubusercontent.com/jeff-sexton/tinyapp/master/docs/TinyAppEditURL.png)
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

## Getting Started

- Install all dependencies (using the `npm install` command).
- Setup enviorment variales by renaming '.env.example' to '.env'; set parameters as needed.
- Run the development web server using the `node express_server.js` command.