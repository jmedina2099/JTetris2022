*********** JTetris2022
*********** Tetris - Back in Java and Front in React and also inAngular

./run

 *********** Docker

docker build -t jtetris.base -f Dockerfile.base .

docker build --no-cache -t jtetris .

docker run -p 3000:3000 -p 4000:4000 -p 8080:8080 jtetris
