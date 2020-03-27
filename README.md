# BryllyantChallenge

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.7.

## Development server
Run `npm install`
Run `npm server` for backend server
Run `npm start` for frontend. Navigate to `http://localhost:4200/`.

## Docker Build
```
docker build -f DockerfileSERVER -t bryllyantserver:latest .
docker build -f DockerfileUI -t bryllyantui:latest .
```
OR
```
docker-compose up
docker-compose logs -f
```