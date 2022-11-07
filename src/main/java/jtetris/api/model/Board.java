/**
 * 
 */
package jtetris.api.model;

import java.util.ArrayList;

import jtetris.figure.Box;

/**
 * @author jmedina
 *
 */
public class Board {
	
	ArrayList<Box> figuresFixed;
	ArrayList<Box> fallingFigure;
	
	int score;
	
	ArrayList<Box> nextFigure;
	
	boolean running;
	boolean paused;
	
	public Board() {
	}

	public ArrayList<Box> getFiguresFixed() {
		return figuresFixed;
	}

	public void setFiguresFixed(ArrayList<Box> figuresFixed) {
		this.figuresFixed = figuresFixed;
	}

	public ArrayList<Box> getFallingFigure() {
		return fallingFigure;
	}

	public void setFallingFigure(ArrayList<Box> fallingFigure) {
		this.fallingFigure = fallingFigure;
	}

	public int getScore() {
		return score;
	}

	public void setScore(int score) {
		this.score = score;
	}

	public ArrayList<Box> getNextFigure() {
		return nextFigure;
	}

	public void setNextFigure(ArrayList<Box> nextFigure) {
		this.nextFigure = nextFigure;
	}

	public boolean isRunning() {
		return running;
	}

	public void setRunning(boolean running) {
		this.running = running;
	}

	public boolean isPaused() {
		return paused;
	}

	public void setPaused(boolean paused) {
		this.paused = paused;
	}

}
