import { LogLevel } from "@azure/msal-browser";
import { ENV as env } from "./env";



const tenant = env.AUTH.TENANT;
const redirectUri = env.AUTH.REDIRECT_URL;
const clientId = env.AUTH.CLIENT_ID;
const scopes = (env.AUTH.SCOPES as string).replace(" ","").split(",");

/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
 */
export const msalConfig = {
    auth: {
        clientId: `${clientId}`,
        authority: `${tenant}`,
        redirectUri: `${redirectUri}`
    },
    cache: {
        cacheLocation: "localStorage", // This configures where your cache will be stored
        storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },
    system: {
        loggerOptions: {
            loggerCallback: (level: LogLevel, message: string, containsPii: boolean) => {
                if (containsPii) {
                    return;
                }
                switch (level) {
                    case LogLevel.Error:
                        // eslint-disable-next-line no-console
                        console.error(message);
                        return;
                    case LogLevel.Info:
                        return;
                    case LogLevel.Verbose:
                        // eslint-disable-next-line no-console
                        console.debug(message);
                        return;
                    case LogLevel.Warning:
                        // eslint-disable-next-line no-console
                        console.warn(message);
                        return;
                }
            }
        }
    }
};

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit:
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
export const loginRequest = {
    scopes
};