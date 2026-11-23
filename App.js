import React, { useState, useEffect, useMemo, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
    marca: "locktech",
    variantes: [
      { id: "negra", nombre: "Negra", precio: 85000, stock: 3 },
      { id: "blanca", nombre: "Blanca", precio: 85000, stock: 2 },
    ],
    descripcion: "alto rendimiento, ideal para videojuegos.",
  },
  {
    id: "PROD-002",
    nombre: "Auriculares Inalámbricos",
    categoria: "Tecnología",
    precio: 45000,
    stock: 10,
    marca: "locktech",
    variantes: [
      { id: "negro", nombre: "Negro", precio: 45000, stock: 6 },
      { id: "blanco", nombre: "Blanco", precio: 48000, stock: 4 },
    ],
    descripcion: "Sonido estéreo de alta fidelidad con cancelación de ruido.",
  },
  {
    id: "PROD-003",
    nombre: "Tapetes para carro",
    categoria: "Automotriz",
    precio: 114000,
    stock: 36,
    marca: "oruseng",
    descripcion:
      "Tapetes de goma de alta resistencia para el piso del vehículo.",
  },
  {
    id: "PROD-004",
    nombre: "Nevera manija integrada",
    categoria: "Hogar",
    precio: 1800000,
    stock: 42,
    marca: "hosekep",
    descripcion: "Nevera moderna con dispensador de agua y bajo consumo.",
  },
  {
    id: "PROD-005",
    nombre: "Aspiradora de succión",
    categoria: "Automotriz",
    precio: 215000,
    stock: 53,
    marca: "oruseng",
    descripcion: "Aspiradora portátil con cable y succión ciclónica potente.",
  },
  {
    id: "PROD-006",
    nombre: "Set de fundas para asientos",
    categoria: "Automotriz",
    precio: 230000,
    stock: 24,
    marca: "oruseng",
    descripcion: "Set completo de fundas protectoras para asientos de auto.",
  },
  {
    id: "PROD-007",
    nombre: "SmartWatch",
    categoria: "Tecnología",
    precio: 600000,
    stock: 40,
    marca: "locktech",
    descripcion:
      "Reloj inteligente multifunción con notificaciones y sensores.",
  },
  {
    id: "PROD-008",
    nombre: "Licuadora",
    categoria: "Hogar",
    precio: 500000,
    stock: 63,
    marca: "hosekep",
    descripcion: "Licuadora profesional con ajuste de velocidad variable.",
  },
  {
    id: "PROD-009",
    nombre: "Monitor de frecuencia cardíaca",
    categoria: "Deportes",
    precio: 720000,
    stock: 18,
    marca: "liftrun",
    descripcion:
      "Monitor deportivo que brinda datos exactos de pulso cardíaco.",
  },
  {
    id: "PROD-010",
    nombre: "Lavadora",
    categoria: "Hogar",
    precio: 800000,
    stock: 27,
    marca: "hosekep",
    descripcion: "Lavadora digital de gran capacidad y ahorro energético.",
  },
  {
    id: "PROD-011",
    nombre: "Kit de mancuernas",
    categoria: "Deportes",
    precio: 300000,
    stock: 55,
    marca: "liftrun",
    variantes: [
      { id: "azul", nombre: "Azul", precio: 300000, stock: 30 },
      { id: "rojo", nombre: "Rojo", precio: 315000, stock: 25 },
    ],
    descripcion: "Mancuernas ajustables con discos de hierro resistentes.",
  },
  {
    id: "PROD-012",
    nombre: "Bandas elásticas",
    categoria: "Deportes",
    precio: 60000,
    stock: 78,
    marca: "liftrun",
    variantes: [
      { id: "ligera", nombre: "Ligera", precio: 60000, stock: 40 },
      { id: "fuerte", nombre: "Fuerte", precio: 68000, stock: 38 },
    ],
    descripcion: "Bandas elásticas de material resistente para entrenamiento.",
  },
];

const CATEGORIES = ["Todas", "Tecnología", "Automotriz", "Hogar", "Deportes"];
const BRAND_BY_CATEGORY = {
  Tecnología: "locktech",
  Automotriz: "oruseng",
  Hogar: "hosekep",
  Deportes: "liftrun",
};
const SORTS = [
  ["asc", "Menor a mayor"],
  ["desc", "Mayor a menor"],
];
const TABS = [
  ["home", "Inicio"],
  ["favorites", "Favoritos"],
  ["cart", "Carrito"],
  ["history", "Pedidos"],
  ["compare", "Comparar"],
  ["addresses", "Direcciones"],
  ["notifications", "Avisos"],
  ["help", "Ayuda"],
  ["seller", "Vendedor"],
];
const FIELDS = [
  ["name", "Nombre completo"],
  ["phone", "Teléfono"],
];
const SHIPPING_COST = 8000;
const FREE_SHIPPING_FROM = 150000;
const SHIPPING_RATES = {
  Mosquera: { standard: 6000, express: 10000 },
  Funza: { standard: 8000, express: 12000 },
  Madrid: { standard: 10000, express: 14000 },
};
const DELIVERY_ESTIMATE = "1 a 2 días";

const COUPONS = { BIENVENIDO10: 0.1 };

const SELLER_CATEGORIES = CATEGORIES.filter((c) => c !== "Todas");
const EMPTY_FORM = {
  nombre: "",
  categoria: "",
  precio: "",
  stock: "",
  descripcion: "",
};

const STORAGE_KEY = "windrose_state_v1";
const EMPTY_ADDRESS = { alias: "", city: "", reference: "" };
const SUPPORT_REASONS = ["Entrega", "Producto", "Otro"];
const ORDER_STATES = ["Confirmado", "Preparando", "En camino", "Entregado"];

const isInt = (n) => typeof n === "number" && Number.isInteger(n);

function sanitizeProducts(list) {
  if (!Array.isArray(list)) return INITIAL_PRODUCTS;
  const ids = [];
  const valid = [];
  list.forEach((p) => {
    if (
      !p ||
      typeof p.id !== "string" ||
      ids.includes(p.id) ||
      typeof p.nombre !== "string" ||
      !p.nombre.trim() ||
      typeof p.categoria !== "string" ||
      !isInt(p.precio) ||
      p.precio <= 0 ||
      !isInt(p.stock) ||
      typeof p.descripcion !== "string" ||
      (p.variantes !== undefined &&
        (!Array.isArray(p.variantes) ||
          p.variantes.some(
            (v) =>
              !v ||
              typeof v.id !== "string" ||
              typeof v.nombre !== "string" ||
              !isInt(v.precio) ||
              v.precio <= 0 ||
              !isInt(v.stock) ||
              v.stock < 0,
          )))
    )
      return;
    ids.push(p.id);
    const initialVariants = INITIAL_PRODUCTS.find(
      (product) => product.id === p.id,
    )?.variantes;
    const variants =
      p.variantes ||
      (initialVariants
        ? initialVariants.map((variant, index) => ({
            ...variant,
            stock: index === 0 ? Math.max(0, p.stock) : 0,
          }))
        : undefined);
    valid.push({
      ...p,
      marca: BRAND_BY_CATEGORY[p.categoria] || "Sin marca",
      variantes: variants,
      stock: Array.isArray(variants)
        ? variants.reduce((sum, variant) => sum + variant.stock, 0)
        : Math.max(0, p.stock),
    });
  });
  return valid.length > 0 ? valid : INITIAL_PRODUCTS;
}

function sanitizeFavorites(list, prods) {
  if (!Array.isArray(list)) return [];
  return list.filter(
    (id, idx) => list.indexOf(id) === idx && prods.some((p) => p.id === id),
  );
}

function sanitizeCart(list, prods) {
  if (!Array.isArray(list)) return [];
  const result = [];
  list.forEach((i) => {
    const prod = i && prods.find((p) => p.id === i.id);
    const variant =
      prod &&
      Array.isArray(prod.variantes) &&
      (prod.variantes.find((v) => v.id === i.variantId) ||
        (i.variantId == null ? prod.variantes[0] : null));
    const stock = variant ? variant.stock : prod && prod.stock;
    if (
      !prod ||
      !isInt(i.qty) ||
      i.qty <= 0 ||
      stock <= 0 ||
      (Array.isArray(prod.variantes) && !variant)
    )
      return;
    const existing = result.find(
      (r) => r.id === prod.id && r.variantId === (variant ? variant.id : null),
    );
    if (existing) {
      existing.qty = Math.min(existing.qty + i.qty, stock);
      return;
    }
    result.push({
      id: prod.id,
      variantId: variant ? variant.id : null,
      unitPrice:
        isInt(i.unitPrice) && i.unitPrice > 0
          ? i.unitPrice
          : variant
            ? variant.precio
            : prod.precio,
      qty: Math.min(i.qty, stock),
    });
  });
  return result;
}

