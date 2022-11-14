FROM openjdk:11

# Install maven
RUN apt-get update  
RUN apt-get install -y maven
RUN apt-get install -y nodejs npm

RUN mkdir -p /home/jtetris
WORKDIR /home/jtetris
RUN git clone https://github.com/jmedina2099/JTetris2022.git

WORKDIR /home/jtetris/JTetris2022
RUN mvn clean package
### ENTRYPOINT ["java","-jar","target/jtetris-0.0.1-SNAPSHOT.jar"]
ENTRYPOINT ["./run"]

WORKDIR /home/jtetris/JTetris2022/src/main/react
RUN npm i
ENTRYPOINT ["npm","start"]
