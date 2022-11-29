package jtetris.api.rabbitmq;

import java.net.URISyntaxException;
import java.util.ArrayList;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.socket.client.IO;
import io.socket.client.Socket;
import io.socket.emitter.Emitter;
import jtetris.api.model.Board;
import jtetris.figure.Box;
import jtetris.figure.Figure;

@Component
public class SendToQueueSocketIO {

	private String URI = "https://jtetrisapprabbitmqserver.azurewebsites.net:443";
//	private String URI = "http://localhost:4000";
	
	private Socket socket;

	public SendToQueueSocketIO() {
		//System.out.println( "SendToQueueSocketIO()" );
		try {
			this.socket = IO.socket( URI );
			this.socket.on( Socket.EVENT_CONNECT, onConnect );
			this.socket.connect();
		} catch (URISyntaxException e) {
			e.printStackTrace();
		}
	}
	
	private Emitter.Listener onConnect = new Emitter.Listener() {
        @Override
        public void call(Object... args) {
        	System.out.println( "CONNECTED !!!!" );
        }
    };

	public void sendScore(int score) {
		if( !this.socket.connected() ) return;
		
		//System.out.println( "Sending score to Rabbit.. ="+score );
		String message = ""+score;
		socket.emit( "score", message );
	}
	
	public void sendBoard(Board board) {
		if( !this.socket.connected() ) return;
		
		//System.out.println( "Sending board to Rabbit.." );
		ObjectMapper mapper = new ObjectMapper();
		try {
			String message = mapper.writeValueAsString(board);
			socket.emit( "board", message );
		} catch (JsonProcessingException e1) {
			e1.printStackTrace();
		}
	}	

	public void sendHashBoard(int hashBoard ) {
		if( !this.socket.connected() ) return;
		
		//System.out.println( "Sending hash to Rabbit.. ="+hashBoard );
		String message = ""+hashBoard;
		socket.emit( "hash", message );
	}	

	public void sendFiguras(ArrayList<Box> figuresBoxes ) {
		if( !this.socket.connected() ) return;
		
		//System.out.println( "Sending figuras to Rabbit.." );
		ObjectMapper mapper = new ObjectMapper();
		try {
			String message = mapper.writeValueAsString(figuresBoxes);
			socket.emit( "figuras", message );
		} catch (JsonProcessingException e1) {
			e1.printStackTrace();
		}
	}	

	public void sendFiguraCayendo(Figure figuraCayendo ) {
		if( !this.socket.connected() ) return;
		
		//System.out.println( "Sending figura cayendo to Rabbit.." );
		ObjectMapper mapper = new ObjectMapper();
		try {
			String message = mapper.writeValueAsString(figuraCayendo);
			socket.emit( "figuraCayendo", message );
		} catch (JsonProcessingException e1) {
			e1.printStackTrace();
		}
	}	

}