function sanitizeOrders(list) {
  if (!Array.isArray(list)) return [];
  return list
    .filter(
      (o) =>
        o &&
        typeof o.code === "string" &&
        o.buyer &&
        typeof o.buyer === "object" &&
        Array.isArray(o.items) &&
        typeof o.total === "number" &&
        Number.isFinite(o.total) &&
        o.total >= 0,
    )
    .map((o) => {
      const items = o.items.filter(
        (item) =>
          item &&
          typeof item.id === "string" &&
          typeof item.nombre === "string" &&
          isInt(item.precio) &&
          item.precio > 0 &&
          isInt(item.qty) &&
          item.qty > 0,
      );
      const status = [
        ...ORDER_STATES,
        "Cancelado",
      ].includes(o.status)
        ? o.status
        : "Confirmado";
      const timeline = Array.isArray(o.timeline)
        ? o.timeline.filter(
            (event) =>
              event &&
              [...ORDER_STATES, "Cancelado"].includes(event.status) &&
              typeof event.date === "string",
          )
        : [];
      return {
        ...o,
        items,
        status,
        discount: isInt(o.discount) && o.discount >= 0 ? o.discount : 0,
        timeline:
          timeline.length > 0
            ? timeline
            : [{ status: "Confirmado", date: o.date || "" }],
      };
    });
}

function sanitizeAddresses(list) {
  if (!Array.isArray(list)) return [];
  const valid = list
    .filter(
      (item) =>
        item &&
        typeof item.id === "string" &&
        list.findIndex((candidate) => candidate && candidate.id === item.id) ===
          list.indexOf(item) &&
        typeof item.alias === "string" &&
        Object.prototype.hasOwnProperty.call(SHIPPING_RATES, item.city) &&
        typeof item.reference === "string",
    );
  const primaryIndex = valid.findIndex((item) => item.primary === true);
  return valid.map((item, index) => ({
    ...item,
    primary: index === (primaryIndex < 0 ? 0 : primaryIndex),
  }));
}

function sanitizeNotifications(items) {
  if (!Array.isArray(items)) return [];
  return items.filter(
    (item, index) =>
      item &&
      typeof item.id === "string" &&
      typeof item.title === "string" &&
      typeof item.message === "string" &&
      typeof item.date === "string" &&
      items.findIndex((candidate) => candidate && candidate.id === item.id) ===
        index,
  ).map((item) => ({ ...item, read: item.read === true }));
}

function sanitizeQuestions(questions, products) {
  const result = {};
  if (!questions || typeof questions !== "object" || Array.isArray(questions))
    return result;
  products.forEach((product) => {
    if (!Array.isArray(questions[product.id])) return;
    result[product.id] = questions[product.id].filter(
      (question) =>
        question &&
        typeof question.id === "string" &&
        typeof question.text === "string" &&
        typeof question.date === "string" &&
        ["Pendiente", "Respondida"].includes(question.status) &&
        typeof question.answer === "string",
    );
  });
  return result;
}

function sanitizeReviews(obj, prods) {
  const result = {};
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return result;
  prods.forEach((p) => {
    if (!Array.isArray(obj[p.id])) return;
    const valid = obj[p.id].filter((n) => isInt(n) && n >= 1 && n <= 5);
    if (valid.length > 0) result[p.id] = valid;
  });
  return result;
}

const cop = (n) => `$${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} COP`;

function ActionButton({
  children,
  onPress,
  small = false,
  disabled = false,
  style,
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={[
        small ? styles.btnSmall : styles.btn,
        disabled && styles.btnOff,
        style,
      ]}
    >
      <Text style={styles.buttonText}>{children}</Text>
    </Pressable>
  );
}

function ChoiceChip({ children, selected, onPress, style }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.chip, selected && styles.chipActive, style]}
    >
      <Text style={selected ? styles.chipSelectedText : styles.chipText}>
        {children}
      </Text>
    </Pressable>
  );
}

function Empty({ text, label, onPress }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.muted}>{text}</Text>
      <Pressable accessibilityRole="button" onPress={onPress}>
        <Text style={styles.link}>{label}</Text>
      </Pressable>
    </View>
  );
}

function Totals({ subtotal, discount = 0, coupon, shipping, total }) {
  return (
    <View style={styles.box}>
      <Text>Subtotal: {cop(subtotal)}</Text>
      {discount > 0 && (
        <Text style={styles.discount}>
          Descuento ({coupon}): -{cop(discount)}
        </Text>
      )}
      <Text>Envío: {shipping === 0 ? "GRATIS" : cop(shipping)}</Text>
      <Text style={styles.title}>Total: {cop(total)}</Text>
    </View>
  );
}

