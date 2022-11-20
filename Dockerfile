FROM jtetris.base:latest

RUN mkdir -p /home/jtetris
WORKDIR /home/jtetris
RUN git clone https://github.com/jmedina2099/JTetris2022.git

WORKDIR /home/jtetris/JTetris2022
RUN mvn clean package

WORKDIR /home/jtetris/JTetris2022/src/main/rabbit-server
RUN npm i

ARG front

WORKDIR /home/jtetris/JTetris2022/src/main/react
RUN if [ "$front" = "react" -o "$front" = "react-angular" ]; then npm i; fi

WORKDIR /home/jtetris/JTetris2022/src/main/angular
RUN if [ "$angular" = "angular" -o "$front" = "react-angular" ]; then npm i; fi

WORKDIR /home/jtetris/JTetris2022
ENTRYPOINT ["./run"]
