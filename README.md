# web-scraping-poc


sudo docker build --tag anperez78/flatprices .
sudo docker run -p 27017:27017 --name mongo_instance_001 -e MONGODB_DBNAME=prices -d anperez78/flatprices

npm install
sudo npm link

> export NODE_ENV=garages
> scraper search

> export NODE_ENV=pisos
> scraper search

$ openssl aes-256-cbc -in secretfile.txt -out secretfile.txt.enc -pass file:secret.key
$ openssl aes-256-cbc -d -in secretfile.txt.enc -out secretfile.txt -pass file:secret.key
