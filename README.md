
## Installation Node version 18

Bước 1 :
Tải node version 18 sau đó tại folder home_library :
```bash
$ npm install
```

Bước 2 :
# database 

- Tải postgres về máy https://www.postgresql.org/download/
- Login supper admin  (psql -U postgres) - và tạo database  : 
        CREATE DATABASE home_library

Sau khi tạo xong database:
    +Tại folder home_library chạy câu lệnh  : 
        npm run start  
        npm run migration:run

Sau khi chạy xong truy cập link sau :
Link swagger các api : http://localhost:4000/docs

key tạo admin : "MGMJU97D7WVRANW44JLM9M9PSH2MUWS1JBBW1D9PDJ37J2GMGZYI1CWT7GWWWSE"


## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```



