import React from "react";
import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
} from "@react-pdf/renderer";
import { OrdenTrabajo } from "@/api/ordenTrabajoService";

interface OrderPDFProps {
    order: OrdenTrabajo;
}

const styles = StyleSheet.create({
    page: { padding: 40, fontSize: 12, fontFamily: "Helvetica" },
    header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
    headerLeft: { flexDirection: "column", justifyContent: "center" },
    headerRight: { textAlign: "right" },
    title: { fontSize: 16, fontWeight: "bold" },
    customerInfo: { marginBottom: 20 },
    table: { display: "flex", flexDirection: "column", width: "100%", borderWidth: 1, borderColor: "#ccc", marginBottom: 10 },
    tableHeader: { backgroundColor: "#f2f2f2", flexDirection: "row", borderBottomWidth: 1, borderColor: "#ccc" },
    tableRow: { flexDirection: "row", borderBottomWidth: 1, borderColor: "#ccc" },
    tableCell: { flex: 1, padding: 5, fontSize: 10 },
    tableCellCentered: { flex: 1, padding: 5, textAlign: "center", fontSize: 10 },
    footer: { marginTop: 20, fontSize: 10, textAlign: "center" },
    summary: { marginTop: 10, padding: 10, borderWidth: 1, borderColor: "#ccc", textAlign: "right" },
    bold: { fontWeight: "bold" },
    subtotalRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 5 },
    divider: { borderBottom: "1px solid #ccc", marginVertical: 5 },
});

const OrderPDF: React.FC<OrderPDFProps> = ({ order }) => {
    const cliente = order?.equipo?.cliente || {
        nombre: "N/A",
        apellido: "N/A",
        correo: "N/A",
        celular: "N/A",
    };
    const detalles = order?.detalles || [];
    const IVA = 0.21;

    const calcularTotales = () => {
        let baseImponible = 0;
        detalles.forEach((detalle) => {
            const subtotal = detalle.cantidad
                ? detalle.cantidad * (detalle.precioproducto || detalle.precioservicio || 0)
                : detalle.precioproducto || detalle.precioservicio || 0;
            baseImponible += subtotal;
        });
        const iva = baseImponible * IVA;
        const total = baseImponible + iva;
        return { baseImponible, iva, total };
    };

    const { baseImponible, iva, total } = calcularTotales();

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Encabezado */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Text style={styles.title}>Taller Electrónico XYZ</Text>
                        <Text>RUC: 1234567890</Text>
                        <Text>Dirección: Calle Ejemplo 123, Ciudad</Text>
                        <Text>Teléfono: +123 456 789</Text>
                        <Text>Correo: contacto@tallerxyz.com</Text>
                    </View>
                    <View style={styles.headerRight}>
                        <Text style={styles.title}>Factura #{order?.numero_orden || "N/A"}</Text>
                        <Text>Fecha: {order?.created_at ? new Date(order.created_at).toLocaleDateString("es-ES") : "N/A"}</Text>
                    </View>
                </View>

                {/* Información del cliente */}
                <View style={styles.customerInfo}>
                    <Text style={styles.bold}>Cliente:</Text>
                    <Text>Nombre: {cliente.nombre} {cliente.apellido}</Text>
                    <Text>Correo: {cliente.correo}</Text>
                    <Text>Celular: {cliente.celular}</Text>
                </View>

                {/* Detalles */}
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={styles.tableCellCentered}>CONCEPTO</Text>
                        <Text style={styles.tableCellCentered}>PRECIO</Text>
                        <Text style={styles.tableCellCentered}>UNIDADES</Text>
                        <Text style={styles.tableCellCentered}>DTO</Text>
                        <Text style={styles.tableCellCentered}>SUBTOTAL</Text>
                        <Text style={styles.tableCellCentered}>IVA</Text>
                        <Text style={styles.tableCellCentered}>TOTAL</Text>
                    </View>
                    {detalles.map((detalle, index) => (
                        <View key={index} style={styles.tableRow}>
                            <Text style={styles.tableCell}>{detalle.servicio ? detalle.servicio.nombre : detalle.producto?.nombreProducto}</Text>
                            <Text style={styles.tableCellCentered}>${detalle.precioproducto || detalle.precioservicio || 0}</Text>
                            <Text style={styles.tableCellCentered}>{detalle.cantidad || 1}</Text>
                            <Text style={styles.tableCellCentered}>0%</Text>
                            <Text style={styles.tableCellCentered}>
                                ${detalle.cantidad
                                    ? detalle.cantidad * (detalle.precioproducto || detalle.precioservicio || 0)
                                    : detalle.precioproducto || detalle.precioservicio || 0}
                            </Text>
                            <Text style={styles.tableCellCentered}>21%</Text>
                            <Text style={styles.tableCellCentered}>
                                ${(detalle.cantidad
                                    ? detalle.cantidad * (detalle.precioproducto || detalle.precioservicio || 0)
                                    : detalle.precioproducto || detalle.precioservicio || 0) *
                                    (1 + IVA)}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Resumen */}
                <View style={styles.summary}>
                    <View style={styles.subtotalRow}>
                        <Text>Base Imponible:</Text>
                        <Text>${baseImponible.toFixed(2)}</Text>
                    </View>
                    <View style={styles.subtotalRow}>
                        <Text>IVA (21%):</Text>
                        <Text>${iva.toFixed(2)}</Text>
                    </View>
                    <View style={styles.subtotalRow}>
                        <Text style={styles.bold}>Total:</Text>
                        <Text style={styles.bold}>${total.toFixed(2)}</Text>
                    </View>
                </View>

                {/* Footer */}
                <Text style={styles.footer}>
                    Gracias por confiar en Taller Electrónico XYZ
                </Text>
            </Page>
        </Document>
    );
};

export default OrderPDF;
