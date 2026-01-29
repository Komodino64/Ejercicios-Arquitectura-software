package model;

public class InvitadoUsuario extends Usuario {

    public InvitadoUsuario(String nombre) {
        super(nombre, "");
    }

    @Override
    public void mostrarInfo() {
        System.out.println("Invitado: " + getNombre());
    }
}
