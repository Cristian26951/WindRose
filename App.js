import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Pressable,
} from "react-native";

const INITIAL_PRODUCTS = [
  {
    id: "PROD-001",
    nombre: "Consola de videojuegos",
    categoria: "Tecnología",
    precio: 85000,
    stock: 5,
    descripcion: "Color negro de alto rendimiento, ideal para videojuegos.",
  },
  {
    id: "PROD-002",
    nombre: "Auriculares Inalámbricos",
    categoria: "Tecnología",
    precio: 45000,
    stock: 10,
    descripcion: "Sonido estéreo de alta fidelidad con cancelación de ruido.",
  },
  {
    id: "PROD-003",
    nombre: "Tapetes para carro",
    categoria: "Automotriz",
    precio: 114000,
    stock: 36,
    descripcion:
      "Tapetes de goma de alta resistencia para el piso del vehículo.",
  },
  {
    id: "PROD-004",
    nombre: "Nevera manija integrada",
    categoria: "Hogar",
    precio: 1800000,
    stock: 42,
    descripcion: "Nevera moderna con dispensador de agua y bajo consumo.",
  },
  {
    id: "PROD-005",
    nombre: "Aspiradora de succión",
    categoria: "Automotriz",
    precio: 215000,
    stock: 53,
    descripcion: "Aspiradora portátil con cable y succión ciclónica potente.",
  },
  {
    id: "PROD-006",
    nombre: "Set de fundas para asientos",
    categoria: "Automotriz",
    precio: 230000,
    stock: 24,
    descripcion: "Set completo de fundas protectoras para asientos de auto.",
  },
  {
    id: "PROD-007",
    nombre: "SmartWatch",
    categoria: "Tecnología",
    precio: 600000,
    stock: 40,
    descripcion:
      "Reloj inteligente multifunción con notificaciones y sensores.",
  },
  {
    id: "PROD-008",
    nombre: "Licuadora",
    categoria: "Hogar",
    precio: 500000,
    stock: 63,
    descripcion: "Licuadora profesional con ajuste de velocidad variable.",
  },
  {
    id: "PROD-009",
    nombre: "Monitor de frecuencia cardíaca",
    categoria: "Deportes",
    precio: 720000,
    stock: 18,
    descripcion:
      "Monitor deportivo que brinda datos exactos de pulso cardíaco.",
  },
  {
    id: "PROD-010",
    nombre: "Lavadora",
    categoria: "Hogar",
    precio: 800000,
    stock: 27,
    descripcion: "Lavadora digital de gran capacidad y ahorro energético.",
  },
  {
    id: "PROD-011",
    nombre: "Kit de mancuernas",
    categoria: "Deportes",
    precio: 300000,
    stock: 55,
    descripcion: "Mancuernas ajustables con discos de hierro resistentes.",
  },
  {
    id: "PROD-012",
    nombre: "Bandas elásticas",
    categoria: "Deportes",
    precio: 60000,
    stock: 78,
    descripcion: "Bandas elásticas de material resistente para entrenamiento.",
  },
];

const CATEGORIES = ["Todas", "Tecnología", "Automotriz", "Hogar", "Deportes"];
const SORTS = [
  ["asc", "Menor a mayor"],
  ["desc", "Mayor a menor"],
];
const TABS = [
  ["home", "Inicio"],
  ["favorites", "Favoritos"],
  ["cart", "Carrito"],
  ["history", "Pedidos"],
];
const FIELDS = [
  ["name", "Nombre completo"],
  ["phone", "Teléfono"],
  ["city", "Municipio (Mosquera, Madrid o Funza)"],
  ["address", "Dirección de entrega"],
];
const SHIPPING_COST = 8000;
const FREE_SHIPPING_FROM = 150000;

const cop = (n) => `$${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} COP`;

function Empty({ text, label, onPress }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.muted}>{text}</Text>
      <Pressable onPress={onPress}>
        <Text style={styles.link}>{label}</Text>
      </Pressable>
    </View>
  );
}

