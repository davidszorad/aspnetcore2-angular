interface AuthConfig {
    clientID: string;
    domain: string;
    callbackURL: string;
  }
  
  export const AUTH_CONFIG: AuthConfig = {
    clientID: 'MWFEOJEznt7VApnQAxZWpTQfTqRVqUK4',
    domain: 'veganew.auth0.com',
    callbackURL: 'http://localhost:5000/vehicles'
  };