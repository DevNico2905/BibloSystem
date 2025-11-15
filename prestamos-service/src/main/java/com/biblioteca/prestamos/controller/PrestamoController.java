package com.biblioteca.prestamos.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.biblioteca.prestamos.dto.PrestamoDTO;
import com.biblioteca.prestamos.model.Prestamo;
import com.biblioteca.prestamos.service.PrestamoService;
import com.biblioteca.prestamos.service.PrestamoEnriquecidoService;

@RestController
@RequestMapping("/api/prestamos")
@CrossOrigin(origins = "*")
public class PrestamoController {

	@Autowired
	private PrestamoService prestamoService;

	@Autowired
	private PrestamoEnriquecidoService prestamoEnriquecidoService;

	@GetMapping
	public ResponseEntity<List<PrestamoDTO>> getAllPrestamos() {
		List<Prestamo> prestamos = prestamoService.getAllPrestamos();
		List<PrestamoDTO> dtos = prestamoEnriquecidoService.enriquecerLista(prestamos);
		return ResponseEntity.ok(dtos);
	}

	@GetMapping("/{id}")
	public ResponseEntity<PrestamoDTO> getPrestamoById(@PathVariable @NonNull Long id) {
		return prestamoService.getPrestamoById(id)
				.map(p -> {
					PrestamoDTO dto = prestamoEnriquecidoService.enriquecer(p);
					return ResponseEntity.ok(dto);
				})
				.orElseGet(() -> ResponseEntity.notFound().build());
	}

	@PostMapping
	public ResponseEntity<Prestamo> createPrestamo(@RequestBody @NonNull Prestamo prestamo) {
		Prestamo createdPrestamo = prestamoService.createPrestamo(prestamo);
		return ResponseEntity.status(HttpStatus.CREATED).body(createdPrestamo);
	}

	@PutMapping("/{id}")
	public ResponseEntity<Prestamo> updatePrestamo(@PathVariable @NonNull Long id,
			@RequestBody Prestamo prestamoDetails) {
		return prestamoService.updatePrestamo(id, prestamoDetails)
				.map(p -> ResponseEntity.ok(p))
				.orElseGet(() -> ResponseEntity.notFound().build());
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deletePrestamo(@PathVariable @NonNull Long id) {
		prestamoService.deletePrestamo(id);
		return ResponseEntity.noContent().build();
	}

	@PutMapping("/{id}/devolver")
	public ResponseEntity<PrestamoDTO> devolverPrestamo(@PathVariable @NonNull Long id) {
		return prestamoService.devolverPrestamo(id)
				.map(p -> {
					PrestamoDTO dto = prestamoEnriquecidoService.enriquecer(p);
					return ResponseEntity.ok(dto);
				})
				.orElseGet(() -> ResponseEntity.notFound().build());
	}

}
