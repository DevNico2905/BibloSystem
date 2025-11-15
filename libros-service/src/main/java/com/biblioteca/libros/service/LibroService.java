package com.biblioteca.libros.service;

import com.biblioteca.libros.model.Libro;
import com.biblioteca.libros.repository.LibroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.lang.NonNull;

import java.util.List;
import java.util.Optional;

@Service
public class LibroService {

    @Autowired
    private LibroRepository libroRepository;

    public List<Libro> getAllLibros() {
        return libroRepository.findAll();
    }

    public Optional<Libro> getLibroById(@NonNull Long id) {
        return libroRepository.findById(id);
    }

    public Libro createLibro(Libro libro) {
        libro.setStockDisponible(libro.getStock());
        return libroRepository.save(libro);
    }

    public Optional<Libro> updateLibro(@NonNull Long id, Libro libroActualizado) {
        return libroRepository.findById(id).map(libro -> {
            libro.setTitulo(libroActualizado.getTitulo());
            libro.setAutor(libroActualizado.getAutor());
            libro.setIsbn(libroActualizado.getIsbn());
            libro.setCategoria(libroActualizado.getCategoria());
            libro.setFechaPublicacion(libroActualizado.getFechaPublicacion());
            libro.setStock(libroActualizado.getStock());
            libro.setEditorial(libroActualizado.getEditorial());
            libro.setDescripcion(libroActualizado.getDescripcion());
            return libroRepository.save(libro);
        });
    }

    public boolean deleteLibro(@NonNull Long id) {
        if (libroRepository.existsById(id)) {
            libroRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<Libro> buscarPorTitulo(String titulo) {
        return libroRepository.findByTituloContainingIgnoreCase(titulo);
    }

    public boolean isDisponible(@NonNull Long id) {
        return libroRepository.findById(id).map(libro -> libro.getStockDisponible() > 0).orElse(false);
    }

    public Optional<Libro> actualizarStock(@NonNull Long id, int cantidad) {
        return libroRepository.findById(id).map(libro -> {
            libro.setStockDisponible(libro.getStockDisponible() + cantidad);
            return libroRepository.save(libro);
        });
    }
}