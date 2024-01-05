lint-frontend:
	make -C frontend lint

install:
	npm ci

build:
	make -C frontend build start

start-backend:
	npx start-server

deploy:
	git push heroku main

start:
	make start-backend & make build