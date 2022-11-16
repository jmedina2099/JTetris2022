package jtetris.engine;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import jtetris.api.model.Board;
import jtetris.api.rabbitmq.SendToQueue;
import jtetris.figure.Box;
import jtetris.figure.Figure;
import jtetris.figure.FigureFactory;
import jtetris.ui.PanelScore;
import jtetris.ui.PanelTetris;

/**
 * @author jmedina
 *
 */
@Component
public class Engine implements Runnable {
	
	protected FigureFactory figureFactory;
	private PanelTetris panelTetris;
	private PanelScore panelScore;
	
	public boolean running = false;
	private int score = 0;
	
	public Figure fallingFigure;
	public boolean isPaused = false;
	public boolean gameOver = false;

	public ArrayList<Figure> listFigures = new ArrayList<Figure>();
	private Object b;
	private Thread thread;
	
	@Autowired
	private SendToQueue sendToQueue;

	public boolean figureFell = false;

	public Engine() {
		this.figureFactory = new FigureFactory(this);
	}
	
	private void addScore(int score) {
		this.score += score;
	}
	
	public boolean isRunning() {
		return running;
	}

	public void setRunning(boolean running) {
		this.running = running;
	}	

	public boolean isPaused() {
		return isPaused;
	}

	public void setPaused(boolean isPaused) {
		this.isPaused = isPaused;
	}

	public boolean isGameOver() {
		return gameOver;
	}

	public void setGameOver(boolean gameOver) {
		this.gameOver = gameOver;
	}

	public void setPanelTetris(PanelTetris panelTetris) {
		this.panelTetris = panelTetris;
	}
	
	public void setPanelScore(PanelScore panelScore) {
		this.panelScore = panelScore;
	}
	
	public int getScore() {
		return this.score;
	}

	public void doStart() {
		this.thread = new Thread( this );
		synchronized (thread) {
			thread.start();
		}
	}

	private Figure getNextFigure() {
		return this.figureFactory.getNextFigure();
	}
	
	public Figure getFigureFalling() {
		return this.fallingFigure;
	}

	public boolean togglePause() {
		if( this.gameOver ) {
			return false;
		}
		
		this.isPaused  = !this.isPaused;
		if( !this.isPaused && this.b != null ) {
			this.thread.notify();
		}
		if( this.panelTetris != null ) this.panelTetris.repaint(0);
		return this.isPaused;
	}
	
	public void gameOver() {
		this.fallingFigure = null;
		this.listFigures = new ArrayList<Figure>();
		this.isPaused = false;
		this.gameOver = true;
		if( this.panelTetris != null ) this.panelTetris.repaint(0);
	}
	
	public boolean addFigure( Figure figure ) {
		if( hit(figure.listBoxes) ) {
			return false;
		}
		this.fallingFigure = figure;
		this.figureFell  = false; // new figure.
		if( this.panelTetris != null ) this.panelTetris.repaint(0);
		return true;
	}	
	
	public boolean rotate( int direction ) {
		if( this.fallingFigure != null && !this.figureFell ) {
			Figure figureCopy = this.fallingFigure.clone();
			figureCopy.rotate(direction);
			if( isInside( figureCopy ) &&
				!hit( figureCopy.getListBoxes() ) ) {
				this.fallingFigure.listBoxes = figureCopy.listBoxes;
				this.fallingFigure.rotation = figureCopy.rotation;
				if( this.panelTetris != null ) this.panelTetris.repaint(0);
				return true;
			}
		}
		return false;
	}
	
	public boolean moveLeft() {
		if( this.fallingFigure != null && !this.figureFell ) {
			if(  0d <= this.fallingFigure.getXMin()-Box.SIZE ) {
				if( !hitLeft( this.fallingFigure.getListBoxes() ) ) {
					this.fallingFigure.moveLeft();
					if( this.panelTetris != null ) this.panelTetris.repaint(0);
					return true;
				}
			}
		}
		return false;
	}

	public boolean moveRight() {
		if( this.fallingFigure != null && !this.figureFell ) {
			if( this.fallingFigure.getXMax()+Box.SIZE < 200d ) {
				if( !hitRight( this.fallingFigure.getListBoxes() ) ) {
					this.fallingFigure.moveRight();
					if( this.panelTetris != null ) this.panelTetris.repaint(0);
					return true;
				}
			}
		}
		return false;
	}
	
	public boolean moveDown() {
		if( this.fallingFigure != null && !this.figureFell ) {
			if( this.fallingFigure.getYMax()+Box.SIZE < 400d ) {
				if( !hitDown( this.fallingFigure.getListBoxes() ) ) {
					this.fallingFigure.moveDown();
					if( this.panelTetris != null ) this.panelTetris.repaint(0);
					return true;
				}
			}
		}
		return false;
	}

	private void fixAndClear() {
		this.listFigures.add( this.fallingFigure );
		int score = clearLines( this.fallingFigure );
		if( score > 0 ) {
			addScore(score);
			if( this.panelScore != null ) this.panelScore.setScore( this.score );
			if( this.sendToQueue != null ) this.sendToQueue.sendScore(this.score);
		}
	}

