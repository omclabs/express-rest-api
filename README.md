## ExpressJS REST Api template

### What is this repository for?

a REST API application template using Express

- URI Versioning
- User register with MongoDB
- JWT
- ESLint with Airbnb style
- Unit testing

### How do I get set up?

\*\*\* Requirement

- nodejs and nmp installed. Check --> https://nodejs.org/en/
- mongodb. Simply using docker image --> https://hub.docker.com/_/mongo

- clone this repo
- run npm install
- copy `.env.example` -> `.env`
- copy `.env.example` -> `.env.test`
- adjust `.env` and `.env.test` to your environment

\*\*\* Running on your local environment

- type `npm start` to run the production web server
- type `npm run dev` to run the development web server
- type `npm run pretest` to run eslint checker and eslint autofix
- type `npm run test` to run unit testing

\*\*\* Running development on docker container

- if you have docker installed , you can run `docker-compose up` to run development container. And `docker-compose down` to remove it.

### Contribution guidelines

### Who do I talk to?

- Fajar Pratama <omclabs@gmail.com>
