*********** JTetris2022
*********** Tetris - Back in Java and Front in React and also in Angular

./run

 *********** Docker base image

docker build -t jtetris.base -f Dockerfile.base .

************ Angular Front

docker build --build-arg front=angular -t jtetris .

docker run -p 4000:4000 -p 4200:4200 -p 8080:8080 jtetris angular

************ React Front

docker build --build-arg front=react -t jtetris .

docker run -p 3000:3000 -p 4000:4000 -p 8080:8080 jtetris react

************ Both Front

docker build --build-arg front=react-angular -t jtetris .

docker run -p 3000:3000 -p 4000:4000 -p 4200:4200 -p 8080:8080 jtetris react-angular
