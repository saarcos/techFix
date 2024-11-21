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
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
        backgroundColor: "#1B4D3E", // Verde oscuro
        color: "white",
        padding: 15,
        borderRadius: 5,
    },
    headerLeft: { flexDirection: "column", justifyContent: "center" },
    headerRight: { textAlign: "right" },
    title: { fontSize: 18, fontWeight: "bold" },
    containerInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    customerInfo: { flex: 1, marginRight: 10 },
    deviceInfo: { flex: 1, marginLeft: 10 },
    trabajoInfo: {
        backgroundColor: "#F8F9FA",
        padding: 10,
        borderRadius: 5,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#DDE3E8",
    },
    trabajoHeader: { fontWeight: "bold", fontSize: 14, marginBottom: 5, color: "#1B4D3E" },
    table: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        borderWidth: 1,
        borderColor: "#DDE3E8",
        marginBottom: 10,
    },
    tableHeader: {
        backgroundColor: "#1B4D3E", // Verde oscuro
        color: "white",
        flexDirection: "row",
        borderBottomWidth: 1,
        borderColor: "#DDE3E8",
        padding: 5,
    },
    tableRow: { flexDirection: "row", borderBottomWidth: 1, borderColor: "#DDE3E8" },
    tableCell: { flex: 1, padding: 5, fontSize: 11 },
    tableCellCentered: { flex: 1, padding: 5, textAlign: "center", fontSize: 11 },
    footer: {
        marginTop: 20,
        fontSize: 10,
        textAlign: "center",
        color: "#555",
        borderTopWidth: 1,
        borderColor: "#DDE3E8",
        paddingTop: 10,
    },
    summary: {
        marginTop: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: "#DDE3E8",
        textAlign: "right",
        backgroundColor: "#F8F9FA",
        borderRadius: 5,
        fontSize: 12,
    },
    infoBox: {
        backgroundColor: "#F8F9FA",
        padding: 10,
        borderRadius: 5,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#DDE3E8",
    },
    infoHeader: { fontWeight: "bold", fontSize: 14, marginBottom: 5, color: "#1B4D3E" },
    titles: { fontWeight: "bold", fontSize: 12, color: "#1B4D3E" },
    titleImportant: { fontWeight: "bold", fontSize: 14, color: "#1B4D3E", marginBottom: 5 },
    bold: { fontWeight: "bold" },
    summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
});

