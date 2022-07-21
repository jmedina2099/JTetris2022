package jtetris.api;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import jtetris.engine.Engine;
import jtetris.figure.Box;
import jtetris.figure.Figure;

/**
 * @author jmedina
 *
 */
@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class TetrisController {
	
	@Autowired
	private Engine engine;

	@GetMapping("/")
	public String index() {
		return ""+this.engine.running;
	}
	
	@GetMapping("/start")
	public boolean start() {
		this.engine.doStart();
		return true;
	}
	
	@GetMapping("/pause")
	public boolean pause() {
		return this.engine.togglePause();
	}
	
	@GetMapping("/right")
	public boolean right() {
		return this.engine.moveRight();
	}	

	@GetMapping("/left")
	public boolean left() {
		return this.engine.moveLeft();
	}
	
	@GetMapping("/up")
	public void up() {
		this.engine.rotate(Figure.RIGHT_ROTATION); 
	}	

	@GetMapping("/down")
	public void down() {
		this.engine.rotate(Figure.LEFT_ROTATION);
	}
	
	@GetMapping("/space")
	public void space() {
		while( this.engine.moveDown() );
	}	

	@GetMapping("/figures")
	public ResponseEntity<ArrayList<Box>> getFigures() {
		ArrayList<Box> boxes = new ArrayList<Box>();
		if( this.engine.fallingFigure != null ) {
			boxes.addAll( this.engine.fallingFigure.listBoxes );
		}
		if( this.engine.listFigures.size() > 0 ) {
			this.engine.listFigures.stream().forEach( x -> {
				boxes.addAll( x.listBoxes );
			});
		}
		return new ResponseEntity<ArrayList<Box>>(boxes, HttpStatus.OK);
	}
}