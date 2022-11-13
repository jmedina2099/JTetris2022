package jtetris.api.rabbitmq;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.TimeoutException;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;

import jtetris.api.model.Board;

@Component
public class SendToQueue {

	private final static String SCORE_QUEUE = "score-queue";
	private final static String BOARD_QUEUE = "board-queue";

	private ConnectionFactory factory;

	public SendToQueue() {
		this.factory = new ConnectionFactory();
		this.factory.setHost("localhost");
	}

	public void sendScore(int score) {
		try (Connection connection = this.factory.newConnection(); Channel channel = connection.createChannel()) {
			channel.queueDeclare(SCORE_QUEUE, false, false, false, null);
			String message = ""+score;
			channel.basicPublish("", SCORE_QUEUE, null, message.getBytes(StandardCharsets.UTF_8));
		} catch (IOException e) {
		} catch (TimeoutException e) {
		}
	}
	
	public void sendBoard(Board board) {
		try (Connection connection = this.factory.newConnection(); Channel channel = connection.createChannel()) {
			channel.queueDeclare(BOARD_QUEUE, false, false, false, null);
			ObjectMapper mapper = new ObjectMapper();
			String message = mapper.writeValueAsString(board);
			channel.basicPublish("", BOARD_QUEUE, null, message.getBytes(StandardCharsets.UTF_8));
		} catch (IOException e) {
		} catch (TimeoutException e) {
		}
	}	

	public static void main(String[] argv) throws Exception {
	}
}