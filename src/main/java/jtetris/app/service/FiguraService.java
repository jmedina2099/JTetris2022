/**
 * 
 */
package jtetris.app.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jtetris.app.model.FiguraBD;
import jtetris.app.repository.FiguraRepository;

/**
 * @author jmedina
 *
 */
@Service
public class FiguraService implements IFiguraService {
	
	@Autowired
    private FiguraRepository repository;

	@Override
	public List<FiguraBD> findAll() {
		var figuras = (List<FiguraBD>) repository.findAll();
		return figuras;
	}

}
