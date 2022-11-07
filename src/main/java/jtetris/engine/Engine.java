package jtetris.engine;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

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
	
	public Figure fallingFigure;
	public boolean isPaused = false;
	public boolean gameOver = false;

	public ArrayList<Figure> listFigures = new ArrayList<Figure>();
	private Object b;
	private Thread thread;

	public Engine() {
		this.figureFactory = new FigureFactory(this);
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

	public void setPanelTetris(PanelTetris panelTetris) {
		this.panelTetris = panelTetris;
	}
	
	public void setPanelScore(PanelScore panelScore) {
		this.panelScore = panelScore;
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
		this.listFigures.clear();
		this.isPaused = false;
		this.gameOver = true;
		if( this.panelTetris != null ) this.panelTetris.repaint(0);
	}
	
	public boolean addFigure( Figure figure ) {
		if( hit(figure.listBoxes) ) {
			return false;
		}
		this.fallingFigure = figure;
		if( this.panelTetris != null ) this.panelTetris.repaint(0);
		return true;
	}	
	
	public void rotate( int direction ) {
		if( this.fallingFigure != null ) {
			Figure figureCopy = this.fallingFigure.clone();
			figureCopy.rotate(direction);
			if( isInside( figureCopy ) &&
				!hit( figureCopy.getListBoxes() ) ) {
				this.fallingFigure.listBoxes = figureCopy.listBoxes;
				this.fallingFigure.rotation = figureCopy.rotation;
				if( this.panelTetris != null ) this.panelTetris.repaint(0);
			}
		}
	}
	
	public boolean moveLeft() {
		if( this.fallingFigure != null ) {
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
		if( this.fallingFigure != null ) {
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
		if( this.fallingFigure != null ) {
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
		if( this.panelScore != null ) this.panelScore.addScore(score);
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
					fixAndClear();
					if( !addFigure( figure = getNextFigure() ) ) {
						gameOver();
						this.running = false;
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
		return ( 0 <= figure.getXMin() &&
				0 <= figure.getYMin() &&
				figure.getXMax()+Box.SIZE <= 200 &&
				figure.getYMax()+Box.SIZE <= 400d );
	}
	
}