const OrderPDF: React.FC<OrderPDFProps> = ({ order }) => {
    const cliente = order?.equipo?.cliente || {
        nombre: "N/A",
        apellido: "N/A",
        correo: "N/A",
        celular: "N/A",
    };
    const equipo = order?.equipo || {
        nserie: "N/A",
        modelo: {
            nombre: "N/A",
            marca: {
                nombre: "N/A",
            },
        },
    };
    const trabajo = order?.descripcion || "No especificado";
    const detalles = order?.detalles || [];
    const presupuesto = order?.presupuesto ?? 0;
    const adelanto = order?.adelanto ?? 0;
    const total = order?.total ?? 0;
    const accesorios = Array.isArray(order?.accesorios) ? order.accesorios : [];
    const accesoriosTexto =
        accesorios.length > 0
            ? accesorios.map((acc) => acc.Accesorio.nombre).join(", ")
            : "No se entregaron accesorios";

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

                <View style={styles.containerInfo}>
                    {/* Información del cliente */}
                    <View style={styles.customerInfo}>
                        <Text style={styles.titleImportant}>Cliente:</Text>
                        <Text style={styles.titles}>Nombre: <Text style={{color:'#000', fontWeight:10}}>{cliente.nombre} {cliente.apellido}</Text></Text>
                        <Text style={styles.titles}>Correo: <Text style={{color:'#000', fontWeight:11}}>{cliente.correo}</Text></Text>
                        <Text style={styles.titles}>Celular: <Text style={{color:'#000', fontWeight:11}}>{cliente.celular}</Text></Text>
                    </View>
                    {/* Información del equipo */}
                    <View style={styles.deviceInfo}>
                        <Text style={styles.titleImportant} >Equipo:</Text>
                        <Text style={styles.titles}>N° Serie: <Text style={{color:'#000', fontWeight:10}}>{equipo.nserie}</Text></Text>
                        <Text style={styles.titles}>Marca: <Text style={{color:'#000', fontWeight:10}}>{equipo.modelo.marca.nombre}</Text></Text>
                        <Text style={styles.titles}>Modelo: <Text style={{color:'#000', fontWeight:10}}>{equipo.modelo.nombre}</Text></Text>
                    </View>
                </View>

                {/* Información del trabajo */}
                <View style={styles.trabajoInfo}>
                    <Text style={styles.trabajoHeader}>Trabajo realizado:</Text>
                    <Text>{trabajo}</Text>
                </View>
                 {/* Información de accesorios */}
                 <View style={styles.infoBox}>
                    <Text style={styles.infoHeader}>Accesorios entregados:</Text>
                    <Text>{accesoriosTexto}</Text>
                </View>

                {/* Tabla de detalles */}
                <View style={styles.table}>
                    {/* Encabezado de la tabla */}
                    <View style={styles.tableHeader}>
                        <Text style={styles.tableCellCentered}>CONCEPTO</Text>
                        <Text style={styles.tableCellCentered}>PRECIO SIN IVA</Text>
                        <Text style={styles.tableCellCentered}>CANTIDAD</Text>
                        <Text style={styles.tableCellCentered}>SUBTOTAL</Text>
                        <Text style={styles.tableCellCentered}>IVA</Text>
                        <Text style={styles.tableCellCentered}>PRECIO FINAL</Text>
                    </View>
                    {/* Filas de productos y servicios */}
                    {detalles.map((detalle, index) => {
                        const filas = [];

                        // Si hay producto, añade una fila para el producto
                        if (detalle.producto) {
                            filas.push(
                                <View key={`producto-${index}`} style={styles.tableRow}>
                                    <Text style={styles.tableCell}>{detalle.producto.nombreProducto}</Text>
                                    <Text style={styles.tableCellCentered}>
                                        ${detalle.producto.preciosiniva ?? 0}
                                    </Text>
                                    <Text style={styles.tableCellCentered}>
                                        {detalle.cantidad ?? 1}
                                    </Text>
                                    <Text style={styles.tableCellCentered}>
                                        ${(detalle.producto.preciosiniva ?? 0) * (detalle.cantidad ?? 1)}
                                    </Text>
                                    <Text style={styles.tableCellCentered}>
                                        {detalle.producto.iva ?? 0}%
                                    </Text>
                                    <Text style={styles.tableCellCentered}>
                                        ${detalle.producto.preciofinal ?? 0}
                                    </Text>
                                </View>
                            );
                        }

                        // Si hay servicio, añade una fila para el servicio
                        if (detalle.servicio) {
                            filas.push(
                                <View key={`servicio-${index}`} style={styles.tableRow}>
                                    <Text style={styles.tableCell}>{detalle.servicio.nombre}</Text>
                                    <Text style={styles.tableCellCentered}>
                                        ${detalle.servicio.preciosiniva ?? 0}
                                    </Text>
                                    <Text style={styles.tableCellCentered}>
                                        {detalle.cantidad ?? 1}
                                    </Text>
                                    <Text style={styles.tableCellCentered}>
                                        ${(detalle.servicio.preciosiniva ?? 0) * (detalle.cantidad ?? 1)}
                                    </Text>
                                    <Text style={styles.tableCellCentered}>
                                        {detalle.servicio.iva ?? 0}%
                                    </Text>
                                    <Text style={styles.tableCellCentered}>
                                        ${detalle.servicio.preciofinal ?? 0}
                                    </Text>
                                </View>
                            );
                        }

                        return filas; // Renderiza todas las filas generadas
                    })}
                </View>

                {/* Resumen */}
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

                {/* Footer */}
                <Text style={styles.footer}>
                    Gracias por confiar en Taller Electrónico XYZ
                </Text>
            </Page>
        </Document>
    );
};

export default OrderPDF;
