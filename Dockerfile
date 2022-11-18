FROM jtetris.base:latest

RUN mkdir -p /home/jtetris
WORKDIR /home/jtetris
RUN git clone https://github.com/jmedina2099/JTetris2022.git

WORKDIR /home/jtetris/JTetris2022
RUN mvn clean package

WORKDIR /home/jtetris/JTetris2022/src/main/react
RUN npm i

WORKDIR /home/jtetris/JTetris2022/src/main/react/src/rabbit-server
RUN npm i

WORKDIR /home/jtetris/JTetris2022/src/main/angular
RUN npm i

WORKDIR /home/jtetris/JTetris2022
CMD bash -c "./run"
