import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  ScrollView,
  Pressable,
  Alert,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import logo from "./assets/Logo_WindRose.png";
import hero from "./assets/Hero_WindRose.png";

const PRODUCT_IMAGES = {
  "PROD-001": require("./assets/imagen_consola.jpg"),
  "PROD-002": require("./assets/imagen_auricular.jpg"),
  "PROD-003": require("./assets/imagen_tapetes.jpg"),
  "PROD-004": require("./assets/imagen_nevera.png"),
  "PROD-005": require("./assets/imagen_aspiradora.jpg"),
  "PROD-006": require("./assets/imagen_fundasasiento.jpg"),
  "PROD-007": require("./assets/imagen_smartwatch.jpg"),
  "PROD-008": require("./assets/imagen_licuadora.jpg"),
  "PROD-009": require("./assets/imagen_monitorfre.jpg"),
  "PROD-010": require("./assets/imagen_lavadora.jpg"),
  "PROD-011": require("./assets/imagen_mancuernas.jpg"),
  "PROD-012": require("./assets/imagen_bandaselasticas.jpg"),
};

const INITIAL_PRODUCTS = [
  {
    id: "PROD-001",
    nombre: "Consola de videojuegos",
    marca: "GameMax",
    categoria: "Tecnología",
    precio: 85000,
    stock: 5,
    descripcion: "Color negro de alto rendimiento, ideal para videojuegos.",
    variantes: [
      { id: "PROD-001-N", nombre: "Negro", precio: 85000, stock: 5 },
      { id: "PROD-001-B", nombre: "Blanco", precio: 90000, stock: 3 },
    ],
  },
  {
    id: "PROD-002",
    nombre: "Auriculares Inalámbricos",
    marca: "SoundPro",
    categoria: "Tecnología",
    precio: 45000,
    stock: 10,
    descripcion: "Sonido estéreo de alta fidelidad con cancelación de ruido.",
    variantes: [
      { id: "PROD-002-N", nombre: "Negro", precio: 45000, stock: 10 },
      { id: "PROD-002-A", nombre: "Azul", precio: 47000, stock: 0 },
    ],
  },
  {
    id: "PROD-003",
    nombre: "Tapetes para carro",
    marca: "AutoClean",
    categoria: "Automotriz",
    precio: 114000,
    stock: 36,
    descripcion:
      "Tapetes de goma de alta resistencia para el piso del vehículo.",
  },
  {
    id: "PROD-004",
    nombre: "Nevera manija integrada",
    marca: "ColdHouse",
    categoria: "Hogar",
    precio: 1800000,
    stock: 42,
    descripcion: "Nevera moderna con dispensador de agua y bajo consumo.",
  },
  {
    id: "PROD-005",
    nombre: "Aspiradora de succión",
    marca: "CleanMax",
    categoria: "Automotriz",
    precio: 215000,
    stock: 53,
    descripcion: "Aspiradora portátil con cable y succión ciclónica potente.",
  },
  {
    id: "PROD-006",
    nombre: "Set de fundas para asientos",
    marca: "AutoClean",
    categoria: "Automotriz",
    precio: 230000,
    stock: 24,
    descripcion: "Set completo de fundas protectoras para asientos de auto.",
  },
  {
    id: "PROD-007",
    nombre: "SmartWatch",
    marca: "FitTech",
    categoria: "Tecnología",
    precio: 600000,
    stock: 40,
    descripcion:
      "Reloj inteligente multifunción con notificaciones y sensores.",
    variantes: [
      { id: "PROD-007-P", nombre: "Negro 40 mm", precio: 600000, stock: 40 },
      { id: "PROD-007-G", nombre: "Negro 44 mm", precio: 650000, stock: 8 },
      { id: "PROD-007-R", nombre: "Correa roja", precio: 620000, stock: 0 },
    ],
  },
  {
    id: "PROD-008",
    nombre: "Licuadora",
    marca: "VitaBlend",
    categoria: "Hogar",
    precio: 500000,
    stock: 63,
    descripcion: "Licuadora profesional con ajuste de velocidad variable.",
  },
  {
    id: "PROD-009",
    nombre: "Monitor de frecuencia cardíaca",
    marca: "FitTech",
    categoria: "Deportes",
    precio: 720000,
    stock: 18,
    descripcion:
      "Monitor deportivo que brinda datos exactos de pulso cardíaco.",
  },
  {
    id: "PROD-010",
    nombre: "Lavadora",
    marca: "ColdHouse",
    categoria: "Hogar",
    precio: 800000,
    stock: 27,
    descripcion: "Lavadora digital de gran capacidad y ahorro energético.",
  },
  {
    id: "PROD-011",
    nombre: "Kit de mancuernas",
    marca: "ForceSport",
    categoria: "Deportes",
    precio: 300000,
    stock: 55,
    descripcion: "Mancuernas ajustables con discos de hierro resistentes.",
  },
  {
    id: "PROD-012",
    nombre: "Bandas elásticas",
    marca: "ForceSport",
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
  ["home", "Inicio", "⌂"],
  ["favorites", "Favoritos", "♡"],
  ["compare", "Comparar", "⇄"],
  ["cart", "Carrito", "🛒"],
  ["history", "Pedidos", "▤"],
  ["more", "Más", "☰"],
];
const SHIPPING_TARIFFS = {
  Mosquera: { standard: 6000, express: 10000, days: "1 a 2 días" },
  Funza: { standard: 8000, express: 12000, days: "1 a 2 días" },
  Madrid: { standard: 10000, express: 14000, days: "2 a 3 días" },
};
const STORAGE_KEY = "@windrose_session";

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
  const [isHydrated, setIsHydrated] = useState(false);
  const [back, setBack] = useState("home");
  const [selectedId, setSelectedId] = useState(null);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const [sort, setSort] = useState("none");
  const [brandFilter, setBrandFilter] = useState("Todas");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [comparison, setComparison] = useState([]);
  const [buyer, setBuyer] = useState({
    name: "",
    phone: "",
    city: "",
    address: "",
  });
  const [questions, setQuestions] = useState({});
  const [questionText, setQuestionText] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [addressForm, setAddressForm] = useState({
    alias: "",
    municipality: "Mosquera",
    reference: "",
  });
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [shippingMode, setShippingMode] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [helpCases, setHelpCases] = useState([]);
  const [helpOrder, setHelpOrder] = useState("");
  const [helpReason, setHelpReason] = useState("Entrega");
  const [helpText, setHelpText] = useState("");
  const [couponInput, setCouponInput] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [ratings, setRatings] = useState({});
  const [ratingDraft, setRatingDraft] = useState(5);
  const [sellerForm, setSellerForm] = useState({
    nombre: "",
    marca: "",
    categoria: "Tecnología",
    precio: "",
    stock: "",
    descripcion: "",
  });
  const [editingProductId, setEditingProductId] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!active) return;
        if (!raw) {
          setIsHydrated(true);
          return;
        }
        try {
          const saved = JSON.parse(raw);
          if (Array.isArray(saved.products)) setProducts(saved.products);
          if (Array.isArray(saved.favorites)) setFavorites(saved.favorites);
          if (Array.isArray(saved.cart)) setCart(saved.cart);
          if (Array.isArray(saved.orders)) setOrders(saved.orders);
          if (Array.isArray(saved.addresses)) setAddresses(saved.addresses);
          if (Array.isArray(saved.notifications))
            setNotifications(saved.notifications);
          if (Array.isArray(saved.subscriptions))
            setSubscriptions(saved.subscriptions);
          if (Array.isArray(saved.helpCases)) setHelpCases(saved.helpCases);
          if (saved.ratings && typeof saved.ratings === "object")
            setRatings(saved.ratings);
        } catch {
          notify("No se pudo recuperar la sesión local");
        } finally {
          setIsHydrated(true);
        }
      })
      .catch(() => {
        notify("No se pudo recuperar la sesión local");
        setIsHydrated(true);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        products,
        favorites,
        cart,
        orders,
        addresses,
        notifications,
        subscriptions,
        helpCases,
        ratings,
      }),
    ).catch(() => {});
  }, [
    isHydrated,
    products,
    favorites,
    cart,
    orders,
    addresses,
    notifications,
    subscriptions,
    helpCases,
    ratings,
  ]);

  const productStock = (p) =>
    p.variantes ? p.variantes.reduce((sum, v) => sum + v.stock, 0) : p.stock;
  const invalidPriceRange =
    minPrice !== "" && maxPrice !== "" && Number(minPrice) > Number(maxPrice);
  const brands = [
    "Todas",
    ...new Set(products.map((p) => p.marca).filter(Boolean)),
  ];
  const filtered = products
    .filter(
      (p) =>
        p.nombre.toLowerCase().includes(search.trim().toLowerCase()) &&
        (category === "Todas" || p.categoria === category) &&
        (brandFilter === "Todas" || p.marca === brandFilter) &&
        (!availableOnly || productStock(p) > 0) &&
        !invalidPriceRange &&
        (minPrice === "" || p.precio >= Number(minPrice)) &&
        (maxPrice === "" || p.precio <= Number(maxPrice)),
    )
    .sort((a, b) =>
      sort === "asc"
        ? a.precio - b.precio
        : sort === "desc"
          ? b.precio - a.precio
          : 0,
    );
  const cartItems = cart.map((i) => {
    const product = products.find((p) => p.id === i.productId);
    const variant = i.variantId
      ? product?.variantes?.find((v) => v.id === i.variantId)
      : null;
    return {
      ...product,
      cartId: i.cartId,
      productId: i.productId,
      variantId: i.variantId,
      nombre: variant
        ? `${product.nombre} - ${variant.nombre}`
        : product?.nombre,
      precio: variant?.precio ?? product?.precio,
      stock: variant?.stock ?? product?.stock,
      qty: i.qty,
    };
  });
  const subtotal = cartItems.reduce((sum, i) => sum + i.precio * i.qty, 0);
  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);
  const shipping =
    selectedAddress &&
    shippingMode &&
    SHIPPING_TARIFFS[selectedAddress.municipality]?.[shippingMode]
      ? SHIPPING_TARIFFS[selectedAddress.municipality][shippingMode]
      : 0;
  const discount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const total = Math.max(0, subtotal - discount + shipping);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);
  const unreadCount = notifications.filter((item) => !item.read).length;
  const current = products.find((p) => p.id === selectedId);

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const openDetail = (id) => {
    setSelectedId(id);
    setSelectedVariantId(null);
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

  const toggleCompare = (id) => {
    if (comparison.includes(id)) {
      setComparison(comparison.filter((value) => value !== id));
      notify("Producto retirado del comparador");
    } else if (comparison.length >= 3) {
      notify("El comparador permite máximo 3 productos");
    } else {
      setComparison([...comparison, id]);
      notify("Producto agregado al comparador");
    }
  };

  const resetCatalogFilters = () => {
    setSearch("");
    setCategory("Todas");
    setBrandFilter("Todas");
    setAvailableOnly(false);
    setMinPrice("");
    setMaxPrice("");
    setSort("none");
  };

  const addToCart = (prod) => {
    const variant = prod.variantes?.find((v) => v.id === selectedVariantId);
    if (prod.variantes && !variant) return notify("Selecciona una variante");
    if (variant && variant.stock <= 0)
      return notify("Esta variante está agotada");
    if (!prod.variantes && prod.stock <= 0) return notify("Producto agotado");
    const cartId = variant?.id ?? prod.id;
    const stock = variant?.stock ?? prod.stock;
    const item = cart.find((i) => i.cartId === cartId);
    if (item && item.qty >= stock)
      return notify(`Stock máximo alcanzado (${stock})`);
    setCart(
      item
        ? cart.map((i) => (i.cartId === cartId ? { ...i, qty: i.qty + 1 } : i))
        : [
            ...cart,
            {
              cartId,
              productId: prod.id,
              variantId: variant?.id ?? null,
              qty: 1,
            },
          ],
    );
    notify("Agregado al carrito");
  };

  const removeFromCart = (cartId) => {
    setCart(cart.filter((i) => i.cartId !== cartId));
    notify("Producto eliminado del carrito");
  };

  const changeQty = (item, delta) => {
    const next = item.qty + delta;
    if (next <= 0) return removeFromCart(item.cartId);
    if (next > item.stock) return notify(`Stock límite: ${item.stock}`);
    setCart(
      cart.map((i) => (i.cartId === item.cartId ? { ...i, qty: next } : i)),
    );
  };

  const applyCoupon = () => {
    if (!cart.length)
      return notify("Agrega productos antes de aplicar un cupón");
    if (couponInput.trim().toUpperCase() !== "BIENVENIDO10") {
      setCouponApplied(false);
      return notify("Cupón no válido. Verifica el código");
    }
    setCouponApplied(true);
    notify("Cupón BIENVENIDO10 aplicado: 10% de descuento");
  };

  const saveRating = () => {
    if (
      !selectedId ||
      !Number.isInteger(ratingDraft) ||
      ratingDraft < 1 ||
      ratingDraft > 5
    ) {
      return notify("La valoración debe ser un número entero entre 1 y 5");
    }
    setRatings((previous) => ({
      ...previous,
      [selectedId]: [...(previous[selectedId] || []), ratingDraft],
    }));
    notify("Valoración de demostración guardada");
  };

  const saveSellerProduct = () => {
    const price = Number(sellerForm.precio);
    const stock = Number(sellerForm.stock);
    if (
      !sellerForm.nombre.trim() ||
      !sellerForm.marca.trim() ||
      !sellerForm.descripcion.trim()
    ) {
      return notify("Completa nombre, marca y descripción");
    }
    if (
      !Number.isFinite(price) ||
      price <= 0 ||
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      return notify(
        "El precio debe ser positivo y el stock un entero no negativo",
      );
    }
    if (editingProductId) {
      setProducts((previous) =>
        previous.map((item) =>
          item.id === editingProductId
            ? { ...item, ...sellerForm, precio: price, stock }
            : item,
        ),
      );
      notify("Producto actualizado");
    } else {
      const product = {
        id: `PROD-${Date.now()}`,
        ...sellerForm,
        precio: price,
        stock,
      };
      setProducts((previous) => [product, ...previous]);
      notify("Producto creado en el catálogo");
    }
    setEditingProductId(null);
    setSellerForm({
      nombre: "",
      marca: "",
      categoria: "Tecnología",
      precio: "",
      stock: "",
      descripcion: "",
    });
  };

  const markNotificationRead = (id) => {
    setNotifications((previous) =>
      previous.map((item) => (item.id === id ? { ...item, read: true } : item)),
    );
  };

  const simulateHelpReply = (code) => {
    setHelpCases((previous) =>
      previous.map((item) =>
        item.code === code
          ? {
              ...item,
              status: "Respondido",
              answer:
                "Respuesta de prueba: recibimos tu solicitud y estamos revisando el caso.",
            }
          : item,
      ),
    );
    notify("Respuesta agregada al caso");
  };

  const saveAddress = () => {
    if (!addressForm.alias.trim() || !addressForm.reference.trim()) {
      return notify("Completa el alias y la referencia de entrega");
    }
    if (editingAddressId) {
      setAddresses(
        addresses.map((address) =>
          address.id === editingAddressId
            ? { ...address, ...addressForm }
            : address,
        ),
      );
      setEditingAddressId(null);
      notify("Dirección actualizada");
    } else {
      const id = `ADDR-${Date.now()}`;
      setAddresses((previous) => [
        ...previous,
        {
          id,
          ...addressForm,
          primary: previous.length === 0,
        },
      ]);
      if (addresses.length === 0) setSelectedAddressId(id);
      notify("Dirección registrada");
    }
    setAddressForm({
      alias: "",
      municipality: "Mosquera",
      reference: "",
    });
  };

  const setPrimaryAddress = (id) => {
    setAddresses(
      addresses.map((address) => ({
        ...address,
        primary: address.id === id,
      })),
    );
    setSelectedAddressId(id);
    notify("Dirección principal actualizada");
  };

  const goToReview = () => {
    if (!selectedAddressId) return notify("Selecciona una dirección");
    if (!shippingMode) return notify("Selecciona una modalidad de envío");
    if (!buyer.name.trim())
      return notify("Ingresa un nombre para el pedido");
    if (!buyer.phone.trim())
      return notify("Ingresa un teléfono para el pedido");
    setScreen("review");
  };

  const confirmPurchase = () => {
    if (cart.length === 0) return notify("El carrito está vacío");
    if (!selectedAddressId || !shippingMode)
      return notify("Completa dirección y modalidad de envío");
    const noStock = cartItems.find((i) => i.qty > i.stock);
    if (noStock) return notify(`Stock insuficiente de ${noStock.nombre}`);

    setProducts(
      products.map((p) => {
        const bought = cart.filter((i) => i.productId === p.id);
        if (!bought.length) return p;
        if (p.variantes) {
          const variantes = p.variantes.map((v) => {
            const line = bought.find((i) => i.variantId === v.id);
            return line ? { ...v, stock: Math.max(0, v.stock - line.qty) } : v;
          });
          return {
            ...p,
            variantes,
            stock: variantes.reduce((sum, v) => sum + v.stock, 0),
          };
        }
        const qty = bought.reduce((sum, i) => sum + i.qty, 0);
        return { ...p, stock: Math.max(0, p.stock - qty) };
      }),
    );
    const order = {
      code: `WIND-${String(orders.length + 1).padStart(4, "0")}`,
      date: new Date().toLocaleString(),
      buyer: {
        name: buyer.name.trim(),
        phone: buyer.phone.trim(),
        city: selectedAddress.municipality,
        address: selectedAddress.reference,
      },
      address: selectedAddress,
      shippingMode,
      items: cartItems.map(
        ({ cartId, productId, variantId, nombre, precio, qty }) => ({
          id: cartId,
          productId,
          variantId,
          nombre,
          precio,
          qty,
        }),
      ),
      subtotal,
      discount,
      shipping,
      total,
      status: "Confirmado",
      history: [
        {
          status: "Confirmado",
          date: new Date().toLocaleString(),
          detail: "Pedido confirmado",
        },
      ],
    };
    setOrders([order, ...orders]);
    setCart([]);
    setCouponApplied(false);
    setCouponInput("");
    setSelectedOrder(order);
    setScreen("order");
    addNotification(
      `order-${order.code}-Confirmado`,
      `Pedido ${order.code}: Confirmado`,
    );
    notify(`Pedido ${order.code} confirmado · sin cobro real`);
  };

  const addNotification = (eventId, message) => {
    setNotifications((previous) =>
      previous.some((notification) => notification.eventId === eventId)
        ? previous
        : [
            {
              id: `NOT-${Date.now()}-${previous.length + 1}`,
              eventId,
              message,
              date: new Date().toLocaleString(),
              read: false,
            },
            ...previous,
          ],
    );
  };

  const advanceOrder = (code) => {
    setOrders((previous) =>
      previous.map((order) => {
        if (order.code !== code) return order;
        if (order.status === "Entregado" || order.status === "Cancelado")
          return order;
        const states = ["Confirmado", "Preparando", "En camino", "Entregado"];
        const next = states[states.indexOf(order.status) + 1];
        if (!next) return order;
        const updated = {
          ...order,
          status: next,
          history: [
            ...order.history,
            {
              status: next,
              date: new Date().toLocaleString(),
              detail: `Avance a ${next}`,
            },
          ],
        };
        setSelectedOrder(updated);
        addNotification(`order-${code}-${next}`, `Pedido ${code}: ${next}`);
        notify(`Pedido avanzado a ${next}`);
        return updated;
      }),
    );
  };

  const cancelOrder = (code) => {
    const order = orders.find((item) => item.code === code);
    if (!order) return;
    if (["En camino", "Entregado"].includes(order.status)) {
      return notify("No se puede cancelar: el pedido ya fue despachado");
    }
    if (order.status === "Cancelado") {
      return notify("El pedido ya está cancelado");
    }
    const confirmCancellation = () => {
      const cancellationEvent = {
        status: "Cancelado",
        date: new Date().toLocaleString(),
        detail: "Compra cancelada y stock restituido",
      };
      setOrders((previous) =>
        previous.map((item) =>
          item.code !== code
            ? item
            : {
                ...item,
                status: "Cancelado",
                history: [...item.history, cancellationEvent],
              },
        ),
      );
      setProducts((previous) =>
        previous.map((product) => {
          const lines = order.items.filter(
            (item) => item.productId === product.id,
          );
          if (!lines.length) return product;
          if (product.variantes) {
            const variantes = product.variantes.map((variant) => {
              const line = lines.find(
                (item) => item.variantId === variant.id,
              );
              return line
                ? { ...variant, stock: variant.stock + line.qty }
                : variant;
            });
            return {
              ...product,
              variantes,
              stock: variantes.reduce((sum, variant) => sum + variant.stock, 0),
            };
          }
          return {
            ...product,
            stock:
              product.stock + lines.reduce((sum, item) => sum + item.qty, 0),
          };
        }),
      );
      setSelectedOrder((previous) =>
        previous && previous.code === code
          ? {
              ...previous,
              status: "Cancelado",
              history: [...previous.history, cancellationEvent],
            }
          : previous,
      );
      addNotification(`order-${code}-Cancelado`, `Pedido ${code}: Cancelado`);
      notify("Compra cancelada e inventario restituido");
    };

    const confirmationMessage =
      "¿Confirmas la cancelación y el reintegro de stock?";
    if (Platform.OS === "web") {
      if (window.confirm(confirmationMessage)) confirmCancellation();
      return;
    }

    Alert.alert("Cancelar compra", confirmationMessage, [
      { text: "No" },
      { text: "Sí, cancelar", onPress: confirmCancellation },
    ]);
  };

  const sendQuestion = () => {
    if (!selectedId) return;
    if (questionText.trim().length < 10) {
      return notify("La pregunta debe tener al menos 10 caracteres");
    }
    const question = {
      id: `Q-${Date.now()}`,
      text: questionText.trim(),
      date: new Date().toLocaleString(),
      status: "Pendiente",
      answer: "",
    };
    setQuestions((previous) => ({
      ...previous,
      [selectedId]: [question, ...(previous[selectedId] || [])],
    }));
    setQuestionText("");
    notify("Pregunta enviada");
  };

  const demoAnswer = (productId, questionId) => {
    setQuestions((previous) => ({
      ...previous,
      [productId]: previous[productId].map((question) =>
        question.id === questionId
          ? {
              ...question,
              status: "Respondido",
              answer: "Respuesta agregada",
            }
          : question,
      ),
    }));
  };

  const toggleSubscription = (productId, variantId) => {
    const key = variantId || productId;
    const existing = subscriptions.find((item) => item.key === key);
    if (existing?.active) {
      setSubscriptions(
        subscriptions.map((item) =>
          item.key === key ? { ...item, active: false } : item,
        ),
      );
      notify("Suscripción cancelada");
    } else if (existing) {
      setSubscriptions(
        subscriptions.map((item) =>
          item.key === key ? { ...item, active: true } : item,
        ),
      );
      notify("Suscripción activada nuevamente");
    } else {
      setSubscriptions([
        ...subscriptions,
        { key, productId, variantId, active: true },
      ]);
      notify("Suscripción registrada");
    }
  };

  const restockDemo = () => {
    let changed = false;
    setProducts((previous) =>
      previous.map((product) => {
        if (!product.variantes) {
          const subscribed = subscriptions.find(
            (item) => item.active && item.key === product.id,
          );
          if (subscribed && product.stock === 0) {
            changed = true;
            addNotification(
              `restock-${product.id}-${Date.now()}`,
              `Reposición: ${product.nombre}`,
            );
            return { ...product, stock: 5 };
          }
          return product;
        }
        return {
          ...product,
          variantes: product.variantes.map((variant) => {
            const subscribed = subscriptions.find(
              (item) => item.active && item.key === variant.id,
            );
            if (subscribed && variant.stock === 0) {
              changed = true;
              addNotification(
                `restock-${variant.id}-${Date.now()}`,
                `Reposición: ${product.nombre} - ${variant.nombre}`,
              );
              return { ...variant, stock: 5 };
            }
            return variant;
          }),
        };
      }),
    );
    notify(
      changed
        ? "Reposición completada"
        : "No hay suscripciones pendientes",
    );
  };

  const createHelpCase = () => {
    if (!helpOrder) return notify("Selecciona un pedido");
    if (helpText.trim().length < 15)
      return notify("La descripción debe tener al menos 15 caracteres");
    const code = `CAS-${String(helpCases.length + 1).padStart(5, "0")}`;
    setHelpCases([
      {
        code,
        order: helpOrder,
        reason: helpReason,
        text: helpText.trim(),
        status: "Abierto",
        date: new Date().toLocaleString(),
        answer: "",
      },
      ...helpCases,
    ]);
    setHelpText("");
    notify(`Caso ${code} creado`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={logo}
          style={styles.logoImage}
          resizeMode="contain"
          accessibilityLabel="Logo de WindRose"
        />
      </View>

      {toast !== "" && <Text style={styles.toast}>{toast}</Text>}

      <ScrollView
        key={screen}
        style={styles.body}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {screen === "home" && (
          <>
            <View style={styles.hero}>
              <Image
                source={hero}
                style={styles.heroImage}
                resizeMode="contain"
                accessibilityLabel="WindRose: Conectamos cada emprendimiento"
              />
            </View>
            <Text style={styles.sectionTitle}>Explora nuestro catálogo</Text>
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
            <View style={[styles.row, { flexWrap: "wrap" }]}>
              <Text style={[styles.muted, { marginRight: 8 }]}>Marca:</Text>
              {brands.map((brandName) => (
                <Pressable
                  key={brandName}
                  style={[
                    styles.chip,
                    brandFilter === brandName && styles.chipActive,
                  ]}
                  onPress={() => setBrandFilter(brandName)}
                >
                  <Text
                    style={
                      brandFilter === brandName ? styles.white : styles.chipText
                    }
                  >
                    {brandName}
                  </Text>
                </Pressable>
              ))}
            </View>
            <View style={styles.row}>
              <TextInput
                style={[styles.input, { flex: 1, marginRight: 5 }]}
                placeholder="Precio mínimo"
                keyboardType="numeric"
                value={minPrice}
                onChangeText={setMinPrice}
              />
              <TextInput
                style={[styles.input, { flex: 1, marginLeft: 5 }]}
                placeholder="Precio máximo"
                keyboardType="numeric"
                value={maxPrice}
                onChangeText={setMaxPrice}
              />
            </View>
            {invalidPriceRange && (
              <Text style={styles.red}>
                El precio mínimo no puede ser mayor que el máximo.
              </Text>
            )}
            <View style={[styles.row, { flexWrap: "wrap" }]}>
              <Pressable
                style={[styles.chip, availableOnly && styles.chipActive]}
                onPress={() => setAvailableOnly(!availableOnly)}
              >
                <Text style={availableOnly ? styles.white : styles.chipText}>
                  Solo disponibles
                </Text>
              </Pressable>
              <Pressable style={styles.chip} onPress={resetCatalogFilters}>
                <Text style={styles.chipText}>Restablecer</Text>
              </Pressable>
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
                      {PRODUCT_IMAGES[p.id] ? (
                        <Image
                          source={PRODUCT_IMAGES[p.id]}
                          style={styles.cardProductImage}
                          resizeMode="cover"
                          accessibilityLabel={p.nombre}
                        />
                      ) : null}
                      <View style={styles.cardImageOverlay}>
                        <Text style={styles.imageCategoryLabel}>
                          {p.categoria}
                        </Text>
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
                    </View>
                    <Text numberOfLines={1} style={styles.bold}>
                      {p.nombre}
                    </Text>
                    <Text style={styles.price}>{cop(p.precio)}</Text>
                    <Text style={p.stock > 0 ? styles.green : styles.red}>
                      {productStock(p) > 0
                        ? `Stock: ${productStock(p)}`
                        : "Agotado"}
                    </Text>
                    <Pressable
                      style={[
                        styles.compareChip,
                        comparison.includes(p.id) && styles.chipActive,
                      ]}
                      onPress={(event) => {
                        event.stopPropagation();
                        toggleCompare(p.id);
                      }}
                    >
                      <Text
                        style={
                          comparison.includes(p.id)
                            ? styles.white
                            : styles.chipText
                        }
                      >
                        {comparison.includes(p.id) ? "Comparado" : "Comparar"}
                      </Text>
                    </Pressable>
                  </Pressable>
                ))}
              </View>
            )}
          </>
        )}

        {screen === "detail" && current && (
          <>
            <View style={styles.bigImg}>
              {PRODUCT_IMAGES[current.id] ? (
                <Image
                  source={PRODUCT_IMAGES[current.id]}
                  style={styles.detailProductImage}
                  resizeMode="cover"
                  accessibilityLabel={current.nombre}
                />
              ) : null}
              <Text
                style={[
                  styles.imageCategoryLabel,
                  styles.detailImageCategory,
                ]}
              >
                {current.categoria}
              </Text>
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
            {current.variantes ? (
              <>
                <Text style={styles.bold}>Selecciona una variante</Text>
                {current.variantes.map((variant) => (
                  <Pressable
                    key={variant.id}
                    disabled={variant.stock === 0}
                    style={[
                      styles.variant,
                      selectedVariantId === variant.id && styles.variantActive,
                      variant.stock === 0 && styles.btnOff,
                    ]}
                    onPress={() => setSelectedVariantId(variant.id)}
                  >
                    <Text
                      style={
                        selectedVariantId === variant.id
                          ? styles.white
                          : styles.bold
                      }
                    >
                      {variant.nombre} · {cop(variant.precio)} ·{" "}
                      {variant.stock > 0
                        ? `Stock: ${variant.stock}`
                        : "Agotado"}
                    </Text>
                  </Pressable>
                ))}
              </>
            ) : (
              <>
                <Text style={styles.title}>{cop(current.precio)}</Text>
                <Text style={current.stock > 0 ? styles.green : styles.red}>
                  {current.stock > 0
                    ? `Disponibles: ${current.stock}`
                    : "Agotado"}
                </Text>
              </>
            )}
            <Pressable
              style={[
                styles.btn,
                ((current.variantes &&
                  (!selectedVariantId ||
                    current.variantes.find((v) => v.id === selectedVariantId)
                      ?.stock === 0)) ||
                  (!current.variantes && current.stock === 0)) &&
                  styles.btnOff,
              ]}
              disabled={
                current.variantes
                  ? !selectedVariantId ||
                    current.variantes.find((v) => v.id === selectedVariantId)
                      ?.stock === 0
                  : current.stock === 0
              }
              onPress={() => addToCart(current)}
            >
              <Text style={styles.white}>
                {current.stock === 0 ? "Agotado" : "Agregar al carrito"}
              </Text>
            </Pressable>
            {(current.variantes
              ? current.variantes.filter((v) => v.stock === 0)
              : current.stock === 0
                ? [null]
                : []
            ).map((variant, index) => (
              <Pressable
                key={variant?.id || `agotado-${index}`}
                style={styles.secondaryBtn}
                onPress={() => toggleSubscription(current.id, variant?.id)}
              >
                <Text style={styles.secondaryBtnText}>
                  {subscriptions.some(
                    (item) =>
                      item.active && item.key === (variant?.id || current.id),
                  )
                    ? "Cancelar aviso de reposición"
                    : "Avisarme cuando haya stock"}
                </Text>
              </Pressable>
            ))}

            <View style={styles.panel}>
              <Text style={styles.sectionTitle}>
                Valoraciones de compradores
              </Text>
              <Text style={styles.muted}>
                {ratings[current.id]?.length
                  ? `Promedio: ${(ratings[current.id].reduce((a, b) => a + b, 0) / ratings[current.id].length).toFixed(1)} / 5 (${ratings[current.id].length} valoraciones)`
                  : "Este producto todavía no tiene valoraciones."}
              </Text>
              <View style={styles.row}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Pressable key={star} onPress={() => setRatingDraft(star)}>
                    <Text
                      style={[
                        styles.ratingStar,
                        star <= ratingDraft && styles.ratingStarActive,
                      ]}
                    >
                      ★
                    </Text>
                  </Pressable>
                ))}
              </View>
              <Pressable style={styles.secondaryBtn} onPress={saveRating}>
                <Text style={styles.secondaryBtnText}>
                  Guardar valoración
                </Text>
              </Pressable>
            </View>

            <View style={styles.panel}>
              <Text style={styles.sectionTitle}>
                Preguntas sobre este producto
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Escribe tu pregunta (mínimo 10 caracteres)"
                value={questionText}
                onChangeText={setQuestionText}
                multiline
              />
              <Pressable style={styles.secondaryBtn} onPress={sendQuestion}>
                <Text style={styles.secondaryBtnText}>Enviar pregunta</Text>
              </Pressable>
              {(questions[current.id] || []).map((question) => (
                <View key={question.id} style={styles.questionCard}>
                  <Text style={styles.bold}>{question.text}</Text>
                  <Text style={styles.muted}>
                    {question.date} · {question.status}
                  </Text>
                  {question.answer ? (
                    <Text>{question.answer}</Text>
                  ) : (
                    <Pressable
                      onPress={() => demoAnswer(current.id, question.id)}
                    >
                      <Text style={styles.link}>Responder</Text>
                    </Pressable>
                  )}
                </View>
              ))}
            </View>

            <View style={styles.panel}>
              <Text style={styles.sectionTitle}>Productos relacionados</Text>
              {products
                .filter(
                  (item) =>
                    item.id !== current.id &&
                    item.categoria === current.categoria &&
                    productStock(item) > 0,
                )
                .slice(0, 4).length === 0 ? (
                <Text style={styles.muted}>
                  No hay otros productos disponibles en esta categoría.
                </Text>
              ) : (
                products
                  .filter(
                    (item) =>
                      item.id !== current.id &&
                      item.categoria === current.categoria &&
                      productStock(item) > 0,
                  )
                  .slice(0, 4)
                  .map((item) => (
                    <Pressable
                      key={item.id}
                      style={styles.relatedRow}
                      onPress={() => openDetail(item.id)}
                    >
                      <View style={styles.relatedImagePlaceholder}>
                        {PRODUCT_IMAGES[item.id] ? (
                          <Image
                            source={PRODUCT_IMAGES[item.id]}
                            style={styles.relatedProductImage}
                            resizeMode="cover"
                            accessibilityLabel={item.nombre}
                          />
                        ) : null}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.bold}>{item.nombre}</Text>
                        <Text style={styles.price}>{cop(item.precio)}</Text>
                      </View>
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

        {screen === "compare" && (
          <>
            <Text style={styles.title}>Comparador ({comparison.length}/3)</Text>
            {comparison.length === 0 ? (
              <Text style={styles.muted}>
                Selecciona productos en el catálogo para comparar.
              </Text>
            ) : (
              <ScrollView horizontal>
                {comparison.map((id) => {
                  const product = products.find((p) => p.id === id);
                  return (
                    <View key={id} style={styles.compareColumn}>
                      <Text style={styles.bold}>{product.nombre}</Text>
                      <Text style={styles.muted}>Marca: {product.marca}</Text>
                      <Text style={styles.price}>{cop(product.precio)}</Text>
                      <Text
                        style={
                          productStock(product) > 0 ? styles.green : styles.red
                        }
                      >
                        {productStock(product) > 0 ? "Disponible" : "Agotado"}
                      </Text>
                      <Pressable onPress={() => toggleCompare(id)}>
                        <Text style={styles.danger}>Retirar</Text>
                      </Pressable>
                    </View>
                  );
                })}
              </ScrollView>
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
                  <View key={i.cartId} style={styles.itemRow}>
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
                    <Pressable onPress={() => removeFromCart(i.cartId)}>
                      <Text style={[styles.danger, { marginLeft: 10 }]}>
                        Eliminar
                      </Text>
                    </Pressable>
                  </View>
                ))}
                <View style={styles.panel}>
                  <Text style={styles.sectionTitle}>Cupón promocional</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ingresa BIENVENIDO10"
                    autoCapitalize="characters"
                    value={couponInput}
                    onChangeText={setCouponInput}
                  />
                  <Pressable style={styles.secondaryBtn} onPress={applyCoupon}>
                    <Text style={styles.secondaryBtnText}>
                      {couponApplied ? "Cupón aplicado · 10%" : "Aplicar cupón"}
                    </Text>
                  </Pressable>
                  {couponApplied && (
                    <Text style={styles.green}>Descuento: {cop(discount)}</Text>
                  )}
                </View>
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
            <Text style={styles.title}>Dirección y envío</Text>
            <Text style={[styles.muted, { marginBottom: 10 }]}>
              Ingresa los datos de envío.
            </Text>
            {addresses.map((address) => (
              <View
                key={address.id}
                style={[
                  styles.box,
                  selectedAddressId === address.id && styles.primaryBox,
                ]}
              >
                <Pressable onPress={() => setSelectedAddressId(address.id)}>
                  <Text style={styles.bold}>
                    {address.alias}
                    {address.primary ? " · Principal" : ""}
                  </Text>
                  <Text>
                    {address.municipality} · {address.reference}
                  </Text>
                </Pressable>
                <Pressable onPress={() => setPrimaryAddress(address.id)}>
                  <Text style={styles.link}>Seleccionar principal</Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setEditingAddressId(address.id);
                    setAddressForm({
                      alias: address.alias,
                      municipality: address.municipality,
                      reference: address.reference,
                    });
                  }}
                >
                  <Text style={styles.link}>Editar</Text>
                </Pressable>
              </View>
            ))}
            {addresses.length === 0 && (
              <Text style={styles.muted}>No hay direcciones registradas.</Text>
            )}
            <Text style={[styles.title, { marginTop: 12 }]}>
              {editingAddressId ? "Editar dirección" : "Nueva dirección"}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Alias"
              value={addressForm.alias}
              onChangeText={(alias) =>
                setAddressForm({ ...addressForm, alias })
              }
            />
            <View style={styles.row}>
              {["Mosquera", "Funza", "Madrid"].map((municipality) => (
                <Pressable
                  key={municipality}
                  style={[
                    styles.chip,
                    addressForm.municipality === municipality &&
                      styles.chipActive,
                  ]}
                  onPress={() =>
                    setAddressForm({ ...addressForm, municipality })
                  }
                >
                  <Text
                    style={
                      addressForm.municipality === municipality
                        ? styles.white
                        : styles.chipText
                    }
                  >
                    {municipality}
                  </Text>
                </Pressable>
              ))}
            </View>
            <TextInput
              style={styles.input}
              placeholder="Referencia de entrega"
              value={addressForm.reference}
              onChangeText={(reference) =>
                setAddressForm({ ...addressForm, reference })
              }
            />
            <Pressable style={styles.btn} onPress={saveAddress}>
              <Text style={styles.white}>Guardar dirección</Text>
            </Pressable>
            <Text style={[styles.title, { marginTop: 12 }]}>
              Datos del comprador
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre de prueba"
              value={buyer.name}
              onChangeText={(name) => setBuyer({ ...buyer, name })}
            />
            <TextInput
              style={styles.input}
              placeholder="Teléfono"
              keyboardType="phone-pad"
              value={buyer.phone}
              onChangeText={(phone) => setBuyer({ ...buyer, phone })}
            />
            <Text style={[styles.title, { marginTop: 12 }]}>
              Modalidad de envío
            </Text>
            <View style={styles.row}>
              {[
                ["standard", "Estándar"],
                ["express", "Exprés"],
              ].map(([key, label]) => (
                <Pressable
                  key={key}
                  style={[
                    styles.chip,
                    shippingMode === key && styles.chipActive,
                  ]}
                  onPress={() => setShippingMode(key)}
                >
                  <Text
                    style={
                      shippingMode === key ? styles.white : styles.chipText
                    }
                  >
                    {label}
                  </Text>
                </Pressable>
              ))}
            </View>
            {selectedAddress &&
              shippingMode &&
              SHIPPING_TARIFFS[selectedAddress.municipality] && (
                <>
                  <Totals
                    subtotal={subtotal}
                    shipping={
                      SHIPPING_TARIFFS[selectedAddress.municipality][
                        shippingMode
                      ]
                    }
                    total={Math.max(
                      0,
                      subtotal -
                        discount +
                        SHIPPING_TARIFFS[selectedAddress.municipality][
                          shippingMode
                        ],
                    )}
                  />
                  {discount > 0 && (
                    <Text style={styles.green}>
                      Descuento aplicado: {cop(discount)}
                    </Text>
                  )}
                  <Text style={styles.muted}>
                    Entrega estimada:{" "}
                    {SHIPPING_TARIFFS[selectedAddress.municipality].days}
                  </Text>
                </>
              )}
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
            {discount > 0 && (
              <Text style={styles.green}>
                Cupón BIENVENIDO10 · Descuento: {cop(discount)}
              </Text>
            )}
            <Text style={styles.muted}>
              Prueba de compra académica, sin cobro real.
            </Text>
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
            {selectedOrder.discount > 0 && (
              <Text style={styles.green}>
                Descuento aplicado: {cop(selectedOrder.discount)}
              </Text>
            )}
            <View style={styles.panel}>
              <Text style={styles.sectionTitle}>Seguimiento del pedido</Text>
              <Text style={styles.bold}>
                Estado actual: {selectedOrder.status}
              </Text>
              {(selectedOrder.history || []).map((event, index) => (
                <View
                  key={`${event.status}-${index}`}
                  style={styles.timelineRow}
                >
                  <Text style={styles.timelineDot}>●</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.bold}>{event.status}</Text>
                    <Text style={styles.muted}>{event.date}</Text>
                    <Text>{event.detail}</Text>
                  </View>
                </View>
              ))}
              {!["Entregado", "Cancelado"].includes(selectedOrder.status) && (
                <Pressable
                  style={styles.secondaryBtn}
                  onPress={() => advanceOrder(selectedOrder.code)}
                >
                  <Text style={styles.secondaryBtnText}>
                    Avanzar entrega
                  </Text>
                </Pressable>
              )}
              {["Confirmado", "Preparando"].includes(selectedOrder.status) && (
                <Pressable
                  style={styles.dangerBtn}
                  onPress={() => cancelOrder(selectedOrder.code)}
                >
                  <Text style={styles.dangerBtnText}>
                    Cancelar compra y reintegrar stock
                  </Text>
                </Pressable>
              )}
            </View>
            <Text style={styles.note}>
              Compra registrada correctamente.
            </Text>
            <Pressable onPress={() => setScreen("history")}>
              <Text style={styles.link}>Volver al historial</Text>
            </Pressable>
          </>
        )}

        {screen === "more" && (
          <View>
            <Text style={styles.title}>Más opciones</Text>
            {[
              [
                "notifications",
                `Notificaciones${unreadCount ? ` (${unreadCount} sin leer)` : ""}`,
              ],
              ["help", "Centro de ayuda"],
              ["seller", "Panel de vendedor"],
            ].map(([key, label]) => (
              <Pressable
                key={key}
                style={styles.menuOption}
                onPress={() => setScreen(key)}
              >
                <Text style={styles.bold}>{label}</Text>
                <Text style={styles.link}>Abrir →</Text>
              </Pressable>
            ))}
            <View style={styles.panel}>
              <Text style={styles.sectionTitle}>
                Herramientas de demostración
              </Text>
              <Text style={styles.muted}>
                La reposición modifica el inventario de variantes agotadas con
                aviso activo.
              </Text>
              <Pressable style={styles.secondaryBtn} onPress={restockDemo}>
                <Text style={styles.secondaryBtnText}>
                  Reponer inventario
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        {screen === "notifications" && (
          <View>
            <Text style={styles.title}>Centro de notificaciones</Text>
            {notifications.length === 0 ? (
              <Empty
                text="No tienes notificaciones por ahora."
                label="Volver al inicio"
                onPress={() => setScreen("home")}
              />
            ) : (
              notifications.map((item) => (
                <Pressable
                  key={item.id}
                  style={[
                    styles.notificationCard,
                    !item.read && styles.unreadCard,
                  ]}
                  onPress={() => markNotificationRead(item.id)}
                >
                  <Text style={styles.bold}>{item.message}</Text>
                  <Text style={styles.muted}>{item.date}</Text>
                  <Text
                    style={item.read ? styles.muted : styles.notificationUnread}
                  >
                    {item.read ? "Leída" : "Toca para marcar como leída"}
                  </Text>
                </Pressable>
              ))
            )}
          </View>
        )}

        {screen === "help" && (
          <View>
            <Text style={styles.title}>Centro de ayuda</Text>
            {orders.length === 0 ? (
              <Empty
                text="Necesitas tener un pedido para crear una solicitud."
                label="Ver catálogo"
                onPress={() => setScreen("home")}
              />
            ) : (
              <>
                <Text style={styles.sectionTitle}>Pedido relacionado</Text>
                {orders.map((order) => (
                  <Pressable
                    key={order.code}
                    style={[
                      styles.chip,
                      helpOrder === order.code && styles.chipActive,
                    ]}
                    onPress={() => setHelpOrder(order.code)}
                  >
                    <Text
                      style={
                        helpOrder === order.code
                          ? styles.white
                          : styles.chipText
                      }
                    >
                      {order.code}
                    </Text>
                  </Pressable>
                ))}
                <Text style={styles.sectionTitle}>Motivo</Text>
                <View style={styles.row}>
                  {["Entrega", "Producto", "Otro"].map((reason) => (
                    <Pressable
                      key={reason}
                      style={[
                        styles.chip,
                        helpReason === reason && styles.chipActive,
                      ]}
                      onPress={() => setHelpReason(reason)}
                    >
                      <Text
                        style={
                          helpReason === reason ? styles.white : styles.chipText
                        }
                      >
                        {reason}
                      </Text>
                    </Pressable>
                  ))}
                </View>
                <TextInput
                  style={[styles.input, styles.multilineInput]}
                  placeholder="Describe tu solicitud (mínimo 15 caracteres)"
                  value={helpText}
                  onChangeText={setHelpText}
                  multiline
                />
                <Pressable style={styles.btn} onPress={createHelpCase}>
                  <Text style={styles.white}>Enviar solicitud</Text>
                </Pressable>
              </>
            )}
            <Text style={styles.sectionTitle}>Mis solicitudes</Text>
            {helpCases.length === 0 ? (
              <Text style={styles.muted}>
                Todavía no tienes casos registrados.
              </Text>
            ) : (
              helpCases.map((item) => (
                <View key={item.code} style={styles.panel}>
                  <Text style={styles.bold}>
                    {item.code} · {item.status}
                  </Text>
                  <Text style={styles.muted}>
                    Pedido {item.order} · {item.reason} · {item.date}
                  </Text>
                  <Text>{item.text}</Text>
                  {item.answer ? (
                    <Text>{item.answer}</Text>
                  ) : (
                    <Pressable onPress={() => simulateHelpReply(item.code)}>
                      <Text style={styles.link}>Responder</Text>
                    </Pressable>
                  )}
                </View>
              ))
            )}
          </View>
        )}

        {screen === "seller" && (
          <View>
            <Text style={styles.title}>Panel de vendedor · Demo</Text>
            <Text style={styles.muted}>
              Crea o edita productos del catálogo. No se conecta a un servicio
              externo.
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre del producto"
              value={sellerForm.nombre}
              onChangeText={(nombre) =>
                setSellerForm({ ...sellerForm, nombre })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Marca"
              value={sellerForm.marca}
              onChangeText={(marca) => setSellerForm({ ...sellerForm, marca })}
            />
            <View style={styles.row}>
              {CATEGORIES.slice(1).map((cat) => (
                <Pressable
                  key={cat}
                  style={[
                    styles.chip,
                    sellerForm.categoria === cat && styles.chipActive,
                  ]}
                  onPress={() =>
                    setSellerForm({ ...sellerForm, categoria: cat })
                  }
                >
                  <Text
                    style={
                      sellerForm.categoria === cat
                        ? styles.white
                        : styles.chipText
                    }
                  >
                    {cat}
                  </Text>
                </Pressable>
              ))}
            </View>
            <TextInput
              style={styles.input}
              placeholder="Precio en COP"
              keyboardType="numeric"
              value={sellerForm.precio}
              onChangeText={(precio) =>
                setSellerForm({ ...sellerForm, precio })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Stock (entero)"
              keyboardType="numeric"
              value={sellerForm.stock}
              onChangeText={(stock) => setSellerForm({ ...sellerForm, stock })}
            />
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Descripción"
              value={sellerForm.descripcion}
              onChangeText={(descripcion) =>
                setSellerForm({ ...sellerForm, descripcion })
              }
              multiline
            />
            <Pressable style={styles.btn} onPress={saveSellerProduct}>
              <Text style={styles.white}>
                {editingProductId ? "Guardar cambios" : "Crear producto"}
              </Text>
            </Pressable>
            {editingProductId && (
              <Pressable
                onPress={() => {
                  setEditingProductId(null);
                  setSellerForm({
                    nombre: "",
                    marca: "",
                    categoria: "Tecnología",
                    precio: "",
                    stock: "",
                    descripcion: "",
                  });
                }}
              >
                <Text style={styles.link}>Cancelar edición</Text>
              </Pressable>
            )}
            <Text style={styles.sectionTitle}>Productos registrados</Text>
            {products.map((product) => (
              <View key={product.id} style={styles.itemRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.bold}>{product.nombre}</Text>
                  <Text style={styles.muted}>
                    {product.id} · {product.categoria}
                  </Text>
                </View>
                <Pressable
                  onPress={() => {
                    setEditingProductId(product.id);
                    setSellerForm({
                      nombre: product.nombre,
                      marca: product.marca || "",
                      categoria: product.categoria,
                      precio: String(product.precio),
                      stock: String(product.stock ?? productStock(product)),
                      descripcion: product.descripcion || "",
                    });
                  }}
                >
                  <Text style={styles.link}>Editar</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.nav}>
        {TABS.map(([key, label, icon]) => (
          <Pressable
            key={key}
            style={styles.tab}
            onPress={() => setScreen(key)}
            accessibilityRole="button"
            accessibilityLabel={label}
          >
            <View style={styles.tabIconBox}>
              <Text style={styles.tabIcon} accessible={false}>
                {icon}
              </Text>
            </View>
            <Text
              style={[
                styles.navText,
                (screen === key ||
                  (key === "more" &&
                    ["notifications", "help", "seller"].includes(screen))) &&
                  styles.navActive,
              ]}
            >
              {key === "cart" && cartCount > 0
                ? `${label} (${cartCount})`
                : key === "more" && unreadCount > 0
                  ? `${label} (${unreadCount})`
                  : label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const NAVY = "#032354";
const CYAN = "#00A8B5";
const CYAN_DARK = "#007E8A";
const HEADER_BG = "#FFFFFF";
const HERO_BG = "#E8F6F8";
const SURFACE_BG = "#F4F8FA";
const BORDER_COLOR = "#D5E4EA";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: SURFACE_BG },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 8,
    backgroundColor: HEADER_BG,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
  },
  logoImage: { width: 156, height: 102 },
  toast: {
    backgroundColor: NAVY,
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 13,
    padding: 10,
  },
  body: { flex: 1, paddingHorizontal: 16, paddingTop: 0 },
  hero: {
    width: "100%",
    aspectRatio: 11 / 6,
    backgroundColor: HERO_BG,
    marginBottom: 18,
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: CYAN,
    alignItems: "center",
    justifyContent: "center",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: NAVY,
    marginTop: 6,
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    borderRadius: 12,
    paddingHorizontal: 13,
    minHeight: 45,
    marginBottom: 10,
    color: NAVY,
  },
  multilineInput: { minHeight: 90, textAlignVertical: "top", paddingTop: 12 },
  chip: {
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: "#E4EFF3",
    marginRight: 7,
    marginBottom: 8,
  },
  chipActive: { backgroundColor: NAVY },
  chipText: { fontSize: 12, color: NAVY, fontWeight: "600" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48.2%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    elevation: 2,
    shadowColor: NAVY,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  cardImg: {
    height: 132,
    backgroundColor: "#E6F2F5",
    borderRadius: 11,
    marginBottom: 10,
    position: "relative",
    overflow: "hidden",
  },
  cardProductImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  cardImageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    padding: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  imageCategoryLabel: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 3,
    fontSize: 10,
    color: NAVY,
    fontWeight: "700",
  },
  bigImg: {
    height: 210,
    backgroundColor: HERO_BG,
    borderRadius: 18,
    marginTop: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    position: "relative",
    overflow: "hidden",
  },
  detailProductImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  detailImageCategory: {
    position: "absolute",
    top: 10,
    left: 10,
  },
  star: { fontSize: 22, color: "#E5A000" },
  ratingStar: { fontSize: 28, color: "#CBD5DB", marginRight: 5 },
  ratingStarActive: { color: "#E5A000" },
  title: {
    fontSize: 20,
    fontWeight: "900",
    color: NAVY,
    marginTop: 10,
    marginBottom: 6,
  },
  bold: { fontWeight: "800", color: NAVY },
  price: { color: CYAN_DARK, fontWeight: "900", marginTop: 4 },
  muted: { color: "#5C7685", fontSize: 12 },
  small: { fontSize: 10, color: NAVY, fontWeight: "700" },
  green: { color: "#16845B", fontSize: 12, marginTop: 4, fontWeight: "700" },
  red: { color: "#C44545", fontSize: 12, marginTop: 4, fontWeight: "800" },
  danger: { color: "#C44545", fontSize: 13, fontWeight: "700" },
  link: {
    color: CYAN_DARK,
    textAlign: "center",
    marginTop: 10,
    fontWeight: "800",
  },
  note: { color: "#16845B", textAlign: "center", marginTop: 8 },
  empty: { alignItems: "center", marginTop: 32, padding: 18 },
  btn: {
    backgroundColor: CYAN,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },
  btnOff: { backgroundColor: "#AEBBC1" },
  white: { color: "#FFFFFF", fontWeight: "800" },
  secondaryBtn: {
    backgroundColor: "#E4F5F7",
    borderRadius: 10,
    padding: 11,
    alignItems: "center",
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#B7E2E7",
  },
  secondaryBtnText: { color: CYAN_DARK, fontWeight: "800", fontSize: 12 },
  dangerBtn: {
    backgroundColor: "#FCE9E8",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    marginTop: 10,
  },
  dangerBtnText: { color: "#B42318", fontWeight: "800" },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 13,
    borderRadius: 13,
    marginTop: 9,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  qtyBtn: {
    backgroundColor: "#E4EFF3",
    width: 30,
    height: 30,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  qty: { marginHorizontal: 10, fontWeight: "900", color: NAVY },
  box: {
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 13,
    marginTop: 10,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  panel: {
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 15,
    marginTop: 14,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  questionCard: {
    backgroundColor: SURFACE_BG,
    padding: 11,
    borderRadius: 10,
    marginTop: 9,
  },
  relatedRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: "#E8F0F4",
  },
  relatedImagePlaceholder: {
    width: 62,
    height: 58,
    backgroundColor: "#E6F2F5",
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
    overflow: "hidden",
  },
  relatedProductImage: {
    width: "100%",
    height: "100%",
  },
  timelineRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 12,
  },
  timelineDot: { color: CYAN, marginRight: 10, fontSize: 16 },
  menuOption: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    marginTop: 9,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  notificationCard: {
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 12,
    marginTop: 9,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  unreadCard: { borderColor: CYAN, backgroundColor: "#EFFBFC" },
  notificationUnread: {
    color: CYAN_DARK,
    fontSize: 11,
    fontWeight: "800",
    marginTop: 5,
  },
  nav: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: BORDER_COLOR,
    backgroundColor: "#FFFFFF",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
  },
  tabIconBox: {
    width: 30,
    height: 26,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  tabIcon: {
    width: 30,
    textAlign: "center",
    fontSize: 20,
    lineHeight: 24,
    color: CYAN_DARK,
  },
  navText: {
    maxWidth: "100%",
    fontSize: 10,
    fontWeight: "700",
    color: "#688290",
    textAlign: "center",
  },
  navActive: { color: CYAN_DARK },
  variant: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#EDF4F7",
    marginTop: 7,
  },
  compareChip: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "#E4EFF3",
    marginTop: 8,
  },
  variantActive: { backgroundColor: NAVY },
  primaryBox: { borderColor: CYAN, borderWidth: 2 },
  compareColumn: {
    width: 180,
    backgroundColor: "#FFFFFF",
    padding: 14,
    marginRight: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
});
