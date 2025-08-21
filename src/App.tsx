import "./App.css";
import { useVendingMachine } from "./hooks/useVendingMachine";
import { DRINKS } from "./constants";
import type { Currency, DrinkId } from "./types";
import { toKrw } from "./utils/currency";

const money: Currency[] = [100, 500, 1000, 5000, 10000];
const META: Record<DrinkId, { code: string; skin: string }> = {
  cola: { code: "A1", skin: "prod--cola" },
  water: { code: "A2", skin: "prod--water" },
  coffee: { code: "A3", skin: "prod--coffee" },
};

const ChangeText = ({ change }: { change: Record<number, number> }) => {
  const parts = Object.entries(change)
    .filter(([, c]) => (c ?? 0) > 0)
    .map(([d, c]) => `${Number(d).toLocaleString()}원×${c}`);
  return <>{parts.length ? parts.join(", ") : "없음"}</>;
};

export default function App() {
  const { state, actions } = useVendingMachine();
  const selection = state.cart.selection;

  const canCollect = state.state === "done" || state.state === "cancelled";
  const ledText = canCollect
    ? "수령하려면 아래 PUSH를 누르세요."
    : state.state === "idle"
    ? "WELCOME • INSERT COIN OR TAP CARD"
    : state.cart.message;

  return (
    <div className="vm-page">
      <div className="vm">
        <div className="vm__top">
          <div className="vm__brand">Vending Machine</div>
          <div className="vm__led">{ledText}</div>
        </div>

        <div className="vm__window" aria-label="상품 진열">
          <div className="rack">
            {(Object.keys(DRINKS) as DrinkId[]).map((id) => {
              const meta = META[id];
              const oos = state.inventory.drinks[id] <= 0;
              const selected = selection === id;
              return (
                <button
                  key={id}
                  className={`slot ${selected ? "slot--selected" : ""} ${
                    oos ? "slot--oos" : ""
                  }`}
                  onClick={() => !oos && actions.select(id)}
                  disabled={oos}
                  aria-disabled={oos}
                  aria-label={`${DRINKS[id].name} ${meta.code} ${
                    DRINKS[id].price
                  }원${oos ? " 품절" : ""}`}
                  title={oos ? "품절" : DRINKS[id].name}
                >
                  <div className={`prod ${meta.skin}`} />
                  <div className="slot__meta">
                    <span className="slot__name">{DRINKS[id].name}</span>
                    <span className="slot__price">
                      {toKrw(DRINKS[id].price)}
                    </span>
                    <span className="slot__code">{meta.code}</span>
                  </div>
                  {oos && <span className="badge">SOLD OUT</span>}
                </button>
              );
            })}
            <div className="slot slot--dummy" aria-hidden="true" />
            <div className="slot slot--dummy" aria-hidden="true" />
            <div className="slot slot--dummy" aria-hidden="true" />
          </div>
        </div>

        <aside className="panel" aria-label="조작 패널">
          <div className="panel__display" role="status" aria-live="polite">
            <div className="display__title">상태</div>
            <div className="display__state">{state.state.toUpperCase()}</div>
            <div className="display__msg">
              {state.cart.message ?? "제품을 선택하세요."}
            </div>
            <div className="display__summary">
              <div>
                <strong>선택:</strong>{" "}
                {selection ? DRINKS[selection].name : "없음"}
              </div>
              <div>
                <strong>투입:</strong> {toKrw(state.cart.inserted)}
              </div>
              <div>
                <strong>거스름:</strong>{" "}
                <ChangeText change={state.cart.changeToDispense} />
              </div>
            </div>
          </div>

          <div className="panel__keypad" aria-label="결제 키패드">
            {money.map((m) => (
              <button
                key={m}
                className="kbtn"
                onClick={() => actions.insertCash(m)}
              >{`₩${m.toLocaleString()}`}</button>
            ))}
            <button className="kbtn kbtn--ghost" onClick={actions.payByCard}>
              카드 결제
            </button>
            <button
              className="kbtn kbtn--primary"
              onClick={actions.dispense}
              disabled={!selection}
            >
              구매
            </button>
            <button className="kbtn kbtn--danger" onClick={actions.cancel}>
              취소/환불
            </button>
          </div>

          <div className="panel__io" aria-label="입출력 슬롯">
            <div className="io-block">
              <div
                className="io-section io-section--card"
                aria-label="카드 리더기"
              >
                <div className="io-card">
                  <div className="io-card__slot" />
                  <div className="io-card__led" aria-hidden="true" />
                </div>
                <div className="io-section__label">CARD</div>
              </div>
              <div className="io-divider" />
              <div
                className="io-section io-section--coin"
                aria-label="동전 투입구"
              >
                <div className="io-coin">
                  <div className="io-coin__mouth" />
                </div>
                <div className="io-section__label">COIN</div>
              </div>
              <div className="io-divider" />
              <div
                className="io-section io-section--return"
                aria-label="코인 리턴"
              >
                <div className="io-return">
                  <div className="io-return__mouth" />
                  <button
                    className="io-return__btn"
                    aria-label="코인 리턴 버튼"
                    onClick={actions.cancel}
                  />
                </div>
                <div className="io-section__label">RETURN</div>
              </div>
            </div>
          </div>
        </aside>

        <div
          className="vm__tray"
          aria-label="배출구"
          role="button"
          aria-disabled={!canCollect}
          data-active={canCollect}
          onClick={canCollect ? actions.pushTray : undefined}
          onKeyDown={(e) => {
            if (!canCollect) return;
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              actions.pushTray();
            }
          }}
          tabIndex={0}
        >
          <div className="tray__mouth" />
          <div className="tray__label">PUSH</div>
        </div>
      </div>
    </div>
  );
}
