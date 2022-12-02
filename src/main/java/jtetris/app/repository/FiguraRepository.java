package jtetris.app.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import jtetris.app.model.FiguraBD;

@Repository
public interface FiguraRepository extends CrudRepository<FiguraBD, Long> {

	Iterable<FiguraBD> findAll();
}