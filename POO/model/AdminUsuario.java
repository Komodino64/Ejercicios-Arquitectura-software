package model;

public class AdminUsuario extends Usuario {
    private String rol;

    public AdminUsuario(String nombre, String email, String rol) {
        super(nombre, email);
        this.rol = rol;
    }

    @Override
    public void mostrarInfo() {
        super.mostrarInfo();
        System.out.println("Rol: " + rol);
    }
}
