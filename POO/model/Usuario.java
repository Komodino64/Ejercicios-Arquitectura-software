package model;

public class Usuario {
    private String nombre;
    private String email;

    public Usuario(String nombre, String email) {
        this.nombre = nombre;
        this.email = email;
    }

    public void mostrarInfo() {
        System.out.println("Usuario: " + nombre + " | Email: " + email);
    }

    public String getNombre() {
        return nombre;
    }
}
