lint-frontend:
	make -C frontend lint

install:
	npm ci

start-frontend:
	make -C frontend start

build:
	npm run-build

start-backend:
	npx start-server

deploy:
	git push heroku main

start:
	make start-backend & make build