package jtetris.api.rabbitmq;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.TimeoutException;

import org.springframework.stereotype.Component;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;

@Component
public class SendScore {

	private final static String QUEUE_NAME = "spring-boot";

	private ConnectionFactory factory;

	public SendScore() {
		this.factory = new ConnectionFactory();
		this.factory.setHost("localhost");
	}

	public void sendScore(int score) {
		try (Connection connection = this.factory.newConnection(); Channel channel = connection.createChannel()) {
			channel.queueDeclare(QUEUE_NAME, false, false, false, null);
			String message = ""+score;
			channel.basicPublish("", QUEUE_NAME, null, message.getBytes(StandardCharsets.UTF_8));
		} catch (IOException e) {
			e.printStackTrace();
		} catch (TimeoutException e) {
			e.printStackTrace();
		}
	}

	public static void main(String[] argv) throws Exception {
	}
}