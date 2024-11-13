# BookMyDoc-backend-2.0
# SECURITY.md

 wrong way to require  const badWay = require(helperPath);
 don't use utils like Lodash
 cookies    cookie.secure = true   in express-session
 .npmignore    can override  .gitignore     be careful

#   Run Node.js as Non-Root User      Building a Docker image as non-root
# Run unsafe code in a sandbox for isolation of code 
#  sanitize child processes
#  Configure 2FA for developer credentials

# npm audit
# npm audit fix
# use npm outdated  time to time
# npm install -g clinic
# npm install -g autocannon

Node.js Security Best Practices (part 1) 
1. Rate Limiting  // use nginx before node server to handle DoS attacks & ReDoS   request rate limiter (aws)
    # brute force attacks solution  rate-limiter-flexible
2. Password Encryption 
3. JWT Blacklisting.        // refresh token    
    #  express-jwt-blacklist    Redis   
    # Prevent unsafe redirects  using whitelist urls
4. JSON Schema Validation 
    #  joi //     jsonschema validation rules
    # no regex  use validator.js instead of writing your own Regex patterns
5. Escaping HTML & CSS     
    # npm install node-esapi   OWASP’s ESAPI standard, or escape-html    
6. ORM/ODM against Injections 
    # mongoose obm tools no native query
7. Security Linter         
    #  eslint-plugin-security      in github eslint-community
    npm install eslint-plugin-security --save-dev
    # https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/security/sessions.md
    # Avoid Crashing on Invalid User Input
    #   eslint rule 'prefer-node-protocol'
<!-- import { createServer } from "node:http"; -->
    #  limit payload size
    # avoid eval()    
<!-- // example of malicious code which an attacker was able to input -->
<!-- const userInput = "require('child_process').spawn('rm', ['-rf', '/'])"; -->
<!-- // malicious code executed -->
<!-- eval(userInput); -->

# send only status code not stacktrace to client
# Hide error details from clients