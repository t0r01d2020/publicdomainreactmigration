
To externally Ping the Hapi Middleman when it is running on a host, including your own
localhost, you can send a HTTP GET request (e.g.: via POSTMAN, or CURL) to the following form

GET to
URL:

  http://<localhost or deployed domain>:3210

  be sure to plug-in the word "localhost" on your laptop, or
  the hostname if deployed on a server.

  If the Hapi Middleman is deployed properly and running, you should get an HTTP 200 status code, and get back this response as text/plain:
    "Hapi Wednesday From Our Hapi Middleman Server!"

So, its base URL ( "/") is a test endpoint.


Our Middleman Server now logs the details of every REST request it receives, here is the example of the
logged data:


>> routes available >>
get     /
get     /{param*}
Middleman received a request.
headers are >>
{
  'user-agent': 'PostmanRuntime/7.24.0',
  accept: '*/*',
  'cache-control': 'no-cache',
  'postman-token': '47d50357-5d64-4d70-a816-7e4e901f7a1d',
  host: 'localhost:3210',
  'accept-encoding': 'gzip, deflate, br',
  connection: 'keep-alive'
}
200402/022908.906, (1585794548906:DML-03259:1132:k8i5418c:10000) [response] http://0.0.0.0:3210: get / {} 200 (71ms)
