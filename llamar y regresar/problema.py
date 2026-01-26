# ==========================================
# ACTIVIDAD: Completa el programa
# Usando arquitectura llamar y regresar
# ==========================================

def main():
    print("=== SISTEMA DE COMPRA ===")

    producto = pedir_producto()
    precio = obtener_precio(producto)
    total = calcular_total(precio)
    mostrar_total(total)


def pedir_producto():
    producto = input("Ingrese el nombre del producto: ")
    return producto


def obtener_precio(producto):
    precio = 1000
    print(f"Producto seleccionado: {producto}")
    print(f"Precio base: {precio}")
    return precio


def calcular_total(precio):
    iva = precio * 0.21
    total = precio + iva
    return total


def mostrar_total(total):
    print(f"Total a pagar (con IVA): {total}")


main()