function OrderSummary({
  buyer,
  items,
  subtotal,
  discount,
  coupon,
  shipping,
  total,
}) {
  return (
    <>
      <Text style={styles.muted}>
        Cliente: {buyer.name} ({buyer.phone})
      </Text>
      <Text style={styles.muted}>
        Entrega: {buyer.addressAlias ? `${buyer.addressAlias} · ` : ""}
        {buyer.city}, {buyer.address}
      </Text>
      <View style={styles.box}>
        {items.map((i) => (
          <Text key={`${i.id}-${i.variantId || "base"}`}>
            • {i.nombre} x{i.qty} — {cop(i.precio)} c/u
          </Text>
        ))}
      </View>
      {buyer.deliveryMode && (
        <Text style={styles.muted}>
          Envío {buyer.deliveryMode === "express" ? "exprés" : "estándar"} ·{" "}
          {buyer.deliveryEstimate || DELIVERY_ESTIMATE}
        </Text>
      )}
      <Totals
        subtotal={subtotal}
        discount={discount}
        coupon={coupon}
        shipping={shipping}
        total={total}
      />
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
  const [comparison, setComparison] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState(EMPTY_ADDRESS);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [deliveryMode, setDeliveryMode] = useState("standard");
  const [notifications, setNotifications] = useState([]);
  const [restockSubscriptions, setRestockSubscriptions] = useState([]);
  const [questions, setQuestions] = useState({});
  const [questionInput, setQuestionInput] = useState("");
  const [supportCases, setSupportCases] = useState([]);
  const [supportOrderId, setSupportOrderId] = useState(null);
  const [supportReason, setSupportReason] = useState("Entrega");
  const [supportDescription, setSupportDescription] = useState("");
  const [brandFilter, setBrandFilter] = useState("Todas");
  const [availableOnly, setAvailableOnly] = useState(false);
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
  const [coupon, setCoupon] = useState(null);
  const [couponInput, setCouponInput] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState("");
  const [reviews, setReviews] = useState({});
  const [rating, setRating] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [selectedQty, setSelectedQty] = useState(1);
  const [cancelPrompt, setCancelPrompt] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const scrollRef = useRef(null);
  const toastTimer = useRef(null);
  const cancelledOrderCodes = useRef(new Set());

  const brands = useMemo(
    () => [...new Set(products.map((product) => product.marca))],
    [products],
  );
  const filtered = useMemo(
    () =>
      products
        .filter(
      (p) =>
        p.nombre.toLowerCase().includes(search.trim().toLowerCase()) &&
        (category === "Todas" || p.categoria === category) &&
        (brandFilter === "Todas" || p.marca === brandFilter) &&
        (!availableOnly || p.stock > 0),
        )
        .sort((a, b) =>
          sort === "asc"
            ? a.precio - b.precio
            : sort === "desc"
              ? b.precio - a.precio
              : 0,
        ),
    [
      products,
      search,
      category,
      brandFilter,
      availableOnly,
      sort,
    ],
  );
  const cartItems = useMemo(
    () =>
      cart
        .map((item) => {
          const product = products.find((entry) => entry.id === item.id);
          if (!product) return null;
          const variant =
            product.variantes &&
            product.variantes.find((entry) => entry.id === item.variantId);
          return {
            ...product,
            qty: item.qty,
            variantId: item.variantId || null,
            variantName: variant ? variant.nombre : null,
            precio: item.unitPrice || (variant ? variant.precio : product.precio),
            stock: variant ? variant.stock : product.stock,
            nombre: variant
              ? `${product.nombre} (${variant.nombre})`
              : product.nombre,
          };
        })
        .filter(Boolean),
    [cart, products],
  );
  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + item.precio * item.qty,
        0,
      ),
    [cartItems],
  );
  const activeAddress = addresses.find(
    (address) => address.id === selectedAddressId,
  );
  const shipping =
    cart.length === 0
      ? 0
      : subtotal >= FREE_SHIPPING_FROM
        ? 0
        : activeAddress && SHIPPING_RATES[activeAddress.city]
        ? SHIPPING_RATES[activeAddress.city][deliveryMode]
        : SHIPPING_COST;
  const discount =
    coupon && subtotal > 0 ? Math.round(subtotal * COUPONS[coupon]) : 0;
  const total = Math.max(0, subtotal - discount + shipping);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);
  const current = products.find((p) => p.id === selectedId);
  const editingProduct = products.find((p) => p.id === editingId);
  const selectedVariant =
    current &&
    current.variantes &&
    current.variantes.find((variant) => variant.id === selectedVariantId);
  const relatedProducts = useMemo(
    () =>
      current
        ? products
            .filter(
              (product) =>
                product.id !== current.id &&
                product.categoria === current.categoria &&
                product.stock > 0,
            )
            .slice(0, 4)
        : [],
    [current, products],
  );

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const data = JSON.parse(raw);
          if (!data || typeof data !== "object")
            throw new Error("El estado guardado no tiene un formato válido.");
          const prods = sanitizeProducts(data.products);
          const cleanCart = sanitizeCart(data.cart, prods);
          setProducts(prods);
          setFavorites(sanitizeFavorites(data.favorites, prods));
          setCart(cleanCart);
          const cleanOrders = sanitizeOrders(data.orders);
          setOrders(cleanOrders);
          cancelledOrderCodes.current = new Set(
            cleanOrders
              .filter((order) => order.status === "Cancelado")
              .map((order) => order.code),
          );
          setReviews(sanitizeReviews(data.reviews, prods));
          const cleanAddresses = sanitizeAddresses(data.addresses);
          setAddresses(cleanAddresses);
          setSelectedAddressId(
            cleanAddresses.some((address) => address.id === data.selectedAddressId)
              ? data.selectedAddressId
              : cleanAddresses.find((address) => address.primary)?.id || null,
          );
          setComparison(
            Array.isArray(data.comparison)
              ? data.comparison
                  .filter((id, index) => prods.some((p) => p.id === id) &&
                    data.comparison.indexOf(id) === index)
                  .slice(0, 3)
              : [],
          );
          setNotifications(sanitizeNotifications(data.notifications));
          setRestockSubscriptions(
            Array.isArray(data.restockSubscriptions)
              ? data.restockSubscriptions.filter(
                  (entry, index) =>
                    entry &&
                    typeof entry.id === "string" &&
                    typeof entry.productId === "string" &&
                    data.restockSubscriptions.findIndex(
                      (candidate) =>
                        candidate && candidate.id === entry.id,
                    ) === index &&
                    prods.some((product) => product.id === entry.productId) &&
                    (entry.variantId === null ||
                      prods
                        .find((product) => product.id === entry.productId)
                        .variantes?.some(
                          (variant) => variant.id === entry.variantId,
                        )),
                )
              : [],
          );
          setQuestions(sanitizeQuestions(data.questions, prods));
          setSupportCases(
            Array.isArray(data.supportCases)
              ? data.supportCases.filter(
                  (item) =>
                    item &&
                    typeof item.id === "string" &&
                    typeof item.orderCode === "string" &&
                    typeof item.description === "string" &&
                    SUPPORT_REASONS.includes(item.reason) &&
                    ["Abierto", "Respondido"].includes(item.status),
                )
              : [],
          );
          if (
            typeof data.deliveryMode === "string" &&
            ["standard", "express"].includes(data.deliveryMode)
          )
            setDeliveryMode(data.deliveryMode);
          if (
            typeof data.coupon === "string" &&
            COUPONS[data.coupon] !== undefined &&
            cleanCart.length > 0
          )
            setCoupon(data.coupon);
        }
      } catch (error) {
        setToast(`No se pudieron recuperar los datos guardados: ${error.message}`);
      }
      setHydrated(true);
    })();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        products,
        favorites,
        cart,
        orders,
        reviews,
        coupon,
        comparison,
        addresses,
        selectedAddressId,
        deliveryMode,
        notifications,
        restockSubscriptions,
        questions,
        supportCases,
      }),
    ).catch((error) => {
      setToast(`No se pudieron guardar los cambios: ${error.message}`);
    });
  }, [
    hydrated,
    products,
    favorites,
    cart,
    orders,
    reviews,
    coupon,
    comparison,
    addresses,
    selectedAddressId,
    deliveryMode,
    notifications,
    restockSubscriptions,
    questions,
    supportCases,
  ]);

  const notify = (msg) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2500);
  };

  useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    },
    [],
  );

  const addNotification = (id, title, message) => {
    setNotifications((previous) =>
      previous.some((item) => item.id === id)
        ? previous
        : [
            {
              id,
              title,
              message,
              date: new Date().toLocaleString(),
              read: false,
            },
            ...previous,
          ],
    );
  };

  const openDetail = (id) => {
    setSelectedId(id);
    setRating(0);
    const product = products.find((entry) => entry.id === id);
    setSelectedVariantId(
      product && product.variantes ? product.variantes[0].id : null,
    );
    setSelectedQty(1);
    setQuestionInput("");
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

  const addToCart = (prod, variantId = null, quantity = 1) => {
    if (prod.variantes && !variantId)
      return notify("Selecciona una variante antes de agregar");
    const variant =
      prod.variantes && prod.variantes.find((entry) => entry.id === variantId);
    const stock = variant ? variant.stock : prod.stock;
    const price = variant ? variant.precio : prod.precio;
    const item = cart.find(
      (entry) =>
        entry.id === prod.id && entry.variantId === (variant ? variant.id : null),
    );
    if (!Number.isInteger(quantity) || quantity <= 0)
      return notify("La cantidad debe ser un entero positivo");
    if (stock <= 0) return notify("Producto agotado");
    if ((item ? item.qty : 0) + quantity > stock)
      return notify(`Stock máximo disponible: ${stock}`);
    setCart((previous) => {
      const currentItem = previous.find(
        (entry) =>
          entry.id === prod.id &&
          entry.variantId === (variant ? variant.id : null),
      );
      return currentItem
        ? previous.map((entry) =>
            entry === currentItem
              ? { ...entry, qty: entry.qty + quantity }
              : entry,
          )
        : [
            ...previous,
            {
              id: prod.id,
              variantId: variant ? variant.id : null,
              unitPrice: price,
              qty: quantity,
            },
          ];
    });
    notify("Agregado al carrito");
  };

  const removeFromCart = (id, variantId = null) => {
    const nextCart = cart.filter(
      (item) => !(item.id === id && item.variantId === variantId),
    );
    setCart(nextCart);
    if (nextCart.length === 0) setCoupon(null);
    notify("Producto eliminado del carrito");
  };

  const changeQty = (item, delta) => {
    const next = item.qty + delta;
    if (next <= 0) return removeFromCart(item.id, item.variantId);
    if (next > item.stock) return notify(`Stock límite: ${item.stock}`);
    setCart(
      cart.map((entry) =>
        entry.id === item.id && entry.variantId === item.variantId
          ? { ...entry, qty: next }
          : entry,
      ),
    );
  };

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (cart.length === 0)
      return notify("Agrega productos al carrito para usar un cupón");
    if (!code) return notify("Escribe un código de cupón");
    if (COUPONS[code] === undefined) return notify("Cupón no válido");
    setCoupon(code);
    setCouponInput("");
    notify(`Cupón ${code} aplicado`);
  };

  const removeCoupon = () => {
    setCoupon(null);
    notify("Cupón retirado");
  };

  const ratingOf = (id) => {
    const list = reviews[id] || [];
    return {
      count: list.length,
      avg: list.length ? list.reduce((a, n) => a + n, 0) / list.length : 0,
    };
  };

  const saveReview = (id) => {
    if (!Number.isInteger(rating) || rating < 1 || rating > 5)
      return notify("La valoración debe ser un entero entre 1 y 5");
    setReviews({ ...reviews, [id]: [...(reviews[id] || []), rating] });
    setRating(0);
    notify("¡Gracias por tu valoración!");
  };

  const toggleComparison = (id) => {
    if (comparison.includes(id)) {
      setComparison((previous) =>
        previous.filter((productId) => productId !== id),
      );
      return notify("Producto retirado del comparador");
    }
    if (comparison.length >= 3)
      return notify("El comparador permite máximo 3 productos");
    setComparison((previous) =>
      previous.includes(id) || previous.length >= 3
        ? previous
        : [...previous, id],
    );
    notify("Producto agregado al comparador");
  };

  const resetCatalogFilters = () => {
    setSearch("");
    setCategory("Todas");
    setBrandFilter("Todas");
    setAvailableOnly(false);
    setSort("none");
  };

  const saveAddress = () => {
    const alias = addressForm.alias.trim();
    const reference = addressForm.reference.trim();
    if (!alias || !reference || !SHIPPING_RATES[addressForm.city])
      return notify("Completa alias, municipio y referencia de entrega");
    const id = editingAddressId || `address-${Date.now()}`;
    const address = { id, alias, city: addressForm.city, reference };
    setAddresses((previous) => {
      if (editingAddressId)
        return previous.map((item) =>
          item.id === editingAddressId ? { ...item, ...address } : item,
        );
      const primary = previous.length === 0;
      return [...previous, { ...address, primary }];
    });
    if (!selectedAddressId) setSelectedAddressId(id);
    setAddressForm(EMPTY_ADDRESS);
    setEditingAddressId(null);
    notify(editingAddressId ? "Dirección actualizada" : "Dirección guardada");
  };

  const selectAddress = (id) => {
    setSelectedAddressId(id);
    setAddresses((previous) =>
      previous.map((address) => ({ ...address, primary: address.id === id })),
    );
    notify("Dirección principal actualizada");
  };

  const addQuestion = () => {
    const text = questionInput.trim();
    if (text.length < 10)
      return notify("La pregunta debe tener al menos 10 caracteres");
    const question = {
      id: `question-${Date.now()}`,
      text,
      date: new Date().toLocaleString(),
      status: "Pendiente",
      answer: "",
    };
    setQuestions((previous) => ({
      ...previous,
      [current.id]: [...(previous[current.id] || []), question],
    }));
    setQuestionInput("");
    notify("Pregunta registrada en modo demostración");
  };

  const simulateQuestionAnswer = (questionId) => {
    setQuestions((previous) => ({
      ...previous,
      [current.id]: (previous[current.id] || []).map((question) =>
        question.id === questionId && question.status === "Pendiente"
          ? {
              ...question,
              status: "Respondida",
              answer:
                "Respuesta de demostración: consulta las características del producto antes de comprar.",
            }
          : question,
      ),
    }));
  };

  const subscribeForRestock = (product, variantId = null) => {
    const id = `${product.id}:${variantId || "base"}`;
    if (restockSubscriptions.some((subscription) => subscription.id === id))
      return notify("Ya recibirás un aviso para este artículo");
    setRestockSubscriptions((previous) => [
      ...previous,
      { id, productId: product.id, variantId },
    ]);
    notify("Aviso de reposición activado");
  };

  const cancelRestockSubscription = (product, variantId = null) => {
    const id = `${product.id}:${variantId || "base"}`;
    setRestockSubscriptions((previous) =>
      previous.filter((subscription) => subscription.id !== id),
    );
    notify("Aviso de reposición cancelado");
  };

  const simulateRestock = (product, variantId = null) => {
    if (product.variantes && product.variantes.length && !variantId)
      return notify("Selecciona una variante para reponer");
    const targetVariant =
      variantId &&
      product.variantes &&
      product.variantes.find((variant) => variant.id === variantId);
    if (variantId && (!targetVariant || targetVariant.stock > 0))
      return notify("Solo puedes reponer una variante agotada");
    const matching = restockSubscriptions.filter(
      (subscription) =>
        subscription.productId === product.id &&
        subscription.variantId === variantId,
    );
    const restockEventId = Date.now();
    setProducts((previous) =>
      previous.map((entry) => {
        if (entry.id !== product.id) return entry;
        if (!variantId) return { ...entry, stock: entry.stock + 5 };
        const variantes = entry.variantes.map((variant) =>
          variant.id === variantId
            ? { ...variant, stock: variant.stock + 5 }
            : variant,
        );
        return {
          ...entry,
          variantes,
          stock: variantes.reduce((sum, variant) => sum + variant.stock, 0),
        };
      }),
    );
    matching.forEach((subscription) =>
      addNotification(
        `restock-${subscription.id}-${restockEventId}`,
        "Producto disponible",
        `${product.nombre}${variantId ? ` (${product.variantes.find((v) => v.id === variantId).nombre})` : ""} tiene nuevas unidades.`,
      ),
    );
    setRestockSubscriptions((previous) =>
      previous.filter((subscription) => !matching.includes(subscription)),
    );
    notify("Reposición simulada: se agregaron 5 unidades");
  };

  const advanceOrder = (order) => {
    const index = ORDER_STATES.indexOf(order.status);
    if (index < 0 || index >= ORDER_STATES.length - 1)
      return notify("Este pedido ya no puede avanzar");
    const status = ORDER_STATES[index + 1];
    const event = { status, date: new Date().toLocaleString() };
    const updated = {
      ...order,
      status,
      timeline: [...(order.timeline || []), event],
    };
    setOrders((previous) =>
      previous.map((item) => (item.code === order.code ? updated : item)),
    );
    setSelectedOrder(updated);
    addNotification(
      `order-${order.code}-${status}`,
      "Actualización de pedido",
      `${order.code}: ${status}`,
    );
    notify(`Estado actualizado: ${status}`);
  };

  const cancelOrder = (order) => {
    if (cancelledOrderCodes.current.has(order.code) || order.status === "Cancelado")
      return notify("Este pedido ya está cancelado");
    if (!["Confirmado", "Preparando"].includes(order.status))
      return notify("No es posible cancelar después de iniciar el envío");
    cancelledOrderCodes.current.add(order.code);
    const event = {
      status: "Cancelado",
      date: new Date().toLocaleString(),
    };
    const updated = {
      ...order,
      status: "Cancelado",
      timeline: [...(order.timeline || []), event],
    };
    setProducts((previous) =>
      previous.map((product) => {
        const purchased = order.items.filter((item) => item.id === product.id);
        if (purchased.length === 0) return product;
        if (!product.variantes)
          return {
            ...product,
            stock:
              product.stock +
              purchased.reduce((sum, item) => sum + item.qty, 0),
          };
        const variantes = product.variantes.map((variant) => ({
          ...variant,
          stock:
            variant.stock +
            purchased
              .filter((item) => item.variantId === variant.id)
              .reduce((sum, item) => sum + item.qty, 0),
        }));
        return {
          ...product,
          variantes,
          stock: variantes.reduce((sum, variant) => sum + variant.stock, 0),
        };
      }),
    );
    setOrders((previous) =>
      previous.map((item) => (item.code === order.code ? updated : item)),
    );
    setSelectedOrder(updated);
    setCancelPrompt(false);
    addNotification(
      `order-${order.code}-Cancelado`,
      "Pedido cancelado",
      `${order.code}: se restituyó el inventario.`,
    );
    notify("Pedido cancelado; inventario restituido");
  };

  const createSupportCase = () => {
    if (!supportOrderId) return notify("Selecciona un pedido");
    const description = supportDescription.trim();
    if (description.length < 15)
      return notify("Describe el caso con al menos 15 caracteres");
    const caseNumber = `CASO-${String(supportCases.length + 1).padStart(4, "0")}`;
    setSupportCases((previous) => [
      {
        id: caseNumber,
        orderCode: supportOrderId,
        reason: supportReason,
        description,
        status: "Abierto",
        answer: "",
        date: new Date().toLocaleString(),
      },
      ...previous,
    ]);
    setSupportDescription("");
    notify(`Solicitud ${caseNumber} registrada`);
  };

  const simulateSupportReply = (caseId) => {
    setSupportCases((previous) =>
      previous.map((item) =>
        item.id === caseId && item.status === "Abierto"
          ? {
              ...item,
              status: "Respondido",
              answer:
                "Respuesta de prueba: recibimos tu solicitud y estamos revisando el caso.",
            }
          : item,
      ),
    );
  };

  const nextProductId = () => {
    const max = products.reduce((m, p) => {
      const n = parseInt(String(p.id).replace(/\D/g, ""), 10);
      return Number.isFinite(n) && n > m ? n : m;
    }, 0);
    return `PROD-${String(max + 1).padStart(3, "0")}`;
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setFormError("");
  };

  const startEdit = (p) => {
    setForm({
      nombre: p.nombre,
      categoria: p.categoria,
      precio: String(p.precio),
      stock: String(p.stock),
      descripcion: p.descripcion,
    });
    setEditingId(p.id);
    setFormError("");
    if (scrollRef.current) scrollRef.current.scrollTo({ y: 0, animated: true });
  };

  const saveProduct = () => {
    const nombre = form.nombre.trim();
    const descripcion = form.descripcion.trim();
    const precioTxt = form.precio.trim();
    const stockTxt = form.stock.trim();
    let error = "";
    if (!nombre) error = "El nombre no puede estar vacío";
    else if (
      products.some(
        (p) =>
          p.id !== editingId && p.nombre.toLowerCase() === nombre.toLowerCase(),
      )
    )
      error = "Ya existe un producto con ese nombre";
    else if (!form.categoria) error = "Elige una categoría";
    else if (!/^\d+$/.test(precioTxt) || Number(precioTxt) <= 0)
      error = "El precio debe ser un número entero positivo";
    else if (!/^\d+$/.test(stockTxt))
      error = "El stock debe ser un número entero igual o mayor a 0";
    else if (descripcion.length < 15)
      error = "La descripción debe tener al menos 15 caracteres";

    if (error) {
      setFormError(error);
      return notify(error);
    }

    const precio = Number(precioTxt);
    const stock = Number(stockTxt);
    if (editingId) {
      setProducts(
        products.map((p) =>
          p.id === editingId
            ? {
                ...p,
                nombre,
                categoria: form.categoria,
                marca: BRAND_BY_CATEGORY[form.categoria],
                precio: p.variantes ? p.precio : precio,
                stock: p.variantes
                  ? p.variantes.reduce(
                      (sum, variant) => sum + variant.stock,
                      0,
                    )
                  : stock,
                descripcion,
              }
            : p,
        ),
      );
      const nextCart = cart
        .map((item) => {
          if (item.id !== editingId) return item;
          const product = products.find((entry) => entry.id === editingId);
          const variant =
            product.variantes &&
            product.variantes.find((entry) => entry.id === item.variantId);
          const limit = variant ? variant.stock : stock;
          return {
            ...item,
            unitPrice: variant ? variant.precio : precio,
            qty: Math.min(item.qty, limit),
          };
        })
        .filter((item) => item.qty > 0);
      setCart(nextCart);
      if (nextCart.length === 0) setCoupon(null);
      notify("Producto actualizado");
    } else {
      setProducts([
        ...products,
        {
          id: nextProductId(),
          nombre,
          categoria: form.categoria,
          precio,
          stock,
          marca: BRAND_BY_CATEGORY[form.categoria],
          descripcion,
        },
      ]);
      notify("Producto registrado en el catálogo");
    }
    resetForm();
  };

  const resetAll = () => {
    AsyncStorage.removeItem(STORAGE_KEY).catch((error) => {
      setToast(`No se pudieron borrar los datos guardados: ${error.message}`);
    });
    setProducts(INITIAL_PRODUCTS);
    setFavorites([]);
    setCart([]);
    setOrders([]);
    cancelledOrderCodes.current.clear();
    setComparison([]);
    setAddresses([]);
    setSelectedAddressId(null);
    setDeliveryMode("standard");
    setNotifications([]);
    setRestockSubscriptions([]);
    setQuestions({});
    setSupportCases([]);
    setReviews({});
    setCoupon(null);
    setBuyer({ name: "", phone: "", city: "", address: "" });
    setSelectedOrder(null);
    setSearch("");
    setCategory("Todas");
    setSort("none");
    setBrandFilter("Todas");
    setAvailableOnly(false);
    resetForm();
    notify("Datos restablecidos al estado inicial");
  };

  const goToReview = () => {
    const missing = FIELDS
      .filter(([key]) => ["name", "phone"].includes(key))
      .find(([key]) => !buyer[key].trim());
    if (missing) return notify(`Falta: ${missing[1]}`);
    if (!activeAddress) return notify("Selecciona una dirección de entrega");
    if (!SHIPPING_RATES[activeAddress.city])
      return notify("No hay tarifa disponible para ese municipio");
    setScreen("review");
  };

  const confirmPurchase = () => {
    if (cart.length === 0) return notify("El carrito está vacío");
    const noStock = cartItems.find((i) => i.qty > i.stock);
    if (noStock) return notify(`Stock insuficiente de ${noStock.nombre}`);
    if (!activeAddress) return notify("Selecciona una dirección de entrega");

    setProducts(
      products.map((p) => {
        const bought = cart.filter((i) => i.id === p.id);
        if (bought.length === 0) return p;
        if (!p.variantes)
          return {
            ...p,
            stock: Math.max(
              0,
              p.stock - bought.reduce((sum, item) => sum + item.qty, 0),
            ),
          };
        const variantes = p.variantes.map((variant) => ({
          ...variant,
          stock: Math.max(
            0,
            variant.stock -
              bought
                .filter((item) => item.variantId === variant.id)
                .reduce((sum, item) => sum + item.qty, 0),
          ),
        }));
        return {
          ...p,
          variantes,
          stock: variantes.reduce((sum, variant) => sum + variant.stock, 0),
        };
      }),
    );
    const orderCode = `WIND-${String(orders.length + 1).padStart(4, "0")}`;
    const orderDate = new Date().toLocaleString();
    const order = {
      code: orderCode,
      date: orderDate,
      status: "Confirmado",
      timeline: [{ status: "Confirmado", date: orderDate }],
      deliveryMode,
      deliveryEstimate: DELIVERY_ESTIMATE,
      buyer: {
        ...buyer,
        city: activeAddress.city,
        address: activeAddress.reference,
        addressAlias: activeAddress.alias,
        deliveryMode,
        deliveryEstimate: DELIVERY_ESTIMATE,
      },
      items: cartItems.map(({ id, nombre, precio, qty, variantId }) => ({
        id,
        nombre,
        precio,
        qty,
        variantId,
      })),
      subtotal,
      discount,
      coupon,
      shipping,
      total,
    };
    setOrders([order, ...orders]);
    setCart([]);
    setCoupon(null);
    setSelectedOrder(order);
    setScreen("order");
    addNotification(
      `order-${order.code}-Confirmado`,
      "Pedido confirmado",
      `${order.code}: Confirmado. Compra simulada sin cobro real.`,
    );
    notify(`Pedido ${order.code} confirmado · simulación sin cobro real`);
  };

  if (!hydrated)
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={styles.muted}>Cargando WINDROSE...</Text>
      </View>
    );

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
        ref={scrollRef}
        keyboardShouldPersistTaps="handled"
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
            <View style={styles.box}>
              <Text style={styles.bold}>Filtros de catálogo</Text>
              <Text style={styles.muted}>Marca</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginVertical: 6 }}
              >
                {["Todas", ...brands].map((brand) => (
                  <ChoiceChip
                    key={brand}
                    selected={brandFilter === brand}
                    onPress={() => setBrandFilter(brand)}
                  >
                    {brand}
                  </ChoiceChip>
                ))}
              </ScrollView>
              <View style={styles.row}>
                <ChoiceChip
                  selected={availableOnly}
                  onPress={() => setAvailableOnly((value) => !value)}
                >
                  {availableOnly ? "✓ " : ""}Solo disponibles
                </ChoiceChip>
              </View>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginBottom: 10 }}
            >
              {CATEGORIES.map((cat) => (
                <ChoiceChip
                  key={cat}
                  selected={category === cat}
                  onPress={() => setCategory(cat)}
                >
                  {cat}
                </ChoiceChip>
              ))}
            </ScrollView>
            <View style={styles.row}>
              <Text style={[styles.muted, { marginRight: 8 }]}>Ordenar:</Text>
              {SORTS.map(([key, label]) => (
                <ChoiceChip
                  key={key}
                  selected={sort === key}
                  onPress={() => setSort(key)}
                >
                  {label}
                </ChoiceChip>
              ))}
            </View>

            {filtered.length === 0 ? (
              <Empty
                text="No encontramos productos"
                label="Limpiar filtros"
                onPress={resetCatalogFilters}
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
                    <Text style={styles.small}>Marca: {p.marca}</Text>
                    <Text style={p.stock > 0 ? styles.green : styles.red}>
                      {p.stock > 0 ? `Stock: ${p.stock}` : "Agotado"}
                    </Text>
                    {ratingOf(p.id).count > 0 && (
                      <Text style={styles.small}>
                        ★ {ratingOf(p.id).avg.toFixed(1)} (
                        {ratingOf(p.id).count})
                      </Text>
                    )}
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
            <Text style={styles.muted}>Marca: {current.marca}</Text>
            <Text style={{ marginVertical: 8 }}>{current.descripcion}</Text>
            {current.variantes && (
              <View style={styles.box}>
                <Text style={styles.bold}>Elige una variante</Text>
                <View style={styles.wrap}>
                  {current.variantes.map((variant) => (
                    <ChoiceChip
                      key={variant.id}
                      selected={selectedVariantId === variant.id}
                      style={{ marginTop: 8 }}
                      onPress={() => {
                        setSelectedVariantId(variant.id);
                        setSelectedQty(1);
                      }}
                    >
                      {variant.nombre}
                    </ChoiceChip>
                  ))}
                </View>
              </View>
            )}
            <Text style={styles.title}>
              {cop(selectedVariant ? selectedVariant.precio : current.precio)}
            </Text>
            <Text
              style={
                (selectedVariant ? selectedVariant.stock : current.stock) > 0
                  ? styles.green
                  : styles.red
              }
            >
              {(selectedVariant ? selectedVariant.stock : current.stock) > 0
                ? `Disponibles: ${selectedVariant ? selectedVariant.stock : current.stock}`
                : "Agotado"}
            </Text>
            <View style={styles.row}>
              <Pressable
                style={styles.qtyBtn}
                onPress={() => setSelectedQty((value) => Math.max(1, value - 1))}
              >
                <Text>-</Text>
              </Pressable>
              <Text style={styles.qty}>{selectedQty}</Text>
              <Pressable
                style={styles.qtyBtn}
                onPress={() => {
                  const available = selectedVariant
                    ? selectedVariant.stock
                    : current.stock;
                  if (selectedQty >= available)
                    return notify(`Stock máximo disponible: ${available}`);
                  setSelectedQty((value) => value + 1);
                }}
              >
                <Text>+</Text>
              </Pressable>
            </View>
            <ActionButton
              disabled={
                (selectedVariant ? selectedVariant.stock : current.stock) === 0
              }
              onPress={() =>
                addToCart(current, selectedVariantId, selectedQty)
              }
            >
              {(selectedVariant ? selectedVariant.stock : current.stock) === 0
                ? "Agotado"
                : "Agregar al carrito"}
            </ActionButton>
            {(selectedVariant ? selectedVariant.stock : current.stock) === 0 && (
              restockSubscriptions.some(
                (subscription) =>
                  subscription.productId === current.id &&
                  subscription.variantId ===
                    (selectedVariant ? selectedVariant.id : null),
              ) ? (
                <ActionButton
                  onPress={() =>
                    cancelRestockSubscription(
                      current,
                      selectedVariant ? selectedVariant.id : null,
                    )
                  }
                >
                  Cancelar aviso de reposición
                </ActionButton>
              ) : (
                <ActionButton
                  onPress={() =>
                    subscribeForRestock(
                      current,
                      selectedVariant ? selectedVariant.id : null,
                    )
                  }
                >
                  Avisarme cuando haya stock
                </ActionButton>
              )
            )}
            <View style={styles.box}>
              <Text style={styles.bold}>Valoraciones</Text>
              <Text style={styles.muted}>
                {ratingOf(current.id).count > 0
                  ? `★ ${ratingOf(current.id).avg.toFixed(1)} de 5 · ${ratingOf(current.id).count} ${ratingOf(current.id).count === 1 ? "valoración" : "valoraciones"}`
                  : "Aún no hay valoraciones"}
              </Text>
              <Text style={[styles.muted, { marginTop: 8 }]}>
                Tu calificación:
              </Text>
              <View style={styles.row}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <Pressable key={n} onPress={() => setRating(n)}>
                    <Text style={styles.starBig}>
                      {n <= rating ? "★" : "☆"}
                    </Text>
                  </Pressable>
                ))}
              </View>
              <ActionButton onPress={() => saveReview(current.id)}>
                Guardar valoración
              </ActionButton>
            </View>
            <View style={styles.box}>
              <ActionButton
                onPress={() => toggleComparison(current.id)}
                style={[
                  styles.compareAction,
                  comparison.includes(current.id) && styles.compareSelected,
                ]}
              >
                {comparison.includes(current.id)
                  ? "Quitar del comparador"
                  : "Agregar al comparador"}
              </ActionButton>
            </View>
            <View style={styles.box}>
              <Text style={styles.bold}>Preguntas del producto</Text>
              {(questions[current.id] || []).length === 0 ? (
                <Text style={styles.muted}>Aún no hay preguntas.</Text>
              ) : (
                (questions[current.id] || []).map((question) => (
                  <View key={question.id} style={styles.question}>
                    <Text style={styles.bold}>{question.text}</Text>
                    <Text style={styles.small}>
                      {question.date} · {question.status}
                    </Text>
                    {question.answer ? (
                      <Text style={styles.muted}>{question.answer}</Text>
                    ) : (
                      <Pressable
                        onPress={() => simulateQuestionAnswer(question.id)}
                      >
                        <Text style={styles.link}>Simular respuesta</Text>
                      </Pressable>
                    )}
                  </View>
                ))
              )}
              <TextInput
                style={[styles.input, styles.inputMulti, { marginTop: 10 }]}
                placeholder="Escribe una pregunta (mínimo 10 caracteres)"
                value={questionInput}
                onChangeText={setQuestionInput}
                multiline
              />
              <ActionButton onPress={addQuestion}>Enviar pregunta</ActionButton>
              <Text style={styles.small}>
                Las respuestas son simuladas y no provienen de personas reales.
              </Text>
            </View>
            <View style={styles.box}>
              <Text style={styles.bold}>Productos relacionados</Text>
              {relatedProducts.length === 0 ? (
                <Text style={styles.muted}>
                  No hay productos disponibles de esta categoría.
                </Text>
              ) : (
                relatedProducts.map((product) => (
                  <Pressable
                    key={product.id}
                    style={styles.itemRow}
                    onPress={() => openDetail(product.id)}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.bold}>{product.nombre}</Text>
                      <Text style={styles.price}>{cop(product.precio)}</Text>
                    </View>
                    <Text style={styles.link}>Ver</Text>
                  </Pressable>
                ))
              )}
            </View>
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
                  <View
                    key={`${i.id}-${i.variantId || "base"}`}
                    style={styles.itemRow}
                  >
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
                    <Pressable
                      onPress={() => removeFromCart(i.id, i.variantId)}
                    >
                      <Text style={[styles.danger, { marginLeft: 10 }]}>
                        Eliminar
                      </Text>
                    </Pressable>
                  </View>
                ))}
                <View style={styles.box}>
                  <Text style={styles.bold}>Cupón promocional</Text>
                  {coupon ? (
                    <View
                      style={[styles.row, { marginTop: 8, marginBottom: 0 }]}
                    >
                      <Text style={[styles.discount, { flex: 1 }]}>
                        Cupón {coupon} aplicado (-{COUPONS[coupon] * 100}%)
                      </Text>
                      <Pressable onPress={removeCoupon}>
                        <Text style={styles.danger}>Quitar</Text>
                      </Pressable>
                    </View>
                  ) : (
                    <View
                      style={[styles.row, { marginTop: 8, marginBottom: 0 }]}
                    >
                      <TextInput
                        style={[
                          styles.input,
                          { flex: 1, marginBottom: 0, marginRight: 8 },
                        ]}
                        placeholder="Código de cupón"
                        autoCapitalize="characters"
                        value={couponInput}
                        onChangeText={setCouponInput}
                      />
                      <ActionButton small onPress={applyCoupon}>
                        Aplicar
                      </ActionButton>
                    </View>
                  )}
                </View>
                <Totals
                  subtotal={subtotal}
                  discount={discount}
                  coupon={coupon}
                  shipping={shipping}
                  total={total}
                />
                <ActionButton onPress={() => setScreen("checkout")}>
                  Continuar compra
                </ActionButton>
              </>
            )}
          </>
        )}

        {screen === "checkout" && (
          <>
            <Text style={styles.title}>Datos del comprador</Text>
            <Text style={[styles.muted, { marginBottom: 10 }]}>
              Usa datos ficticios; no ingreses información sensible.
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
            <Text style={styles.title}>Dirección de entrega</Text>
            {addresses.length === 0 ? (
              <Empty
                text="Primero registra una dirección ficticia."
                label="Crear dirección"
                onPress={() => setScreen("addresses")}
              />
            ) : (
              addresses.map((address) => (
                <Pressable
                  key={address.id}
                  style={[
                    styles.addressCard,
                    selectedAddressId === address.id && styles.addressSelected,
                  ]}
                  onPress={() => selectAddress(address.id)}
                >
                  <Text style={styles.bold}>
                    {selectedAddressId === address.id ? "✓ " : ""}
                    {address.alias}
                    {address.primary ? " · Principal" : ""}
                  </Text>
                  <Text style={styles.muted}>
                    {address.city} · {address.reference}
                  </Text>
                </Pressable>
              ))
            )}
            {activeAddress && (
              <>
                <Text style={styles.title}>Modalidad de envío</Text>
                <View style={styles.wrap}>
                  {[
                    ["standard", "Estándar"],
                    ["express", "Exprés"],
                  ].map(([mode, label]) => (
                    <ChoiceChip
                      key={mode}
                      selected={deliveryMode === mode}
                      onPress={() => setDeliveryMode(mode)}
                    >
                      {label}
                    </ChoiceChip>
                  ))}
                </View>
                <View style={styles.box}>
                  <Text style={styles.bold}>
                    Envío: {shipping === 0 ? "GRATIS" : cop(shipping)}
                  </Text>
                  <Text style={styles.muted}>
                    Tarifa de práctica:{" "}
                    {cop(SHIPPING_RATES[activeAddress.city][deliveryMode])} ·{" "}
                    {DELIVERY_ESTIMATE}
                  </Text>
                </View>
              </>
            )}
            <Pressable onPress={() => setScreen("addresses")}>
              <Text style={styles.link}>Administrar mis direcciones</Text>
            </Pressable>
            <Totals
              subtotal={subtotal}
              discount={discount}
              coupon={coupon}
              shipping={shipping}
              total={total}
            />
            <ActionButton onPress={goToReview}>Revisar pedido</ActionButton>
            <Pressable onPress={() => setScreen("cart")}>
              <Text style={styles.link}>Volver al carrito</Text>
            </Pressable>
          </>
        )}

        {screen === "review" && (
          <>
            <Text style={styles.title}>Revisa tu pedido</Text>
            <OrderSummary
              buyer={{
                ...buyer,
                city: activeAddress ? activeAddress.city : "",
                address: activeAddress ? activeAddress.reference : "",
                addressAlias: activeAddress ? activeAddress.alias : "",
                deliveryMode,
                deliveryEstimate: DELIVERY_ESTIMATE,
              }}
              items={cartItems}
              subtotal={subtotal}
              discount={discount}
              coupon={coupon}
              shipping={shipping}
              total={total}
            />
            <ActionButton onPress={confirmPurchase}>
              Confirmar compra
            </ActionButton>
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
                  <Text style={styles.muted}>Estado: {o.status}</Text>
                  <Text style={styles.price}>Total: {cop(o.total)}</Text>
                </Pressable>
              ))
            )}
          </>
        )}

        {screen === "compare" && (
          <>
            <Text style={styles.title}>Comparador de productos</Text>
            <Text style={styles.muted}>
              Selecciona de 2 a 3 productos desde el catálogo.
            </Text>
            {comparison.length < 2 ? (
              <Empty
                text="Agrega al menos dos productos para compararlos."
                label="Ir al catálogo"
                onPress={() => setScreen("home")}
              />
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator>
                <View style={styles.compareRow}>
                  {comparison
                    .map((id) => products.find((product) => product.id === id))
                    .filter(Boolean)
                    .map((product) => (
                      <View key={product.id} style={styles.compareCard}>
                        <Text style={styles.bold}>{product.nombre}</Text>
                        <Text style={styles.muted}>
                          Marca: {product.marca}
                        </Text>
                        <Text style={styles.price}>{cop(product.precio)}</Text>
                        <Text
                          style={product.stock > 0 ? styles.green : styles.red}
                        >
                          {product.stock > 0
                            ? `Disponible · ${product.stock}`
                            : "Agotado"}
                        </Text>
                        <Pressable onPress={() => toggleComparison(product.id)}>
                          <Text style={styles.danger}>Quitar</Text>
                        </Pressable>
                      </View>
                    ))}
                </View>
              </ScrollView>
            )}
          </>
        )}

        {screen === "addresses" && (
          <>
            <Text style={styles.title}>Mis direcciones ficticias</Text>
            <Text style={styles.muted}>
              Usa referencias de prueba; no ingreses datos personales reales.
            </Text>
            <View style={styles.box}>
              <Text style={styles.bold}>
                {editingAddressId ? "Editar dirección" : "Nueva dirección"}
              </Text>
              <TextInput
                style={[styles.input, { marginTop: 10 }]}
                placeholder="Alias (por ejemplo, Casa)"
                value={addressForm.alias}
                onChangeText={(text) =>
                  setAddressForm({ ...addressForm, alias: text })
                }
              />
              <Text style={styles.muted}>Municipio</Text>
              <View style={styles.wrap}>
                {Object.keys(SHIPPING_RATES).map((city) => (
                <ChoiceChip
                    key={city}
                  selected={addressForm.city === city}
                  style={{ marginTop: 8 }}
                    onPress={() => setAddressForm({ ...addressForm, city })}
                  >
                  {city}
                </ChoiceChip>
                ))}
              </View>
              <TextInput
                style={[styles.input, { marginTop: 10 }]}
                placeholder="Referencia de entrega ficticia"
                value={addressForm.reference}
                onChangeText={(text) =>
                  setAddressForm({ ...addressForm, reference: text })
                }
              />
              <ActionButton onPress={saveAddress}>
                {editingAddressId ? "Guardar cambios" : "Agregar dirección"}
              </ActionButton>
              {editingAddressId && (
                <Pressable
                  onPress={() => {
                    setAddressForm(EMPTY_ADDRESS);
                    setEditingAddressId(null);
                  }}
                >
                  <Text style={styles.link}>Cancelar edición</Text>
                </Pressable>
              )}
            </View>
            {addresses.length === 0 ? (
              <Text style={styles.muted}>Aún no tienes direcciones guardadas.</Text>
            ) : (
              addresses.map((address) => (
                <View key={address.id} style={styles.addressCard}>
                  <Text style={styles.bold}>
                    {address.alias}
                    {address.primary ? " · Principal" : ""}
                  </Text>
                  <Text style={styles.muted}>
                    {address.city} · {address.reference}
                  </Text>
                  <View style={styles.row}>
                    <Pressable onPress={() => selectAddress(address.id)}>
                      <Text style={styles.link}>Elegir como principal</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => {
                        setAddressForm({
                          alias: address.alias,
                          city: address.city,
                          reference: address.reference,
                        });
                        setEditingAddressId(address.id);
                      }}
                    >
                      <Text style={styles.link}>Editar</Text>
                    </Pressable>
                  </View>
                </View>
              ))
            )}
          </>
        )}

        {screen === "notifications" && (
          <>
            <Text style={styles.title}>Centro de avisos</Text>
            {notifications.length === 0 ? (
              <Empty
                text="No tienes notificaciones por ahora."
                label="Ir al catálogo"
                onPress={() => setScreen("home")}
              />
            ) : (
              notifications.map((notification) => (
                <Pressable
                  key={notification.id}
                  style={[
                    styles.box,
                    !notification.read && styles.unreadNotification,
                  ]}
                  onPress={() =>
                    setNotifications((previous) =>
                      previous.map((item) =>
                        item.id === notification.id
                          ? { ...item, read: true }
                          : item,
                      ),
                    )
                  }
                >
                  <Text style={styles.bold}>{notification.title}</Text>
                  <Text style={styles.muted}>{notification.message}</Text>
                  <Text style={styles.small}>
                    {notification.date} ·{" "}
                    {notification.read ? "Leída" : "Sin leer"}
                  </Text>
                </Pressable>
              ))
            )}
          </>
        )}

        {screen === "help" && (
          <>
            <Text style={styles.title}>Centro de ayuda</Text>
            {orders.length === 0 ? (
              <Empty
                text="Necesitas un pedido para crear una solicitud."
                label="Ir al catálogo"
                onPress={() => setScreen("home")}
              />
            ) : (
              <>
                <Text style={styles.muted}>Selecciona un pedido</Text>
                {orders.map((order) => (
                  <Pressable
                    key={order.code}
                    style={[
                      styles.addressCard,
                      supportOrderId === order.code && styles.addressSelected,
                    ]}
                    onPress={() => setSupportOrderId(order.code)}
                  >
                    <Text style={styles.bold}>
                      {supportOrderId === order.code ? "✓ " : ""}
                      {order.code} · {order.status}
                    </Text>
                  </Pressable>
                ))}
                <Text style={[styles.muted, { marginTop: 10 }]}>Motivo</Text>
                <View style={styles.wrap}>
                  {SUPPORT_REASONS.map((reason) => (
                    <ChoiceChip
                      key={reason}
                      selected={supportReason === reason}
                      style={{ marginTop: 8 }}
                      onPress={() => setSupportReason(reason)}
                    >
                      {reason}
                    </ChoiceChip>
                  ))}
                </View>
                <TextInput
                  style={[styles.input, styles.inputMulti, { marginTop: 10 }]}
                  placeholder="Describe el inconveniente (mínimo 15 caracteres)"
                  value={supportDescription}
                  onChangeText={setSupportDescription}
                  multiline
                />
                <ActionButton onPress={createSupportCase}>
                  Enviar solicitud
                </ActionButton>
              </>
            )}
            <Text style={[styles.title, { marginTop: 16 }]}>
              Mis solicitudes
            </Text>
            {supportCases.length === 0 ? (
              <Text style={styles.muted}>Aún no hay solicitudes registradas.</Text>
            ) : (
              supportCases.map((supportCase) => (
                <View key={supportCase.id} style={styles.box}>
                  <Text style={styles.bold}>
                    {supportCase.id} · {supportCase.orderCode}
                  </Text>
                  <Text style={styles.muted}>
                    {supportCase.reason} · {supportCase.status}
                  </Text>
                  <Text>{supportCase.description}</Text>
                  {supportCase.answer ? (
                    <Text style={styles.muted}>{supportCase.answer}</Text>
                  ) : (
                    <Pressable
                      onPress={() => simulateSupportReply(supportCase.id)}
                    >
                      <Text style={styles.link}>Simular respuesta</Text>
                    </Pressable>
                  )}
                </View>
              ))
            )}
            <Text style={styles.small}>
              Las respuestas son ficticias; no se envían a servicios externos.
            </Text>
          </>
        )}

        {screen === "seller" && (
          <>
            <Text style={styles.title}>Panel de vendedor</Text>
            <Text style={styles.muted}>Registra o edita productos.</Text>
            <View style={styles.box}>
              <Text style={styles.bold}>
                {editingId ? `Editando ${editingId}` : "Nuevo producto"}
              </Text>
              <TextInput
                style={[styles.input, { marginTop: 8 }]}
                placeholder="Nombre del producto"
                value={form.nombre}
                onChangeText={(t) => setForm({ ...form, nombre: t })}
              />
              <Text style={styles.muted}>Categoría</Text>
              <View style={[styles.wrap, { marginTop: 6 }]}>
                {SELLER_CATEGORIES.map((cat) => (
                  <ChoiceChip
                    key={cat}
                    selected={form.categoria === cat}
                    style={{ marginBottom: 6 }}
                    onPress={() => setForm({ ...form, categoria: cat })}
                  >
                    {cat}
                  </ChoiceChip>
                ))}
              </View>
              <TextInput
                style={styles.input}
                placeholder="Precio en COP (entero positivo)"
                keyboardType="numeric"
                value={form.precio}
                editable={!editingProduct || !editingProduct.variantes}
                onChangeText={(t) => setForm({ ...form, precio: t })}
              />
              <TextInput
                style={styles.input}
                placeholder="Stock (entero, 0 o más)"
                keyboardType="numeric"
                value={form.stock}
                editable={!editingProduct || !editingProduct.variantes}
                onChangeText={(t) => setForm({ ...form, stock: t })}
              />
              {editingProduct && editingProduct.variantes && (
                <Text style={styles.small}>
                  Los precios y existencias de este producto se administran por variante.
                </Text>
              )}
              <TextInput
                style={[styles.input, styles.inputMulti]}
                placeholder="Descripción (mínimo 15 caracteres)"
                multiline
                value={form.descripcion}
                onChangeText={(t) => setForm({ ...form, descripcion: t })}
              />
              {formError !== "" && (
                <Text style={styles.danger}>{formError}</Text>
              )}
              <ActionButton onPress={saveProduct}>
                {editingId ? "Guardar cambios" : "Registrar producto"}
              </ActionButton>
              {editingId && (
                <Pressable onPress={resetForm}>
                  <Text style={styles.link}>Cancelar edición</Text>
                </Pressable>
              )}
            </View>

            <Text style={[styles.title, { marginTop: 16 }]}>
              Productos ({products.length})
            </Text>
            {products.map((p) => (
              <View key={p.id} style={styles.sellerRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.bold}>
                    {p.id} · {p.nombre}
                  </Text>
                  <Text style={styles.muted}>
                    {p.categoria} · {cop(p.precio)} · Stock: {p.stock}
                  </Text>
                </View>
                <Pressable onPress={() => startEdit(p)}>
                  <Text style={styles.link}>Editar</Text>
                </Pressable>
                {p.variantes ? (
                  p.variantes.map(
                    (variant) =>
                      variant.stock === 0 && (
                        <Pressable
                          key={variant.id}
                          style={styles.restockButton}
                          onPress={() => simulateRestock(p, variant.id)}
                        >
                          <Text style={styles.chipText}>
                            Reponer {variant.nombre}
                          </Text>
                        </Pressable>
                      ),
                  )
                ) : p.stock === 0 ? (
                  <Pressable
                    style={styles.restockButton}
                    onPress={() => simulateRestock(p)}
                  >
                    <Text style={styles.chipText}>Simular reposición</Text>
                  </Pressable>
                ) : null}
              </View>
            ))}
            <Pressable onPress={resetAll}>
              <Text
                style={[styles.danger, { textAlign: "center", marginTop: 20 }]}
              >
                Restablecer datos
              </Text>
            </Pressable>
          </>
        )}

        {screen === "order" && selectedOrder && (
          <>
            <Text style={styles.title}>Pedido {selectedOrder.code}</Text>
            <Text style={styles.muted}>Fecha: {selectedOrder.date}</Text>
            <Text style={styles.statusHeading}>
              Estado actual: {selectedOrder.status}
            </Text>
            <View style={styles.box}>
              <Text style={styles.bold}>Seguimiento cronológico</Text>
              {(selectedOrder.timeline || []).map((event, index) => (
                <Text key={`${event.status}-${index}`} style={styles.muted}>
                  {event.date} · {event.status}
                </Text>
              ))}
            </View>
            {["Confirmado", "Preparando", "En camino"].includes(
              selectedOrder.status,
            ) ? (
              <ActionButton onPress={() => advanceOrder(selectedOrder)}>
                {selectedOrder.status === "En camino"
                  ? "Simular entrega"
                  : "Simular avance de entrega"}
              </ActionButton>
            ) : (
              <Text style={styles.muted}>
                El seguimiento terminó; no se permiten más avances.
              </Text>
            )}
            {["Confirmado", "Preparando"].includes(selectedOrder.status) &&
              (cancelPrompt ? (
                <View style={styles.box}>
                  <Text style={styles.bold}>
                    ¿Confirmas la cancelación del pedido?
                  </Text>
                  <View style={styles.row}>
                    <ActionButton
                      small
                      onPress={() => cancelOrder(selectedOrder)}
                    >
                      Sí, cancelar
                    </ActionButton>
                    <ActionButton
                      small
                      onPress={() => setCancelPrompt(false)}
                    >
                      Conservar pedido
                    </ActionButton>
                  </View>
                </View>
              ) : (
                <ActionButton onPress={() => setCancelPrompt(true)}>
                  Solicitar cancelación
                </ActionButton>
              ))}
            {["En camino", "Entregado"].includes(selectedOrder.status) && (
              <Text style={styles.muted}>
                No se puede cancelar: el pedido ya inició su despacho.
              </Text>
            )}
            {selectedOrder.status === "Cancelado" && (
              <Text style={styles.muted}>
                Pedido cancelado; el inventario fue reintegrado.
              </Text>
            )}
            <OrderSummary {...selectedOrder} />
            <ActionButton
              onPress={() => {
                setSupportOrderId(selectedOrder.code);
                setScreen("help");
              }}
            >
              Solicitar ayuda con este pedido
            </ActionButton>
            <Pressable onPress={() => setScreen("history")}>
              <Text style={styles.link}>Volver al historial</Text>
            </Pressable>
          </>
        )}
      </ScrollView>

      <ScrollView
        horizontal
        style={styles.nav}
        contentContainerStyle={styles.navContent}
        showsHorizontalScrollIndicator={false}
      >
        {TABS.map(([key, label]) => (
          <Pressable
            key={key}
            style={styles.tab}
            onPress={() => setScreen(key)}
          >
            <Text style={[styles.navText, screen === key && styles.navActive]}>
              {key === "cart" && cartCount > 0
                ? `${label} (${cartCount})`
                : key === "compare" && comparison.length > 0
                  ? `${label} (${comparison.length})`
                  : key === "notifications" &&
                      notifications.some((item) => !item.read)
                    ? `${label} (${notifications.filter((item) => !item.read).length})`
                    : label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const PRIMARY = "#176b5b";
const ACCENT = "#258a71";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f8f6", paddingTop: 35 },
  header: {
    alignItems: "center",
    backgroundColor: PRIMARY,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 18,
  },
  brand: { color: "#fff", fontSize: 20, fontWeight: "700", letterSpacing: 1 },
  slogan: { color: "#dcebe6", fontSize: 12, marginTop: 3 },
  logo: {
    alignItems: "center",
    backgroundColor: ACCENT,
    borderRadius: 20,
    color: "#fff",
    fontWeight: "700",
    height: 40,
    lineHeight: 40,
    textAlign: "center",
    width: 40,
  },
  toast: {
    backgroundColor: "#20312c",
    color: "#fff",
    fontSize: 13,
    padding: 10,
    textAlign: "center",
  },
  body: { flex: 1, padding: 16 },
  input: {
    backgroundColor: "#fff",
    borderColor: "#dce6e0",
    borderRadius: 11,
    borderWidth: 1,
    height: 44,
    marginBottom: 10,
    paddingHorizontal: 12,
  },
  chip: {
    backgroundColor: "#edf2ef",
    borderRadius: 20,
    marginRight: 8,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },
  chipActive: { backgroundColor: PRIMARY },
  chipText: { color: "#35443e", fontSize: 13 },
  chipSelectedText: { color: "#fff", fontSize: 13, fontWeight: "600" },
  row: { alignItems: "center", flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 10 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  card: {
    backgroundColor: "#fff",
    borderColor: "#e6ede8",
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
    padding: 12,
    width: "48%",
  },
  compareSelected: { backgroundColor: PRIMARY },
  compareAction: { width: "100%" },
  cardImg: {
    alignItems: "flex-start",
    backgroundColor: "#edf5f1",
    flexDirection: "row",
    height: 75,
    marginBottom: 8,
    padding: 8,
    justifyContent: "space-between",
    borderRadius: 10,
  },
  bigImg: {
    alignItems: "center",
    backgroundColor: "#edf5f1",
    borderRadius: 14,
    height: 140,
    justifyContent: "center",
    marginBottom: 12,
  },
  star: { color: "#d4931a", fontSize: 20 },
  title: { color: "#1d2b25", fontSize: 18, fontWeight: "700", marginBottom: 6 },
  bold: { color: "#1d2b25", fontWeight: "700" },
  price: { color: PRIMARY, fontWeight: "700" },
  muted: { color: "#65736d", fontSize: 13 },
  small: { color: "#52615a", fontSize: 11 },
  green: { color: "#2d7957", fontSize: 12, marginTop: 3 },
  red: { color: "#b54753", fontSize: 12, fontWeight: "700", marginTop: 3 },
  danger: { color: "#b54753", fontSize: 13 },
  link: { color: PRIMARY, fontWeight: "600", marginTop: 8, textAlign: "center" },
  note: { color: "#2d7957", marginTop: 6, textAlign: "center" },
  empty: { alignItems: "center", marginTop: 28, padding: 16 },
  btn: {
    alignItems: "center",
    backgroundColor: ACCENT,
    borderRadius: 11,
    justifyContent: "center",
    marginTop: 10,
    minHeight: 46,
    paddingHorizontal: 14,
  },
  btnOff: { backgroundColor: "#a9b5af" },
  buttonText: { color: "#fff", fontWeight: "700", textAlign: "center" },
  white: { color: "#fff", fontWeight: "700" },
  itemRow: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#e6ede8",
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
    padding: 12,
  },
  sellerRow: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#e6ede8",
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    padding: 12,
  },
  restockButton: { backgroundColor: "#edf2ef", borderRadius: 9, margin: 4, padding: 8 },
  qtyBtn: {
    alignItems: "center",
    backgroundColor: "#edf2ef",
    borderRadius: 8,
    height: 32,
    justifyContent: "center",
    width: 32,
  },
  qty: { fontWeight: "700", marginHorizontal: 10 },
  box: {
    backgroundColor: "#fff",
    borderColor: "#e6ede8",
    borderRadius: 13,
    borderWidth: 1,
    marginTop: 12,
    padding: 14,
  },
  addressCard: {
    backgroundColor: "#fff",
    borderColor: "#e0e8e3",
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
    padding: 13,
  },
  addressSelected: { borderColor: PRIMARY, borderWidth: 2 },
  question: {
    borderTopColor: "#e3ebe6",
    borderTopWidth: 1,
    marginTop: 10,
    paddingTop: 10,
  },
  compareRow: { flexDirection: "row", alignItems: "stretch" },
  compareCard: {
    backgroundColor: "#fff",
    borderColor: "#e6ede8",
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 10,
    padding: 14,
    width: 190,
  },
  unreadNotification: { borderLeftColor: ACCENT, borderLeftWidth: 4 },
  statusHeading: { color: PRIMARY, fontSize: 16, fontWeight: "700", marginTop: 8 },
  nav: {
    backgroundColor: "#fff",
    borderColor: "#e0e8e3",
    borderTopWidth: 1,
    flexGrow: 0,
    flexShrink: 0,
    height: 50,
  },
  navContent: { alignItems: "center", flexDirection: "row" },
  tab: {
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    paddingHorizontal: 14,
  },
  navText: { color: "#65736d", fontSize: 12, fontWeight: "600" },
  navActive: { color: PRIMARY },
  discount: { color: "#2d7957", fontWeight: "600" },
  starBig: { color: "#d4931a", fontSize: 30, marginRight: 6 },
  btnSmall: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: ACCENT,
    borderRadius: 10,
    minHeight: 40,
    paddingHorizontal: 14,
  },
  wrap: { flexDirection: "row", flexWrap: "wrap" },
  inputMulti: { height: 76, paddingTop: 10, textAlignVertical: "top" },
});
