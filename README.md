### About
This application fulfills the **Receipt Rewards Challenge** seen [here](https://github.com/fetch-rewards/receipt-processor-challenge).
It is written using TypeScript and Express. Testing has been implemented with Jest + Supertest.

### Getting Started

A Docker image has already been built out and published to DockerHub `kbud93/fetch`. 
The image is compatible with linux/amd64,linux/arm64, and linux/arm/v7.

The app runs on port 3000 within the container. You must map the port to your choosing.

Therefore, the simplest way to begin running the application is to issue: 
`docker run -p {PORT_NUMBER}:3000 kbud93/fetch`

**If you prefer to build the image yourself**: 
1) Clone the repo and cd into it
2) `docker build -t {repository/name} .`
3) `docker run -p {PORT_NUMBER:3000} {imageName}`

From there, query the endpoints following the [schema](https://github.com/fetch-rewards/receipt-processor-challenge/blob/main/api.yml) outlined in the challenge.

POST requests go to `localhost:{PORT_NUMBER}/receipts/process` and return an id generated for the receipt. Pass this id into your GET request to see the points that the receipt has earned. <br><br>
GET requests go to `localhost:{PORT_NUMBER}/receipts/{id}/points`


### Testing
Instead of running the application itself, you can execute the tests by overriding the image's CMD as follows: <br>
`docker run kbud93/fetch npm run test`

**Enjoy!**

### Author
 [LinkedIn](https://linkedin.com/in/kobudnik) 
