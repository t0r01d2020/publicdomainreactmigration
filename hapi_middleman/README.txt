



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
