package com.biblioteca.libros.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "libros")
public class Libro {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String titulo;
    
    @Column(nullable = false)
    private String autor;
    
    private String isbn;
    
    @Column(nullable = false)
    private String categoria;
    
    @Column(name = "fecha_publicacion")
    private LocalDate fechaPublicacion;
    
    @Column(nullable = false)
    private Integer stock;
    
    @Column(name = "stock_disponible", nullable = false)
    private Integer stockDisponible;
    
    private String editorial;
    
    @Column(length = 1000)
    private String descripcion;

    // Constructor vacío (requerido por JPA)
    public Libro() {
    }

    // Getters y Setters
    public Long getId() { 
        return id; 
    }
    
    public void setId(Long id) { 
        this.id = id; 
    }

    public String getTitulo() { 
        return titulo; 
    }
    
    public void setTitulo(String titulo) { 
        this.titulo = titulo; 
    }

    public String getAutor() { 
        return autor; 
    }
    
    public void setAutor(String autor) { 
        this.autor = autor; 
    }

    public String getIsbn() { 
        return isbn; 
    }
    
    public void setIsbn(String isbn) { 
        this.isbn = isbn; 
    }

    public String getCategoria() { 
        return categoria; 
    }
    
    public void setCategoria(String categoria) { 
        this.categoria = categoria; 
    }

    public LocalDate getFechaPublicacion() { 
        return fechaPublicacion; 
    }
    
    public void setFechaPublicacion(LocalDate fechaPublicacion) { 
        this.fechaPublicacion = fechaPublicacion; 
    }

    public Integer getStock() { 
        return stock; 
    }
    
    public void setStock(Integer stock) { 
        this.stock = stock; 
    }

    public Integer getStockDisponible() { 
        return stockDisponible; 
    }
    
    public void setStockDisponible(Integer stockDisponible) { 
        this.stockDisponible = stockDisponible; 
    }

    public String getEditorial() { 
        return editorial; 
    }
    
    public void setEditorial(String editorial) { 
        this.editorial = editorial; 
    }

    public String getDescripcion() { 
        return descripcion; 
    }
    
    public void setDescripcion(String descripcion) { 
        this.descripcion = descripcion; 
    }
}