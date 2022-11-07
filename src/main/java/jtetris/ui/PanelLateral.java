/**
 * 
 */
package jtetris.ui;

import java.awt.Color;
import java.awt.Dimension;

import javax.swing.Box;
import javax.swing.BoxLayout;
import javax.swing.JPanel;
import javax.swing.border.LineBorder;

/**
 * @author jmedina
 *
 */
public class PanelLateral extends JPanel {

	private static final long serialVersionUID = 2765098544664307827L;
	
	public PanelScore panelScore;

	public PanelLateral() {
		super(true);
		init();
	}
	
	private void init() {
		setLayout( new BoxLayout(this, BoxLayout.Y_AXIS ));
		setBackground( Color.BLACK );
		setBorder( new LineBorder( Color.BLUE, 3 ) );
		setPreferredSize( new Dimension(100,400) );
		setMinimumSize( new Dimension(100,400) );
		setMaximumSize( new Dimension(100,400) );
		
		this.panelScore = new PanelScore();
		
		add( this.panelScore );
		add( Box.createVerticalGlue() );
	}	
}
