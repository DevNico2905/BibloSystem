package com.biblioteca.prestamos.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import com.biblioteca.prestamos.dto.PrestamoDTO;
import com.biblioteca.prestamos.model.Prestamo;

@Service
public class PrestamoEnriquecidoService {

    @Autowired
    private RestTemplate restTemplate;

    private final String USUARIOS_SERVICE_URL = "http://usuarios-service:8082/api/usuarios";
    private final String LIBROS_SERVICE_URL = "http://libros-service:8081/api/libros";

    // Cache simple para evitar múltiples llamadas al mismo recurso
    private Map<Long, String> usuarioCache = new HashMap<>();
    private Map<Long, String> libroCache = new HashMap<>();

    /**
     * Enriquece un préstamo con el nombre de usuario y título de libro
     */
    public PrestamoDTO enriquecer(Prestamo prestamo) {
        String nombreUsuario = obtenerNombreUsuario(prestamo.getUsuarioId());
        String tituloLibro = obtenerTituloLibro(prestamo.getLibroId());

        return new PrestamoDTO(
                prestamo.getId(),
                prestamo.getUsuarioId(),
                prestamo.getLibroId(),
                nombreUsuario,
                tituloLibro,
                prestamo.getFechaPrestamo(),
                prestamo.getFechaDevolucion(),
                prestamo.getFechaDevolucionReal(),
                prestamo.getEstado());
    }

    /**
     * Enriquece una lista de préstamos
     */
    public List<PrestamoDTO> enriquecerLista(List<Prestamo> prestamos) {
        List<PrestamoDTO> dtos = new ArrayList<>();
        for (Prestamo p : prestamos) {
            dtos.add(enriquecer(p));
        }
        return dtos;
    }

    /**
     * Obtiene el nombre del usuario desde usuarios-service con caché
     */
    private String obtenerNombreUsuario(Long usuarioId) {
        if (usuarioId == null)
            return "N/A";

        // Verificar caché
        if (usuarioCache.containsKey(usuarioId)) {
            return usuarioCache.get(usuarioId);
        }

        try {
            String url = USUARIOS_SERVICE_URL + "/" + usuarioId;
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            if (response == null) {
                return "N/A";
            }
            String nombre = (String) response.get("nombre");
            if (nombre == null) {
                nombre = response.get("email") != null ? (String) response.get("email") : "N/A";
            }
            usuarioCache.put(usuarioId, nombre);
            return nombre;
        } catch (RestClientException e) {
            System.err.println("Error obteniendo usuario " + usuarioId + ": " + e.getMessage());
            return "N/A";
        } catch (Exception e) {
            System.err.println("Error inesperado obteniendo usuario " + usuarioId + ": " + e.getMessage());
            return "N/A";
        }
    }

    /**
     * Obtiene el título del libro desde libros-service con caché
     */
    private String obtenerTituloLibro(Long libroId) {
        if (libroId == null)
            return "N/A";

        // Verificar caché
        if (libroCache.containsKey(libroId)) {
            return libroCache.get(libroId);
        }

        try {
            String url = LIBROS_SERVICE_URL + "/" + libroId;
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            if (response == null) {
                return "N/A";
            }
            String titulo = (String) response.get("titulo");
            if (titulo == null) {
                titulo = response.get("autor") != null ? (String) response.get("autor") : "N/A";
            }
            libroCache.put(libroId, titulo);
            return titulo;
        } catch (RestClientException e) {
            System.err.println("Error obteniendo libro " + libroId + ": " + e.getMessage());
            return "N/A";
        } catch (Exception e) {
            System.err.println("Error inesperado obteniendo libro " + libroId + ": " + e.getMessage());
            return "N/A";
        }
    }
}
