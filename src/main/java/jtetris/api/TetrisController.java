package jtetris.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import jtetris.api.model.Board;
import jtetris.engine.Engine;
import jtetris.figure.Figure;

/**
 * @author jmedina
 *
 */
@RestController
public class TetrisController {
	
	@Autowired
	private Engine engine;

	@GetMapping("/")
	public String index() {
		return ""+this.engine.running;
	}
	
	@GetMapping("/start")
	public ResponseEntity<Boolean> start() {
		if( this.engine.running ) {
			return new ResponseEntity<Boolean>(false, HttpStatus.OK);
		}
		
		this.engine.doStart();
		return new ResponseEntity<Boolean>(true, HttpStatus.OK);
	}
	
	@GetMapping("/pause")
	public ResponseEntity<Boolean> pause() {
		if( !this.engine.running ) {
			return null;
		}
		
		return new ResponseEntity<Boolean>(this.engine.togglePause(), HttpStatus.OK);
	}
	
	@GetMapping("/right")
	public ResponseEntity<Figure> right() {
		if( this.engine.moveRight() ) {
			return new ResponseEntity<Figure>(this.engine.getFallingFigureInside(), HttpStatus.OK);
		} else {
			return null;
		}
	}	

	@GetMapping("/left")
	public ResponseEntity<Figure> left() {
		if( this.engine.moveLeft() ) {
			return new ResponseEntity<Figure>(this.engine.getFallingFigureInside(), HttpStatus.OK);
		} else {
			return null;
		}
	}
	
	@GetMapping("/up")
	public ResponseEntity<Figure> up() {
		if( this.engine.rotate(Figure.RIGHT_ROTATION) ) {
			return new ResponseEntity<Figure>(this.engine.getFallingFigureInside(), HttpStatus.OK);
		} else {
			return null;
		}
		
	}	

	@GetMapping("/down")
	public ResponseEntity<Figure> down() {
		if( this.engine.rotate(Figure.LEFT_ROTATION) ) {
			return new ResponseEntity<Figure>(this.engine.getFallingFigureInside(), HttpStatus.OK);
		} else {
			return null;
		}
	}
	
	@GetMapping("/space")
	public ResponseEntity<Figure> space() {
		while( this.engine.moveDown() );
		Figure figureFalling = this.engine.getFallingFigureInside();
		this.engine.figureFell = true; // figure fixed.
		return new ResponseEntity<Figure>(figureFalling, HttpStatus.OK);
	}
	
	@GetMapping("/board")
	public ResponseEntity<Board> getBoard() {
		return new ResponseEntity<Board>(this.engine.getBoard(), HttpStatus.OK);
	}
	
}