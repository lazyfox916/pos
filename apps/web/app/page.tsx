"use client";

import { useEffect, useMemo, useState } from "react";
import { MOCK_MENU, type MenuCategory, type MenuItem } from "../lib/mockMenu";

type OrderType = "Dine-in" | "Takeaway" | "Delivery";

type OrderLine = {
  itemId: string;
  qty: number;
  note: string;
};

function formatINR(amount: number): string {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `₹${amount}`;
  }
}

function useConnectivity(): boolean {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    setOnline(typeof navigator === "undefined" ? true : navigator.onLine);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  return online;
}

export default function Home() {
  const menu = useMemo(() => MOCK_MENU, []);
  const online = useConnectivity();

  const categories = useMemo(() => {
    const set = new Set<MenuCategory>();
    for (const i of menu) set.add(i.category);
    return Array.from(set);
  }, [menu]);

  const [activeCategory, setActiveCategory] = useState<MenuCategory>(
    categories[0] ?? "Starters"
  );
  const [orderType, setOrderType] = useState<OrderType>("Dine-in");
  const [tableOrSession, setTableOrSession] = useState("Table 1");

  const [lines, setLines] = useState<OrderLine[]>([]);
  const [syncState, setSyncState] = useState<"Synced" | "Pending">("Synced");

  const itemById = useMemo(() => {
    const m = new Map<string, MenuItem>();
    for (const i of menu) m.set(i.id, i);
    return m;
  }, [menu]);

  const visibleMenu = useMemo(
    () => menu.filter((i) => i.category === activeCategory),
    [menu, activeCategory]
  );

  const totals = useMemo(() => {
    const subtotal = lines.reduce((acc, l) => {
      const item = itemById.get(l.itemId);
      return acc + (item ? item.price * l.qty : 0);
    }, 0);
    const itemCount = lines.reduce((acc, l) => acc + l.qty, 0);
    return { subtotal, itemCount };
  }, [lines, itemById]);

  function markPendingAndMaybeSync() {
    setSyncState("Pending");
    if (online) {
      window.setTimeout(() => setSyncState("Synced"), 700);
    }
  }

  function addItem(itemId: string) {
    setLines((prev) => {
      const idx = prev.findIndex((l) => l.itemId === itemId);
      const next = [...prev];
      if (idx >= 0) {
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
      } else {
        next.push({ itemId, qty: 1, note: "" });
      }
      return next;
    });
    markPendingAndMaybeSync();
  }

  function setQty(itemId: string, nextQty: number) {
    setLines((prev) =>
      prev
        .map((l) => (l.itemId === itemId ? { ...l, qty: nextQty } : l))
        .filter((l) => l.qty > 0)
    );
    markPendingAndMaybeSync();
  }

  function setNote(itemId: string, note: string) {
    setLines((prev) =>
      prev.map((l) => (l.itemId === itemId ? { ...l, note } : l))
    );
    markPendingAndMaybeSync();
  }

  function removeItem(itemId: string) {
    setLines((prev) => prev.filter((l) => l.itemId !== itemId));
    markPendingAndMaybeSync();
  }

  function onDragStart(e: React.DragEvent, itemId: string) {
    e.dataTransfer.setData("text/plain", itemId);
    e.dataTransfer.effectAllowed = "copy";
  }

  function onDropToOrder(e: React.DragEvent) {
    e.preventDefault();
    const itemId = e.dataTransfer.getData("text/plain");
    if (!itemId) return;
    addItem(itemId);
  }

  return (
    <main className="shell">
      <header className="topbar">
        <div>
          <div className="title">Kitchen POS</div>
          <div className="subtitle muted">Mocked menu + order builder (Phase 2)</div>
        </div>
        <div className="topbarRight">
          <span className={`pill ${online ? "pillOk" : "pillWarn"}`}>
            {online ? "Online" : "Offline"}
          </span>
          <span className={`pill ${syncState === "Synced" ? "pillOk" : "pillNeutral"}`}>
            {syncState}
          </span>
        </div>
      </header>

      <div className="grid">
        <section className="panel">
          <div className="panelHeader">
            <div className="panelTitle">Menu</div>
            <div className="tabs" role="tablist" aria-label="Menu categories">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`tab ${c === activeCategory ? "tabActive" : ""}`}
                  onClick={() => setActiveCategory(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="menuGrid">
            {visibleMenu.map((item) => (
              <div
                key={item.id}
                className={`menuItem ${item.available ? "" : "menuItemDisabled"}`}
                draggable={item.available}
                onDragStart={(e) => onDragStart(e, item.id)}
              >
                <div className="menuItemTop">
                  <div className="menuItemName">{item.name}</div>
                  <div className="menuItemPrice">{formatINR(item.price)}</div>
                </div>
                <div className="menuItemMeta muted">{item.category}</div>
                <div className="menuItemActions">
                  <button
                    type="button"
                    className="btn"
                    onClick={() => addItem(item.id)}
                    disabled={!item.available}
                  >
                    Add
                  </button>
                  <div className="muted hint">Drag → Order</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside
          className="panel orderPanel"
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDropToOrder}
        >
          <div className="panelHeader">
            <div className="panelTitle">Order</div>
            <div className="orderMeta">
              <label className="field">
                <span className="fieldLabel muted">Type</span>
                <select
                  className="select"
                  value={orderType}
                  onChange={(e) => {
                    setOrderType(e.target.value as OrderType);
                    markPendingAndMaybeSync();
                  }}
                >
                  <option value="Dine-in">Dine-in</option>
                  <option value="Takeaway">Takeaway</option>
                  <option value="Delivery">Delivery</option>
                </select>
              </label>

              <label className="field">
                <span className="fieldLabel muted">
                  {orderType === "Dine-in" ? "Table" : "Session"}
                </span>
                <input
                  className="input"
                  value={tableOrSession}
                  onChange={(e) => {
                    setTableOrSession(e.target.value);
                    markPendingAndMaybeSync();
                  }}
                />
              </label>
            </div>
          </div>

          {lines.length === 0 ? (
            <div className="empty">
              <div className="emptyTitle">Drop items here</div>
              <div className="muted">
                Drag a menu item into this panel, or click <b>Add</b>.
              </div>
            </div>
          ) : (
            <div className="orderLines">
              {lines.map((l) => {
                const item = itemById.get(l.itemId);
                if (!item) return null;
                const lineTotal = item.price * l.qty;
                return (
                  <div key={l.itemId} className="orderLine">
                    <div className="orderLineTop">
                      <div>
                        <div className="orderLineName">{item.name}</div>
                        <div className="muted orderLineSub">
                          {formatINR(item.price)} each
                        </div>
                      </div>
                      <div className="orderLineTotal">{formatINR(lineTotal)}</div>
                    </div>

                    <div className="orderLineControls">
                      <div className="qty">
                        <button
                          type="button"
                          className="btn btnSmall"
                          onClick={() => setQty(l.itemId, l.qty - 1)}
                        >
                          −
                        </button>
                        <div className="qtyValue" aria-label="Quantity">
                          {l.qty}
                        </div>
                        <button
                          type="button"
                          className="btn btnSmall"
                          onClick={() => setQty(l.itemId, l.qty + 1)}
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        className="btn btnSmall btnGhost"
                        onClick={() => removeItem(l.itemId)}
                      >
                        Remove
                      </button>
                    </div>

                    <label className="note">
                      <span className="fieldLabel muted">Instruction</span>
                      <input
                        className="input"
                        placeholder="e.g., no onion, extra spicy…"
                        value={l.note}
                        onChange={(e) => setNote(l.itemId, e.target.value)}
                      />
                    </label>
                  </div>
                );
              })}
            </div>
          )}

          <div className="orderSummary">
            <div className="summaryRow">
              <span className="muted">Items</span>
              <span>{totals.itemCount}</span>
            </div>
            <div className="summaryRow">
              <span className="muted">Subtotal</span>
              <span className="summaryValue">{formatINR(totals.subtotal)}</span>
            </div>
            <div className="muted summaryHint">
              Mocked totals only (no taxes/discounts yet).
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