function Totals({ subtotal, shipping, total }) {
  return (
    <View style={styles.box}>
      <Text>Subtotal: {cop(subtotal)}</Text>
      <Text>Envío: {shipping === 0 ? "GRATIS" : cop(shipping)}</Text>
      <Text style={styles.title}>Total: {cop(total)}</Text>
    </View>
  );
}

function OrderSummary({ buyer, items, subtotal, shipping, total }) {
  return (
    <>
      <Text style={styles.muted}>
        Cliente: {buyer.name} ({buyer.phone})
      </Text>
      <Text style={styles.muted}>
        Entrega: {buyer.city}, {buyer.address}
      </Text>
      <View style={styles.box}>
        {items.map((i) => (
          <Text key={i.id}>
            • {i.nombre} x{i.qty} — {cop(i.precio)} c/u
          </Text>
        ))}
      </View>
      <Totals subtotal={subtotal} shipping={shipping} total={total} />
    </>
  );
}

export default function App() {
  const [screen, setScreen] = useState("home");
  const [back, setBack] = useState("home");
  const [selectedId, setSelectedId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const [sort, setSort] = useState("none");
  const [buyer, setBuyer] = useState({
    name: "",
    phone: "",
    city: "",
    address: "",
  });
  const [toast, setToast] = useState("");

  const filtered = products
    .filter(
      (p) =>
        p.nombre.toLowerCase().includes(search.trim().toLowerCase()) &&
        (category === "Todas" || p.categoria === category),
    )
    .sort((a, b) =>
      sort === "asc"
        ? a.precio - b.precio
        : sort === "desc"
          ? b.precio - a.precio
          : 0,
    );
  const cartItems = cart.map((i) => ({
    ...products.find((p) => p.id === i.id),
    qty: i.qty,
  }));
  const subtotal = cartItems.reduce((sum, i) => sum + i.precio * i.qty, 0);
  const shipping =
    cart.length === 0 || subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);
  const current = products.find((p) => p.id === selectedId);

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const openDetail = (id) => {
    setSelectedId(id);
    setBack(screen);
    setScreen("detail");
  };

  const toggleFav = (id) => {
    const isFav = favorites.includes(id);
    setFavorites(
      isFav ? favorites.filter((f) => f !== id) : [...favorites, id],
    );
    notify(isFav ? "Quitado de favoritos" : "Guardado en favoritos");
  };

  const addToCart = (prod) => {
    const item = cart.find((i) => i.id === prod.id);
    if (prod.stock <= 0) return notify("Producto agotado");
    if (item && item.qty >= prod.stock)
      return notify(`Stock máximo alcanzado (${prod.stock})`);
    setCart(
      item
        ? cart.map((i) => (i.id === prod.id ? { ...i, qty: i.qty + 1 } : i))
        : [...cart, { id: prod.id, qty: 1 }],
    );
    notify("Agregado al carrito");
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((i) => i.id !== id));
    notify("Producto eliminado del carrito");
  };

  const changeQty = (item, delta) => {
    const next = item.qty + delta;
    if (next <= 0) return removeFromCart(item.id);
    if (next > item.stock) return notify(`Stock límite: ${item.stock}`);
    setCart(cart.map((i) => (i.id === item.id ? { ...i, qty: next } : i)));
  };

  const goToReview = () => {
    const missing = FIELDS.find(([key]) => !buyer[key].trim());
    if (missing) return notify(`Falta: ${missing[1]}`);
    setScreen("review");
  };

  const confirmPurchase = () => {
    if (cart.length === 0) return notify("El carrito está vacío");
    const noStock = cartItems.find((i) => i.qty > i.stock);
    if (noStock) return notify(`Stock insuficiente de ${noStock.nombre}`);

    setProducts(
      products.map((p) => {
        const bought = cart.find((i) => i.id === p.id);
        return bought ? { ...p, stock: Math.max(0, p.stock - bought.qty) } : p;
      }),
    );
    const order = {
      code: `WIND-${String(orders.length + 1).padStart(4, "0")}`,
      date: new Date().toLocaleString(),
      buyer: { ...buyer },
      items: cartItems.map(({ id, nombre, precio, qty }) => ({
        id,
        nombre,
        precio,
        qty,
      })),
      subtotal,
      shipping,
      total,
    };
    setOrders([order, ...orders]);
    setCart([]);
    setSelectedOrder(order);
    setScreen("order");
    notify(`Pedido ${order.code} confirmado · simulación sin cobro real`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>WINDROSE</Text>
          <Text style={styles.slogan}>Conectamos cada emprendimiento</Text>
        </View>
        <Text style={styles.logo}>WR</Text>
      </View>

      {toast !== "" && <Text style={styles.toast}>{toast}</Text>}

      <ScrollView
        key={screen}
        style={styles.body}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {screen === "home" && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Buscar producto..."
              value={search}
              onChangeText={setSearch}
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginBottom: 10 }}
            >
              {CATEGORIES.map((cat) => (
                <Pressable
                  key={cat}
                  style={[styles.chip, category === cat && styles.chipActive]}
                  onPress={() => setCategory(cat)}
                >
                  <Text
                    style={category === cat ? styles.white : styles.chipText}
                  >
                    {cat}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
            <View style={styles.row}>
              <Text style={[styles.muted, { marginRight: 8 }]}>Ordenar:</Text>
              {SORTS.map(([key, label]) => (
                <Pressable
                  key={key}
                  style={[styles.chip, sort === key && styles.chipActive]}
                  onPress={() => setSort(key)}
                >
                  <Text style={sort === key ? styles.white : styles.chipText}>
                    {label}
                  </Text>
                </Pressable>
              ))}
            </View>

            {filtered.length === 0 ? (
              <Empty
                text="No encontramos productos"
                label="Limpiar filtros"
                onPress={() => {
                  setSearch("");
                  setCategory("Todas");
                }}
              />
            ) : (
              <View style={styles.grid}>
                {filtered.map((p) => (
                  <Pressable
                    key={p.id}
                    style={styles.card}
                    onPress={() => openDetail(p.id)}
                  >
                    <View style={styles.cardImg}>
                      <Text style={styles.small}>{p.categoria}</Text>
                      <Pressable
                        onPress={(e) => {
                          e.stopPropagation();
                          toggleFav(p.id);
                        }}
                      >
                        <Text style={styles.star}>
                          {favorites.includes(p.id) ? "★" : "☆"}
                        </Text>
                      </Pressable>
                    </View>
                    <Text numberOfLines={1} style={styles.bold}>
                      {p.nombre}
                    </Text>
                    <Text style={styles.price}>{cop(p.precio)}</Text>
                    <Text style={p.stock > 0 ? styles.green : styles.red}>
                      {p.stock > 0 ? `Stock: ${p.stock}` : "Agotado"}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </>
        )}

        {screen === "detail" && current && (
          <>
            <View style={styles.bigImg}>
              <Text style={styles.bold}>{current.categoria}</Text>
            </View>
            <View style={styles.row}>
              <Text style={[styles.title, { flex: 1 }]}>{current.nombre}</Text>
              <Pressable onPress={() => toggleFav(current.id)}>
                <Text style={styles.star}>
                  {favorites.includes(current.id) ? "★" : "☆"}
                </Text>
              </Pressable>
            </View>
            <Text style={styles.muted}>{current.categoria}</Text>
            <Text style={{ marginVertical: 8 }}>{current.descripcion}</Text>
            <Text style={styles.title}>{cop(current.precio)}</Text>
            <Text style={current.stock > 0 ? styles.green : styles.red}>
              {current.stock > 0 ? `Disponibles: ${current.stock}` : "Agotado"}
            </Text>
            <Pressable
              style={[styles.btn, current.stock === 0 && styles.btnOff]}
              disabled={current.stock === 0}
              onPress={() => addToCart(current)}
            >
              <Text style={styles.white}>
                {current.stock === 0 ? "Agotado" : "Agregar al carrito"}
              </Text>
            </Pressable>
            <Pressable onPress={() => setScreen(back)}>
              <Text style={styles.link}>Volver</Text>
            </Pressable>
          </>
        )}

        {screen === "favorites" && (
          <>
            <Text style={styles.title}>Favoritos</Text>
            {favorites.length === 0 ? (
              <Empty
                text="No tienes favoritos guardados."
                label="Volver al catálogo"
                onPress={() => setScreen("home")}
              />
            ) : (
              products
                .filter((p) => favorites.includes(p.id))
                .map((p) => (
                  <View key={p.id} style={styles.itemRow}>
                    <Pressable
                      style={{ flex: 1 }}
                      onPress={() => openDetail(p.id)}
                    >
                      <Text style={styles.bold}>{p.nombre}</Text>
                      <Text style={styles.price}>{cop(p.precio)}</Text>
                    </Pressable>
                    <Pressable onPress={() => toggleFav(p.id)}>
                      <Text style={styles.danger}>Quitar</Text>
                    </Pressable>
                  </View>
                ))
            )}
          </>
        )}

        {screen === "cart" && (
          <>
            <Text style={styles.title}>Tu carrito</Text>
            {cart.length === 0 ? (
              <Empty
                text="El carrito está vacío. Total: $0 COP"
                label="Ir al catálogo"
                onPress={() => setScreen("home")}
              />
            ) : (
              <>
                {cartItems.map((i) => (
                  <View key={i.id} style={styles.itemRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.bold}>{i.nombre}</Text>
                      <Text style={styles.muted}>{cop(i.precio)} c/u</Text>
                    </View>
                    <Pressable
                      style={styles.qtyBtn}
                      onPress={() => changeQty(i, -1)}
                    >
                      <Text>-</Text>
                    </Pressable>
                    <Text style={styles.qty}>{i.qty}</Text>
                    <Pressable
                      style={styles.qtyBtn}
                      onPress={() => changeQty(i, 1)}
                    >
                      <Text>+</Text>
                    </Pressable>
                    <Pressable onPress={() => removeFromCart(i.id)}>
                      <Text style={[styles.danger, { marginLeft: 10 }]}>
                        Eliminar
                      </Text>
                    </Pressable>
                  </View>
                ))}
                <Totals subtotal={subtotal} shipping={shipping} total={total} />
                <Pressable
                  style={styles.btn}
                  onPress={() => setScreen("checkout")}
                >
                  <Text style={styles.white}>Continuar compra</Text>
                </Pressable>
              </>
            )}
          </>
        )}

        {screen === "checkout" && (
          <>
            <Text style={styles.title}>Datos del comprador</Text>
            <Text style={[styles.muted, { marginBottom: 10 }]}>
              Datos de compra
            </Text>
            {FIELDS.map(([key, label]) => (
              <TextInput
                key={key}
                style={styles.input}
                placeholder={label}
                value={buyer[key]}
                keyboardType={key === "phone" ? "phone-pad" : "default"}
                onChangeText={(t) => setBuyer({ ...buyer, [key]: t })}
              />
            ))}
            <Pressable style={styles.btn} onPress={goToReview}>
              <Text style={styles.white}>Revisar pedido</Text>
            </Pressable>
            <Pressable onPress={() => setScreen("cart")}>
              <Text style={styles.link}>Volver al carrito</Text>
            </Pressable>
          </>
        )}

        {screen === "review" && (
          <>
            <Text style={styles.title}>Revisa tu pedido</Text>
            <OrderSummary
              buyer={buyer}
              items={cartItems}
              subtotal={subtotal}
              shipping={shipping}
              total={total}
            />
            <Pressable style={styles.btn} onPress={confirmPurchase}>
              <Text style={styles.white}>Confirmar compra</Text>
            </Pressable>
            <Pressable onPress={() => setScreen("checkout")}>
              <Text style={styles.link}>Editar datos</Text>
            </Pressable>
          </>
        )}

        {screen === "history" && (
          <>
            <Text style={styles.title}>Historial de pedidos</Text>
            {orders.length === 0 ? (
              <Empty
                text="No hay pedidos registrados."
                label="Ir al catálogo"
                onPress={() => setScreen("home")}
              />
            ) : (
              orders.map((o) => (
                <Pressable
                  key={o.code}
                  style={styles.box}
                  onPress={() => {
                    setSelectedOrder(o);
                    setScreen("order");
                  }}
                >
                  <Text style={styles.bold}>{o.code}</Text>
                  <Text style={styles.muted}>{o.date}</Text>
                  <Text style={styles.price}>Total: {cop(o.total)}</Text>
                </Pressable>
              ))
            )}
          </>
        )}

        {screen === "order" && selectedOrder && (
          <>
            <Text style={styles.title}>Pedido {selectedOrder.code}</Text>
            <Text style={styles.muted}>Fecha: {selectedOrder.date}</Text>
            <OrderSummary {...selectedOrder} />
            <Text style={styles.note}>Se realizo exitosamente</Text>
            <Pressable onPress={() => setScreen("history")}>
              <Text style={styles.link}>Volver al historial</Text>
            </Pressable>
          </>
        )}
      </ScrollView>

      <View style={styles.nav}>
        {TABS.map(([key, label]) => (
          <Pressable
            key={key}
            style={styles.tab}
            onPress={() => setScreen(key)}
          >
            <Text style={[styles.navText, screen === key && styles.navActive]}>
              {key === "cart" && cartCount > 0
                ? `${label} (${cartCount})`
                : label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const PRIMARY = "#0077b6";
const ACCENT = "#00b4d8";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f7fa", paddingTop: 35 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: PRIMARY,
  },
  brand: {
    fontSize: 20,
    fontWeight: "bold",
    fontStyle: "italic",
    color: "#fff",
    letterSpacing: 1,
  },
  slogan: { fontSize: 12, color: "#d9f3fb", marginTop: 2 },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: ACCENT,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 40,
  },
  toast: {
    backgroundColor: "#1d2939",
    color: "#fff",
    textAlign: "center",
    fontSize: 13,
    padding: 8,
  },
  body: { flex: 1, padding: 14 },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#dde3ea",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
    marginBottom: 10,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#e9eef3",
    marginRight: 8,
  },
  chipActive: { backgroundColor: PRIMARY },
  chipText: { fontSize: 13, color: "#1d2939" },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  cardImg: {
    height: 75,
    backgroundColor: "#e0f7fa",
    borderRadius: 8,
    marginBottom: 6,
    padding: 6,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bigImg: {
    height: 140,
    backgroundColor: "#e0f7fa",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  star: { fontSize: 20, color: PRIMARY },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1d2939",
    marginBottom: 4,
  },
  bold: { fontWeight: "bold", color: "#1d2939" },
  price: { color: PRIMARY, fontWeight: "bold" },
  muted: { color: "#667085", fontSize: 13 },
  small: { fontSize: 11, color: "#344054" },
  green: { color: "#2b9348", fontSize: 12, marginTop: 2 },
  red: { color: "#d90429", fontSize: 12, marginTop: 2, fontWeight: "bold" },
  danger: { color: "#d90429", fontSize: 13 },
  link: {
    color: PRIMARY,
    textAlign: "center",
    marginTop: 12,
    fontWeight: "600",
  },
  note: { color: "#2b9348", textAlign: "center", marginTop: 6 },
  empty: { alignItems: "center", marginTop: 30 },
  btn: {
    backgroundColor: ACCENT,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
  },
  btnOff: { backgroundColor: "#c4c9cf" },
  white: { color: "#fff", fontWeight: "bold" },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginTop: 8,
  },
  qtyBtn: {
    backgroundColor: "#e9eef3",
    width: 28,
    height: 28,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  qty: { marginHorizontal: 10, fontWeight: "bold" },
  box: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  nav: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: "#e4e7ec",
    backgroundColor: "#fff",
  },
  tab: { flex: 1, alignItems: "center", paddingVertical: 12 },
  navText: { fontSize: 13, fontWeight: "600", color: "#667085" },
  navActive: { color: PRIMARY },
});
