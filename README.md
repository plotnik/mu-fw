# mu-fw

Angular client to read [freewriting](https://en.wikipedia.org/wiki/Free_writing).

`src/environments/environment.ts` points to [pi-server](https://github.com/plotnik/pi-server)

---
To start on local:

```
npm start
```

---
To build with `/mu-fw/` context path:

```
ng build --base-href /mu-fw/
```

---
To test the build:

```
cd dist
http-server
```

