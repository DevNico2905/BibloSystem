package com.biblioteca.prestamos.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.lang.NonNull;

import com.biblioteca.prestamos.model.Prestamo;
import com.biblioteca.prestamos.repository.PrestamoRepository;

@Service
public class PrestamoService {

	@Autowired
	private PrestamoRepository prestamoRepository;

	public List<Prestamo> getAllPrestamos() {
		return prestamoRepository.findAll();
	}

	public Optional<Prestamo> getPrestamoById(@NonNull Long id) {
		return prestamoRepository.findById(id);
	}

	public Prestamo createPrestamo(@NonNull Prestamo prestamo) {
		return prestamoRepository.save(prestamo);
	}

	public Optional<Prestamo> updatePrestamo(@NonNull Long id, Prestamo prestamoDetails) {
		return prestamoRepository.findById(id).map(prestamo -> {
			prestamo.setUsuarioId(prestamoDetails.getUsuarioId());
			prestamo.setLibroId(prestamoDetails.getLibroId());
			prestamo.setFechaPrestamo(prestamoDetails.getFechaPrestamo());
			prestamo.setFechaDevolucion(prestamoDetails.getFechaDevolucion());
			prestamo.setEstado(prestamoDetails.getEstado());
			return prestamoRepository.save(prestamo);
		});
	}

	public Optional<Prestamo> devolverPrestamo(@NonNull Long id) {
		return prestamoRepository.findById(id).map(prestamo -> {
			prestamo.setFechaDevolucionReal(java.time.LocalDate.now());
			prestamo.setEstado("DEVUELTO");
			return prestamoRepository.save(prestamo);
		});
	}

	public void deletePrestamo(@NonNull Long id) {
		prestamoRepository.deleteById(id);
	}

}
