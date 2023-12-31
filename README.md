> Pomodoro Timer

![screenshot](./app_screenshot.png)

Pomofocus is a customizable pomodoro timer that works on desktop & mobile browser. The aim of this app is to help you focus on any task you are working on, such as study, writing, or coding. This app is inspired by Pomodoro Technique which is a time management method developed by Francesco Cirillo.

## Features

- Responsive design that works with desktop and mobile
- Audio notification at the end of a timer period
- Customizable timer intervals to suit your preference

## Built With

- Vue
- NodeJS

## Live Demo

[Live Demo Link](https://pomodorotimer.webwide.ge/)

## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

- NodeJS - [v18.x](https://nodejs.org/en/)
- Docker Desktop [Docker](https://www.docker.com/products/docker-desktop/)

## Setup

### Server

```bash
git clone https://github.com/zurakusrashvili/PomodoroTimer
cd ./server
npm install
```
After that configure docker desktop and build image: 

```bash
docker compose build
docker compose up
```

Now after this your server is ready on http://localhost:3001


### Client

```bash
cd ./client
npm install
npm run serve
```

After this steps your front-end will be accessible on http://localhost:8080


## Author

👤 **Zurabi Kusrashvili**

- GitHub: [@zurakusrashvili](https://github.com/zurakusrashvili)
- LinkedIn: [LinkedIn](https://www.linkedin.com/in/zurab-kusrashvili-9602791b5/)


## Acknowledgments

- [Pomofocus](https://pomofocus.io/app)