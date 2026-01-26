pedidos = [
    {"cliente": "Ana", "producto": "Laptop", "precio": 2000, "cantidad": 1},
    {"cliente": "Luis", "producto": "Mouse", "precio": 50, "cantidad": 2},
    {"cliente": "Sara", "producto": "Teclado", "precio": -30, "cantidad": 1},
    {"cliente": "Juan", "producto": "Monitor", "precio": 900, "cantidad": 1}
]

def validar_pedidos(pedidos):
    # Solo acepta precios y cantidades positivas
    return [p for p in pedidos if p["precio"] > 0 and p["cantidad"] > 0]

def calcular_subtotal(pedidos):
    for p in pedidos:
        p["subtotal"] = p["precio"] * p["cantidad"]
    return pedidos

def aplicar_descuento(pedidos):
    for p in pedidos:
        descuento = 0

        if p["subtotal"] >= 1000:
            descuento = 0.10
        elif p["cantidad"] > 1:
            descuento = 0.05

        p["descuento"] = p["subtotal"] * descuento
        p["total_con_descuento"] = p["subtotal"] - p["descuento"]

    return pedidos

def aplicar_impuesto(pedidos):
    for p in pedidos:
        p["total"] = p["total_con_descuento"] * 1.19
    return pedidos

def clasificar_pedido(pedidos):
    for p in pedidos:
        if p["total"] >= 1000:
            p["categoria"] = "Alto valor"
        else:
            p["categoria"] = "Valor estándar"
    return pedidos

def generar_reporte(pedidos):
    for p in pedidos:
        print(
            f"{p['cliente']} | {p['producto']} | "
            f"Total: {p['total']:.2f} | "
            f"Descuento: {p['descuento']:.2f} | "
            f"{p['categoria']}"
        )

# ---------- MAIN ----------
if __name__ == "__main__":
    pedidos_validos = validar_pedidos(pedidos)
    pedidos_con_subtotal = calcular_subtotal(pedidos_validos)
    pedidos_con_descuento = aplicar_descuento(pedidos_con_subtotal)
    pedidos_con_impuesto = aplicar_impuesto(pedidos_con_descuento)
    pedidos_clasificados = clasificar_pedido(pedidos_con_impuesto)
    generar_reporte(pedidos_clasificados)