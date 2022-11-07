package jtetris.api;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
	public ResponseEntity<ArrayList<Box>> right() {
		this.engine.moveRight();
		return getFallingFigure();
	}	

	@GetMapping("/left")
	public ResponseEntity<ArrayList<Box>> left() {
		this.engine.moveLeft();
		return getFallingFigure();
	}
	
	@GetMapping("/up")
	public ResponseEntity<ArrayList<Box>> up() {
		this.engine.rotate(Figure.RIGHT_ROTATION);
		return getFallingFigure();
	}	

	@GetMapping("/down")
	public ResponseEntity<ArrayList<Box>> down() {
		this.engine.rotate(Figure.LEFT_ROTATION);
		return getFallingFigure();
	}
	
	@GetMapping("/space")
	public ResponseEntity<ArrayList<Box>> space() {
		while( this.engine.moveDown() );
		return getFallingFigure();
	}
	
	@GetMapping("/figures")
	public ResponseEntity<ArrayList<Box>> getFigures() {
		if( !this.engine.isRunning() ) {
			return null;
		}
		
		ArrayList<Box> boxes = new ArrayList<Box>();
		if( this.engine.listFigures.size() > 0 ) {
			this.engine.listFigures.forEach( x -> {
				boxes.addAll( x.listBoxes );
			});
		}
		return new ResponseEntity<ArrayList<Box>>(boxes, HttpStatus.OK);
	}
	
	@GetMapping("/fallingFigure")
	public ResponseEntity<ArrayList<Box>> getFallingFigure() {
		if( !this.engine.isRunning() ) {
			return null;
		}

		ArrayList<Box> boxes = new ArrayList<Box>();
		if( this.engine.fallingFigure != null && this.engine.isInsideOnly(this.engine.fallingFigure) ) {
			boxes.addAll( this.engine.fallingFigure.listBoxes );
		}
		return new ResponseEntity<ArrayList<Box>>(boxes, HttpStatus.OK);
	}

}