	private int clearLines( Figure figure ) {
		int score = 0;
		int lineasWipe = 0;
		
		int yMin = (int)figure.getYMin();
		int yMax = (int)figure.getYMax();
		for( int i=yMax; yMin<=i; ) {
			List<Box> boxes = new ArrayList<Box>(); 
			int[] j = { i };
			this.listFigures.forEach( x -> {
				boxes.addAll( x.getBoxesWithY( j[0] ) );
			});
			if( boxes.size() == 10 ) { // line clear!
				boxes.forEach( x -> x.clearBox() );
				score += 10;
				lineasWipe++;
				this.listFigures.forEach( x -> {
					x.listBoxes.forEach( b -> {
						if( b.coord.y < j[0] ) {
							b.coord.y += Box.SIZE;
						}
					});
				});
				yMin += Box.SIZE;
			} else {
				i -= Box.SIZE;
			}
		}
		
		return score+(lineasWipe*5);
	}	

	@Override
	public void run() {
		
		this.gameOver = false;
		this.isPaused = false;
		this.running = true;
		this.score = 0;
		this.figureFell = false;
		if( this.panelScore != null ) this.panelScore.setScore( this.score );

		Figure figure = getNextFigure();
		addFigure( figure );

		synchronized (this.thread) {
			while( this.running ) {
	
				try {
					while( this.isPaused ) {
						this.thread.wait(1000);
					}
				} catch (InterruptedException e) {
					e.printStackTrace();
				}
				
				try {
					Thread.sleep( 1000 );
				} catch (InterruptedException e) {
					e.printStackTrace();
				}
				
				if( !moveDown() ) {
					this.figureFell = true; // figure fixed.
					fixAndClear();
					if( !addFigure( figure = getNextFigure() ) ) {
						gameOver();
						this.running = false;
					}
					if( this.sendToQueue != null ) {
						int hash = getHash();
						this.sendToQueue.sendHashBoard( hash );
						this.sendToQueue.sendFiguras( getFiguresBoxes() );
						Figure figureFalling = getFallingFigureInside();
						if( figureFalling != null ) {
							figureFalling.setHashBoard( hash );
							this.sendToQueue.sendFiguraCayendo( figureFalling );
						}
					}
				}
			}
		}
	}

	private boolean hit( ArrayList<Box> boxesFalling ) {
		boolean chokaVar[] = { false };
		this.listFigures.forEach( x -> {
			if( x.hit(boxesFalling) ) {
				chokaVar[0] = true;
			}
		});
		return chokaVar[0];
	}

	private boolean hitDown( ArrayList<Box> boxesFalling ) {
		boolean chokaVar[] = { false };
		this.listFigures.forEach( x -> {
			if( x.hitDown(boxesFalling) ) {
				chokaVar[0] = true;
			}
		});
		return chokaVar[0];
	}
	
	private boolean hitRight( ArrayList<Box> boxesFalling ) {
		boolean chokaVar[] = { false };
		this.listFigures.forEach( x -> {
			if( x.hitRight(boxesFalling) ) {
				chokaVar[0] = true;
			}
		});
		return chokaVar[0];
	}	

	private boolean hitLeft( ArrayList<Box> boxesFalling ) {
		boolean chokaVar[] = { false };
		this.listFigures.forEach( x -> {
			if( x.hitLeft(boxesFalling) ) {
				chokaVar[0] = true;
			}
		});
		return chokaVar[0];
	}	

	
	public boolean isInside(Figure figureCopy) {
		if( figureCopy.getXMin() < 0 ) {
			figureCopy.moveRight();
			return isInsideOnly( figureCopy );
		} else if( 200 < figureCopy.getXMax()+Box.SIZE ) {
			figureCopy.moveLeft();
			return isInsideOnly( figureCopy );
		} else if( figureCopy.getYMin() < 0 ) {
			figureCopy.moveDown();
			return isInsideOnly( figureCopy );
		} else if( 400d < figureCopy.getYMax()+Box.SIZE ) {
			figureCopy.moveUp();
			return isInsideOnly( figureCopy );
		}
		return true;
	}
	
	public boolean isInsideOnly( Figure figure ) {
		return ( figure!=null && 0 <= figure.getXMin() &&
				0 <= figure.getYMin() &&
				figure.getXMax()+Box.SIZE <= 200 &&
				figure.getYMax()+Box.SIZE <= 400d );
	}

	public int getHash() {
		int[] hash = {0};
		ArrayList<Figure> listOfFigures = this.listFigures;
		listOfFigures.forEach( x -> {
			hash[0] ^= x.getHash();
		});
		int hashFinal = this.fallingFigure != null? hashFinal = hash[0]^this.fallingFigure.getHash(): hash[0];
		return hashFinal;
	}
	
	public Figure getFallingFigureInside() {
		if( !isRunning() ) {
			return null;
		}
		
		Figure figureFalling = getFigureFalling();
		if( isInsideOnly(figureFalling) ) {
			return figureFalling;
		} else {
			return null;
		}
	}
	
	private ArrayList<Box> getFiguresBoxes() {
		if( !isRunning() ) {
			return null;
		}
		
		ArrayList<Box> boxes = new ArrayList<Box>();

		if( !this.listFigures.isEmpty() ) {
			ArrayList<Figure> figuras = new ArrayList<Figure>(this.listFigures);
			figuras.forEach( x -> {
				boxes.addAll( x.listBoxes );
			});
		}

		return boxes;
	}

	
	public Board getBoard() {
		Board board = new Board();
		
		int hashBoard = getHash();
		Figure fallingFigure = getFallingFigureInside();
		if( fallingFigure != null ) {
			fallingFigure.setHashBoard(hashBoard);
		}
		
		board.setHash( hashBoard );
		board.setRunning( isRunning() );
		board.setPaused( isPaused() );
		board.setFallingFigure( fallingFigure );
		board.setFiguresFixed( getFiguresBoxes() );
		board.setScore( getScore() );
		board.setGameOver( isGameOver() );
		
		return board;
	}
}
