*********** JTetris2022
*********** Tetris - Back in Java and Front in React and also in Angular

./run

 *********** Docker

docker build -t jtetris.base -f Dockerfile.base .

docker build --no-cache -t jtetris .

************ Angular Front

docker run -p 3000:3000 -p 4000:4000 -p 4200:4200 -p 8080:8080 jtetris angular

************ React Front

docker run -p 3000:3000 -p 4000:4000 -p 4200:4200 -p 8080:8080 jtetris react
