/**
 * 
 */
package jtetris.api.model;

import java.util.ArrayList;

import jtetris.figure.Box;
import jtetris.figure.Figure;

/**
 * @author jmedina
 *
 */
public class Board {
	
	ArrayList<Box> figuresFixed;
	Figure fallingFigure;
	
	int score;
	
	ArrayList<Box> nextFigure;
	
	boolean running;
	boolean paused;
	boolean gameOver;
	int hash;
	String timestamp;
	
	public Board() {
		this.timestamp = ""+System.currentTimeMillis();
	}

	public ArrayList<Box> getFiguresFixed() {
		return figuresFixed;
	}

	public void setFiguresFixed(ArrayList<Box> figuresFixed) {
		this.figuresFixed = figuresFixed;
	}

	public Figure getFallingFigure() {
		return fallingFigure;
	}

	public void setFallingFigure(Figure fallingFigure) {
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

	public boolean isGameOver() {
		return gameOver;
	}

	public void setGameOver(boolean gameOver) {
		this.gameOver = gameOver;
	}

	public void setHash(int hash) {
		this.hash = hash;
	}

	public int getHash() {
		return hash;
	}

	public String getTimestamp() {
		return timestamp;
	}

}
