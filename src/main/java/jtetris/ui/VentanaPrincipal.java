package jtetris.ui;

import java.awt.Color;

import javax.swing.Box;
import javax.swing.BoxLayout;
import javax.swing.JFrame;
import javax.swing.JPanel;

import jtetris.engine.Engine;
import jtetris.ui.listener.Listener;

/**
 * @author jmedina
 *
 */
public class VentanaPrincipal 
	extends JFrame {

	private static final long serialVersionUID = -7645083003060705096L;

	protected PanelTetris panelTetris;
	private Engine engine;

	public VentanaPrincipal() {
		super( "JTetris v 2022" );
		init();
	}

	private void init() {
		setDefaultCloseOperation( JFrame.EXIT_ON_CLOSE );
		setBounds( 0, 0, 800, 600 );
		setLocationRelativeTo( null );
		
		this.engine = new Engine();
		this.panelTetris = new PanelTetris(this.engine);
		this.engine.setPanelTetris( this.panelTetris );

		initContentPane();
		addKeyListener( new Listener(this.engine) );
	}

	private void initContentPane() {
		JPanel panel = new JPanel();
		panel.setLayout( new BoxLayout(panel, BoxLayout.X_AXIS ));
		panel.setBackground( Color.BLACK );
		
		panel.add( Box.createHorizontalGlue() );
		panel.add( Box.createHorizontalStrut(100));
		panel.add( this.panelTetris );
		panel.add( Box.createHorizontalStrut(100));
		panel.add( Box.createHorizontalGlue() );
		
		setContentPane( panel );
	}

}
