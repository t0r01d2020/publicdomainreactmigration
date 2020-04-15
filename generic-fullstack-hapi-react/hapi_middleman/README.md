# 1. Configuration:  ###

The middleman Hapi server is configurable through Environment Variables, which can be SET on the host platform, or hardcoded by 
supplying a .env file (textfile). Middleman uses the dotenv library, 
which reads environment variables from either source. A .env
file should be of the following form:

[EXAMPLE .env file]   
#######################################
SOMEPROPERTY=SOMEVALUE
ANOTHER_PROPERTY=ANOTHERVALUE

Some config, such as the OAuth credentials, are required and must be 
supplied as environment vars. Others are optional, such as the Logging
dir location, and if you supply no value they use a default, hardcoded
value. For example, here is a table of the config settings one can 
define as env vars in a .env file or the system:
##################################


DEPLOYMENT_BASE=0.0.0.0
DEPLOYMENT_PORT=8000
SERVICE_BASE_URL=<the service base url>
OIDC_AUTH_SERVICE_URL=<relative url of the auth service>
OIDC_TOKEN_SERVICE_URL=<relative url of the token service>
OIDC_PROFILE_SERVICE_URL=<relative url of the profile service> 
OIDC_CLIENT_ID=<the oidc clientID>
OIDC_CLIENT_SECRET=<the oidc clientSecret>
CDS_GET_CUSTOMER_EMAIL_URL=<relative url of the customer email endpoint>
SESSION_COOKIENAME=<session cookie name>

[SOME OPTIONAL (OVERRIDE) ENV vars]
 middleman_logging_dir=<non-default dir where the middlemans log files 
 should be written>
 middleman_redis_host=<IP address or Hostname of the Redis Server>
 middleman_redis_port=<Port number of the Redis Server>
#####################################################################

The .env file is specific to the host platform you are running it on.
Therefore, the values may differ on each host. 
- Advice for your .env file:  
   1. no whitespaces surround the '=' symbol 
   2. Surrounding the keys or the values in quotation marks (single or double) is not advised. Single quotes
   are known to cause a bug in parsing. They are unnecessary. For the apostrophe character, consider substituting
   the HTML entity reference for it (&apos;). There is some evidence that double quotes may be safe, if necessary.
   3. Maintain the secrecy of the OIDC-related env var values


Our Middleman Server now logs the details of every REST request it
receives. It logs both to STDOUT (i.e.: the console when run localhost),
and to log files. The log files are created in the logging directory,
which is the path defined in the env var named 'middleman_logging_dir',
and if not, the /__logs  directory.




# 2. Launching Middleman:###

 - The first time the hapi_middleman is cloned from the git repository, 
   and any time you change its dependencies 
   defined in package.json, you should redownload the node_modules, using the command:

   $yarn install

 - After doing so, make sure to launch the Redis server on your platform. The   way to do this differs by platform, OS, and installation.
   So use the means specific to your Redis installation to launch Redis.

 - Now, cd into the project root directory (hapi_middleman)
 - To launch the middleman, issue this command: node index.json


# 3. Key routes currently served by Hapi_Middleman: ###

    | /login   |  HTTP GET  |The key route for User OAuth signin: accessed through a browser, the OAuth flow will begin, and
    the User will be redirected to a login page for CWP, enters their CWP credentials, and the OAuth flow then completes,
    with the access token cached into Redis.   

    | /{contextPath}/user | HTTP GET | only a proof-of-concept Route, where one can GET the User's firstname, lastname,
                            and email (profile info)     


 # 4. Middleman Project Organization:

   -- /
       -- index.js the target runnable, main starting point for hapi server
          startup and behavior.  

       -- /config  dir for configuration-related modules and code

       -- /providers dir for Providers, including the oidcProvider and RedisProvider

       

       -- /apiProviders will contain each of the providers used to aggregate      REST requests to th e microservices, ultimately. Currently contains one example apiProvider.
          This dir will ultimately also contain the BaseApiProvider...which will wrap shared, common
          functionality used for all API requests, and that each specific app ApiProvider will delegate to.

       -- .gitignore  this file is used by git to determine which files to ignore from commits and pushes.






