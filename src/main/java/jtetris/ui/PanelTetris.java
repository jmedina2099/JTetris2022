package jtetris.ui;

import java.awt.Color;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.font.FontRenderContext;
import java.awt.geom.AffineTransform;

import javax.swing.JPanel;
import javax.swing.border.LineBorder;

import jtetris.engine.Engine;

/**
 * @author jmedina
 *
 */
public class PanelTetris extends JPanel {

	private static final long serialVersionUID = 9134781961868473813L;
	
	private Font fontTxt = new Font( "Liberation Serif", Font.PLAIN, 32);

	private Engine engine;

	public PanelTetris( Engine engine ) {
		super(true);
		this.engine = engine;
		init();
	}

	private void init() {
		setBackground( Color.BLACK );
		setBorder( new LineBorder( Color.RED, 3 ) );
		setPreferredSize( new Dimension(200,400) );
		setMinimumSize( new Dimension(200,400) );
		setMaximumSize( new Dimension(200,400) );
	}

	@Override
	protected void paintComponent(Graphics g) {
		super.paintComponent(g);
		
		Graphics2D g2 = (Graphics2D)g;
		
		if( !this.engine.isPaused && !this.engine.gameOver ) {
	
			if( this.engine.fallingFigure != null ) {
				this.engine.fallingFigure.paint(g2);
			}
			this.engine.listFigures.stream().forEach( x -> doPaint(x::paint, g2) );
		} else {
			String message = "PAUSED";
			if( this.engine.gameOver ) {
				message = "GAME OVER";
				System.out.println( "GAME OVER" );
			}
			
			g2.setRenderingHint( RenderingHints.KEY_ANTIALIASING,RenderingHints.VALUE_ANTIALIAS_ON );
			g2.setFont( fontTxt );

			FontRenderContext frc = new FontRenderContext(new AffineTransform(),true,true);     
			int textwidth = (int)(fontTxt.getStringBounds(message, frc).getWidth());
			int textheight = (int)(fontTxt.getStringBounds(message, frc).getHeight());
			
			float x = (200-textwidth)/2f;
			float y = (400-textheight)/2f;
			
			g2.setColor( Color.WHITE );
			g2.drawString( message, x, y);
		}
	}

	private void doPaint(PaintWithGraphics2D method, Graphics2D g2) {
		method.paint(g2);
	}

	private interface PaintWithGraphics2D {
	    public void paint(Graphics2D g2);
	}

}
