# Storage of knowledge

This repository contains a web UI for https://github.com/ArtyomSliusar/storage-of-knowledge-be

## Technology

* React 16.8

### Installing

#### on-premise

- Clone repository
```
git clone https://github.com/ArtyomSliusar/storage-of-knowledge-fe.git
```

- Install requirements
```
npm install
```

- Create .env file in project root folder (use example.env)

- Run app in the development mode
```
npm run dev
```

#### docker

- Run a new container, with `.env` file, use `host` network to connect to 
backend service.
```
docker run --rm --network="host" \
    -v $(pwd)/.env:/usr/share/nginx/html/.env \
    artyomsliusar/storage-of-knowledge-fe:0.1
```

You can check https://github.com/ArtyomSliusar/storage-of-knowledge if you want
to run this application with all dependencies included.

### Configuration

Environment variables for configuration:

- BASE_URL - backend API url
- RECAPTCHA_PUBLIC_KEY - google recaptcha public key

### How to

- Build a new docker image manually
```
docker build -f Dockerfile ./ -t artyomsliusar/storage-of-knowledge-fe:0.1
```

- Run `bash` inside a new docker container
```
docker run -ti --rm artyomsliusar/storage-of-knowledge-fe:0.1 bash
```

- Build the app for production to the `build` folder
```
npm run build
```

### TODO:
- use ssr
- multiplex requests to get note, its comments and likes
- flatten data in store
- add client-side encryption
- fix `history.goBack()` goes out of the website
- make mobile header fixed?
- use FE badges for private/public info
- private cabinet with delete account option