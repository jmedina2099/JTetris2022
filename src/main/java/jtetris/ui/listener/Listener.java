package jtetris.ui.listener;

import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;

import jtetris.engine.Engine;
import jtetris.figure.Figure;

/**
 * @author jmedina
 *
 */
public class Listener 
	implements KeyListener {
	
	private Engine engine;
	
	public Listener( Engine engine ) {
		this.engine = engine;
	}

	@Override
	public void keyPressed(KeyEvent e) {
		int keyCode = e.getKeyCode();
	    switch( keyCode ) { 
	        case KeyEvent.VK_UP:
	        	if( !this.engine.isPaused )
	        		this.engine.rotate(Figure.RIGHT_ROTATION); 
	            break;
	        case KeyEvent.VK_DOWN:
	        	if( !this.engine.isPaused )
	        		this.engine.rotate(Figure.LEFT_ROTATION); 
	            break;
	        case KeyEvent.VK_LEFT:
	        	if( !this.engine.isPaused )
	        		this.engine.moveLeft();
	            break;
	        case KeyEvent.VK_RIGHT :
	        	if( !this.engine.isPaused )
	        		this.engine.moveRight();
	            break;
        	case KeyEvent.VK_SPACE:
        		if( !this.engine.isPaused )
        			while( this.engine.moveDown() );
        		break;
        	case KeyEvent.VK_ENTER:
        		if( !this.engine.running ) {
        			this.engine.doStart();
        		} else {
        			this.engine.togglePause();
        		}
        		break;
	     }
	}

	@Override
	public void keyReleased(KeyEvent e) {
	}

	@Override
	public void keyTyped(KeyEvent e) {
	}

}
