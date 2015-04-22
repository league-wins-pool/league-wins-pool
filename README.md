# League Wins Pool

## Getting Started

1. [Install Docker](https://docs.docker.com/installation/)
2. If on Mac, start Boot2docker

    ```bash
    $ boot2docker up
    ```

3. Create `src/db/secrets.env` from `src/db/secrets.example.env`


## Local Development

    $ cd src
    $ docker-compose up

Open a separate tab

    $ docker exec -it src_webapp_1 bash
    $ cd /webapp/client && grunt serve

Open a browser to view changes

    $ curl http://$(boot2docker ip)
    
    
## Running Database Migrations

    $ docker exec -it src_webapp_1 bash
    $ cd /webapp/server && node_modules/.bin/sequelize db:migrate
    

## Build for Production

    $ cd src
    $ docker-compose -f docker-production.yml up 
    $ curl http://$(boot2docker ip)
