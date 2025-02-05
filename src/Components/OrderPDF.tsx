import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { OrdenTrabajo } from "@/api/ordenTrabajoService";

interface OrderPDFProps {
    order: OrdenTrabajo;
}

const styles = StyleSheet.create({
    page: { padding: 40, fontSize: 12, fontFamily: "Helvetica" },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
        backgroundColor: "#3A7F56", // Verde más profesional
        color: "white",
        padding: 15,
        borderRadius: 8,
        boxShadow: "0px 4px 6px rgba(0,0,0,0.1)", // Sombra sutil para profundidad
    },
    headerLeft: { flexDirection: "column", justifyContent: "center" },
    headerRight: { textAlign: "right" },
    title: { fontSize: 20, fontWeight: "bold" },
    containerInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    customerInfo: { flex: 1, marginRight: 10 },
    deviceInfo: { flex: 1, marginLeft: 10 },
    trabajoInfo: {
        backgroundColor: "#E8F5E9", // Fondo suave para resaltar el trabajo
        padding: 12,
        borderRadius: 5,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#81C784", // Bordes suaves
    },
    trabajoHeader: { fontWeight: "bold", fontSize: 16, marginBottom: 5, color: "#3A7F56" },
    table: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        borderWidth: 1,
        borderColor: "#E0E0E0",
        marginBottom: 10,
    },
    tableHeader: {
        backgroundColor: "#3A7F56", // Verde más suave
        color: "white",
        flexDirection: "row",
        borderBottomWidth: 1,
        borderColor: "#E0E0E0",
        padding: 8,
    },
    tableRow: { flexDirection: "row", borderBottomWidth: 1, borderColor: "#E0E0E0", padding: 8 },
    tableCell: { flex: 1, padding: 8, fontSize: 11, textAlign: "left" },
    tableCellCentered: { flex: 1, padding: 8, textAlign: "center", fontSize: 11 },
    footer: {
        marginTop: 20,
        fontSize: 10,
        textAlign: "center",
        color: "#555",
        borderTopWidth: 1,
        borderColor: "#E0E0E0",
        paddingTop: 10,
    },
    summary: {
        marginTop: 15,
        padding: 12,
        borderWidth: 1,
        borderColor: "#81C784",
        textAlign: "right",
        backgroundColor: "#E8F5E9", // Fondo suave
        borderRadius: 5,
        fontSize: 12,
    },
    summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
    infoBox: {
        backgroundColor: "#E8F5E9",
        padding: 12,
        borderRadius: 5,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#81C784",
    },
    infoHeader: { fontWeight: "bold", fontSize: 16, marginBottom: 5, color: "#3A7F56" },
    titleImportant: { fontWeight: "bold", fontSize: 14, color: "#3A7F56", marginBottom: 5 },
    bold: { fontWeight: "bold" },
});

