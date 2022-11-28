*********** JTetris2022
*********** Tetris - Back in Java and Front in React and also in Angular with Rabbitmq for broker.

./run

 *********** Docker base image

docker build -t jtetris.base -f Dockerfile.base .

************ Broker

docker build -t jtetris.broker -f Dockerfile.broker .

docker run -p 4000:4000 -p 2222:2222 jtetris.broker

************ Back

docker build -t jtetris.back -f Dockerfile.back .

docker run -p 8080:8080 -p 2222:2222 jtetris.back

************ React

docker build -t jtetris.react -f Dockerfile.react .

docker run -p 3000:3000 -p 2222:2222 jtetris.react

************ Angular

docker build -t jtetris.angular -f Dockerfile.angular .

docker run -p 4200:4200 -p 2222:2222 jtetris.angular
