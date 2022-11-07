/**
 * 
 */
package jtetris.ui;

import java.awt.Color;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.RenderingHints;

import javax.swing.JPanel;
import javax.swing.border.LineBorder;

/**
 * @author jmedina
 *
 */
public class PanelScore extends JPanel {

	private static final long serialVersionUID = -1065298429659866258L;
	
	private int score = 0;
	
	private Font fontTxt = new Font( "Liberation Serif", Font.BOLD, 16);

	public PanelScore() {
		super(true);
		init();
	}
	
	public void addScore( int score ) {
		this.score += score;
		repaint(0);
	}

	private void init() {
		setBackground( Color.WHITE );
		setBorder( new LineBorder( Color.BLACK, 3 ) );
		setPreferredSize( new Dimension(100,50) );
		setMinimumSize( new Dimension(100,50) );
		setMaximumSize( new Dimension(100,50) );
		setLocation( 0, 20 );
	}
	
	@Override
	protected void paintComponent(Graphics g) {
		super.paintComponent(g);
		
		Graphics2D g2 = (Graphics2D)g;
		
		g2.setRenderingHint( RenderingHints.KEY_ANTIALIASING,RenderingHints.VALUE_ANTIALIAS_ON );
		g2.setFont(fontTxt);
		g2.setColor( Color.BLACK );
		g2.drawString( ""+this.score, 20, 30);
	}
}
