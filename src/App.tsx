import "./App.css";

export default function App() {
  return (
    <div className="vm-page">
      <div className="vm">
        <div className="vm__top">
          <div className="vm__brand">Vending Machine</div>
          <div className="vm__led">WELCOME • INSERT COIN OR TAP CARD</div>
        </div>

        <div className="vm__window" aria-label="상품 진열">
          <div className="rack">
            <button className="slot" aria-label="콜라 A1 1,100원">
              <div className="prod prod--cola" />
              <div className="slot__meta">
                <span className="slot__name">콜라</span>
                <span className="slot__price">₩1,100</span>
                <span className="slot__code">A1</span>
              </div>
            </button>

            <button className="slot" aria-label="물 A2 600원">
              <div className="prod prod--water" />
              <div className="slot__meta">
                <span className="slot__name">물</span>
                <span className="slot__price">₩600</span>
                <span className="slot__code">A2</span>
              </div>
            </button>

            <button
              className="slot slot--oos"
              disabled
              aria-disabled="true"
              aria-label="커피 A3 700원 품절"
              title="품절"
            >
              <div className="prod prod--coffee" />
              <div className="slot__meta">
                <span className="slot__name">커피</span>
                <span className="slot__price">₩700</span>
                <span className="slot__code">A3</span>
              </div>
              <span className="badge">SOLD OUT</span>
            </button>

            <div className="slot slot--dummy" aria-hidden="true" />
            <div className="slot slot--dummy" aria-hidden="true" />
            <div className="slot slot--dummy" aria-hidden="true" />
          </div>
        </div>

        <aside className="panel" aria-label="조작 패널">
          <div className="panel__display" role="status" aria-live="polite">
            <div className="display__title">상태</div>
            <div className="display__state">READY</div>
            <div className="display__msg">제품을 선택하세요.</div>
            <div className="display__summary">
              <div>
                <strong>선택:</strong> 없음
              </div>
              <div>
                <strong>투입:</strong> ₩0
              </div>
              <div>
                <strong>거스름:</strong> 없음
              </div>
            </div>
          </div>

          <div className="panel__keypad" aria-label="결제 키패드">
            <button className="kbtn">₩100</button>
            <button className="kbtn">₩500</button>
            <button className="kbtn">₩1,000</button>
            <button className="kbtn">₩5,000</button>
            <button className="kbtn">₩10,000</button>
            <button className="kbtn kbtn--ghost">카드 결제</button>
            <button className="kbtn kbtn--primary">구매</button>
            <button className="kbtn kbtn--danger">취소/환불</button>
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
                  />
                </div>
                <div className="io-section__label">RETURN</div>
              </div>
            </div>
          </div>
        </aside>

        <div className="vm__tray" aria-label="배출구">
          <div className="tray__mouth" />
          <div className="tray__label">PUSH</div>
        </div>
      </div>
    </div>
  );
}
