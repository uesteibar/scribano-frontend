# Scribano FE

A simple frontend for [scribano](http://github.com/uesteibar/scribano).

Basically serves a page generated with [asyncapi/generator](https://github.com/asyncapi/generator).

Install dependencies

```
npm install
```

Run the app by pointing to your asyncapi spec url

```
SPEC=http://example.com/asyncapi npm start
```

You can also run it with docker

```
docker run -e SPEC='http://example.com/asyncapi' uesteibar/scribano-frontend
```
