package jtetris.api.rabbitmq;

import java.io.IOException;
import java.net.URISyntaxException;
import java.nio.charset.StandardCharsets;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.concurrent.TimeoutException;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;

import jtetris.api.model.Board;
import jtetris.figure.Box;
import jtetris.figure.Figure;

@Component
public class SendToQueue {

	private final static String SCORE_QUEUE = "score-queue";
	private final static String BOARD_QUEUE = "board-queue";
	private final static String HASH_BOARD_QUEUE = "hash-board-queue";
	private final static String FIGURES_QUEUE = "figures-queue";
	private final static String FIGURE_FALLING_QUEUE = "figure-falling-queue";

	private ConnectionFactory factory;
	
	private String URL = "localhost";
	private int PORT = 5671;

//	private String URL = "jtetrisapprabbitmqserver.azurewebsites.net";
//	private int PORT = 4000;
//	private int PORT = 443;
	
	private String USERNAME = "jmedina";
	private String PASSWORD = "jmedina";
	private String VHOST = "rbbt"; 

	public SendToQueue() {
		this.factory = new ConnectionFactory();
		this.factory.setHost(URL);
		this.factory.setPort(PORT);
		this.factory.setUsername(USERNAME);
		this.factory.setPassword(PASSWORD);
		this.factory.setVirtualHost(VHOST);
		try {
			this.factory.useSslProtocol();
		} catch (KeyManagementException | NoSuchAlgorithmException e) {
			e.printStackTrace();
		}
	}

	public void sendScore(int score) {
		try (Connection connection = this.factory.newConnection(); Channel channel = connection.createChannel()) {
			channel.queueDeclare(SCORE_QUEUE, false, false, false, null);
			String message = ""+score;
			channel.basicPublish("", SCORE_QUEUE, null, message.getBytes(StandardCharsets.UTF_8));
		} catch (IOException e) {
			e.printStackTrace();
		} catch (TimeoutException e) {
			e.printStackTrace();
		}
	}
	
	public void sendBoard(Board board) {
		try (Connection connection = this.factory.newConnection(); Channel channel = connection.createChannel()) {
			channel.queueDeclare(BOARD_QUEUE, false, false, false, null);
			ObjectMapper mapper = new ObjectMapper();
			String message = mapper.writeValueAsString(board);
			channel.basicPublish("", BOARD_QUEUE, null, message.getBytes(StandardCharsets.UTF_8));
		} catch (IOException e) {
			e.printStackTrace();
		} catch (TimeoutException e) {
			e.printStackTrace();
		}
	}	

	public void sendHashBoard(int hashBoard ) {
		try (Connection connection = this.factory.newConnection(); Channel channel = connection.createChannel()) {
			channel.queueDeclare(HASH_BOARD_QUEUE, false, false, false, null);
			ObjectMapper mapper = new ObjectMapper();
			String message = mapper.writeValueAsString(hashBoard);
			channel.basicPublish("", HASH_BOARD_QUEUE, null, message.getBytes(StandardCharsets.UTF_8));
		} catch (IOException e) {
			e.printStackTrace();
		} catch (TimeoutException e) {
			e.printStackTrace();
		}
	}	

	public void sendFiguras(ArrayList<Box> figuresBoxes ) {
		try (Connection connection = this.factory.newConnection(); Channel channel = connection.createChannel()) {
			channel.queueDeclare(FIGURES_QUEUE, false, false, false, null);
			ObjectMapper mapper = new ObjectMapper();
			String message = mapper.writeValueAsString(figuresBoxes);
			channel.basicPublish("", FIGURES_QUEUE, null, message.getBytes(StandardCharsets.UTF_8));
		} catch (IOException e) {
			e.printStackTrace();
		} catch (TimeoutException e) {
			e.printStackTrace();
		}
	}	

	public void sendFiguraCayendo(Figure figuraCayendo ) {
		try (Connection connection = this.factory.newConnection(); Channel channel = connection.createChannel()) {
			channel.queueDeclare(FIGURE_FALLING_QUEUE, false, false, false, null);
			ObjectMapper mapper = new ObjectMapper();
			String message = mapper.writeValueAsString(figuraCayendo);
			channel.basicPublish("", FIGURE_FALLING_QUEUE, null, message.getBytes(StandardCharsets.UTF_8));
		} catch (IOException e) {
			e.printStackTrace();
		} catch (TimeoutException e) {
			e.printStackTrace();
		}
	}	

	public static void main(String[] argv) throws Exception {
	}
}