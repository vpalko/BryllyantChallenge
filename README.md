# BryllyantChallenge

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.0.

## Development server
Run `npm install`  
Run `npm server` for backend server  
Run `npm uilocal` for frontend. Navigate to `http://localhost:4200/`.  
  
* `change server=>src=>utils=service-constants.js POSTGRES: HOST to "localhost"`  
* `use "host.docker.internal" when launch with Docker ` 

## Docker
```
docker-compose -f docker-compose-MD.yaml up (or PG.yaml file for Postgres)
docker-compose logs -f
```