const OrderPDF: React.FC<OrderPDFProps> = ({ order }) => {
    const cliente = order?.equipo?.cliente || { nombre: "N/A", apellido: "N/A", correo: "N/A", celular: "N/A" };
    const equipo = order?.equipo || { nserie: "N/A", modelo: { nombre: "N/A", marca: { nombre: "N/A" } } };
    const trabajo = order?.descripcion || "No especificado";
    const detalles = order?.detalles || [];
    const presupuesto = order?.presupuesto ?? 0;
    const adelanto = order?.adelanto ?? 0;
    const total = order?.total ?? 0;
    const accesorios = Array.isArray(order?.accesorios) ? order.accesorios : [];
    const accesoriosTexto = accesorios.length > 0 ? accesorios.map(acc => acc.Accesorio.nombre).join(", ") : "No se entregaron accesorios";

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
                        <Text style={styles.title}>Orden #{order?.numero_orden || "N/A"}</Text>
                        <Text>Fecha: {order?.created_at ? new Date(order.created_at).toLocaleDateString("es-ES") : "N/A"}</Text>
                    </View>
                </View>

                <View style={styles.containerInfo}>
                    <View style={styles.customerInfo}>
                        <Text style={styles.titleImportant}>Cliente:</Text>
                        <Text>{cliente.nombre} {cliente.apellido}</Text>
                        <Text>{cliente.correo}</Text>
                        <Text>{cliente.celular}</Text>
                    </View>
                    <View style={styles.deviceInfo}>
                        <Text style={styles.titleImportant}>Equipo:</Text>
                        <Text>{equipo.nserie}</Text>
                        <Text>{equipo.modelo.marca.nombre}</Text>
                        <Text>{equipo.modelo.nombre}</Text>
                    </View>
                </View>

                <View style={styles.trabajoInfo}>
                    <Text style={styles.trabajoHeader}>Trabajo Realizado:</Text>
                    <Text>{trabajo}</Text>
                </View>

                <View style={styles.infoBox}>
                    <Text style={styles.infoHeader}>Accesorios Entregados:</Text>
                    <Text>{accesoriosTexto}</Text>
                </View>

                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={styles.tableCellCentered}>CONCEPTO</Text>
                        <Text style={styles.tableCellCentered}>PRECIO SIN IVA</Text>
                        <Text style={styles.tableCellCentered}>CANTIDAD</Text>
                        <Text style={styles.tableCellCentered}>SUBTOTAL</Text>
                        <Text style={styles.tableCellCentered}>IVA</Text>
                        <Text style={styles.tableCellCentered}>PRECIO FINAL</Text>
                    </View>
                    {detalles.map((detalle, index) => {
                        const filas = [];

                        if (detalle.producto) {
                            filas.push(
                                <View key={`producto-${index}`} style={styles.tableRow}>
                                    <Text style={styles.tableCell}>{detalle.producto.nombreProducto}</Text>
                                    <Text style={styles.tableCellCentered}>${detalle.producto.preciosiniva ?? 0}</Text>
                                    <Text style={styles.tableCellCentered}>{detalle.cantidad ?? 1}</Text>
                                    <Text style={styles.tableCellCentered}>${(detalle.producto.preciosiniva ?? 0) * (detalle.cantidad ?? 1)}</Text>
                                    <Text style={styles.tableCellCentered}>{detalle.producto.iva ?? 0}%</Text>
                                    <Text style={styles.tableCellCentered}>${detalle.producto.preciofinal ?? 0}</Text>
                                </View>
                            );
                        }

                        if (detalle.servicio) {
                            filas.push(
                                <View key={`servicio-${index}`} style={styles.tableRow}>
                                    <Text style={styles.tableCell}>{detalle.servicio.nombre}</Text>
                                    <Text style={styles.tableCellCentered}>${detalle.servicio.preciosiniva ?? 0}</Text>
                                    <Text style={styles.tableCellCentered}>{detalle.cantidad ?? 1}</Text>
                                    <Text style={styles.tableCellCentered}>${(detalle.servicio.preciosiniva ?? 0) * (detalle.cantidad ?? 1)}</Text>
                                    <Text style={styles.tableCellCentered}>{detalle.servicio.iva ?? 0}%</Text>
                                    <Text style={styles.tableCellCentered}>${detalle.servicio.preciofinal ?? 0}</Text>
                                </View>
                            );
                        }

                        return filas;
                    })}
                </View>

                <View style={styles.summary}>
                    <View style={styles.summaryRow}>
                        <Text>Presupuesto:</Text>
                        <Text>${presupuesto}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text>Adelanto:</Text>
                        <Text>${adelanto}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.bold}>Total:</Text>
                        <Text style={styles.bold}>${total}</Text>
                    </View>
                </View>

                <Text style={styles.footer}>Gracias por confiar en Taller Electrónico XYZ</Text>
            </Page>
        </Document>
    );
};

export default OrderPDF;
