import { useState, useEffect, useMemo, useCallback } from "react";
import { ChevronRight, ChevronLeft, RotateCw, Check, X, Mail, Gauge, Truck, MessageSquareText, BarChart3, RefreshCw } from "lucide-react";

/* ---------------------------------------------------------
   VOCABULARY DATA — shaft / automotive manufacturing English
--------------------------------------------------------- */
const DECKS = [
  {
    id: "machining",
    title: "Machining & Process",
    subtitle: "Torna, taşlama, ısıl işlem",
    icon: Gauge,
    color: "#FF6B35",
    cards: [
      { en: "shaft", tr: "şaft / mil", ex: "The output shaft failed the runout check.", exTr: "Çıkış şaftı salgı kontrolünü geçemedi." },
      { en: "turning", tr: "tornalama", ex: "Turning is done on the OD before grinding.", exTr: "Taşlamadan önce dış çap tornalanır." },
      { en: "grinding", tr: "taşlama", ex: "Final grinding brings the diameter to size.", exTr: "Son taşlama çapı ölçüsüne getirir." },
      { en: "induction hardening", tr: "indüksiyon sertleştirme", ex: "Induction hardening covers the journal area only.", exTr: "İndüksiyon sertleştirme sadece yatak bölgesini kapsar." },
      { en: "case hardening", tr: "yüzey sertleştirme", ex: "Case hardening depth must be 0.8–1.2 mm.", exTr: "Yüzey sertleştirme derinliği 0,8–1,2 mm olmalı." },
      { en: "OD (outer diameter)", tr: "dış çap", ex: "The OD is out of tolerance by 0.02 mm.", exTr: "Dış çap tolerans dışında, 0,02 mm fazla." },
      { en: "ID (inner diameter)", tr: "iç çap", ex: "Check the ID after the boring operation.", exTr: "Delik açma işleminden sonra iç çapı kontrol et." },
      { en: "runout", tr: "salgı", ex: "Runout exceeds the drawing limit.", exTr: "Salgı, resimdeki limiti aşıyor." },
      { en: "concentricity", tr: "eş merkezlilik", ex: "Concentricity between the two journals is critical.", exTr: "İki yatak yüzeyi arasındaki eş merkezlilik kritiktir." },
      { en: "straightness", tr: "doğrusallık", ex: "The shaft shows poor straightness after heat treatment.", exTr: "Şaft ısıl işlemden sonra düşük doğrusallık gösteriyor." },
      { en: "spline", tr: "kama / spline", ex: "The spline engages with the gear hub.", exTr: "Spline, dişli göbeğiyle kavrar." },
      { en: "keyway", tr: "kama yuvası", ex: "Mill the keyway before hardening.", exTr: "Sertleştirmeden önce kama yuvasını frezele." },
      { en: "journal", tr: "yatak yüzeyi", ex: "The bearing sits on the ground journal.", exTr: "Rulman, taşlanmış yatak yüzeyine oturur." },
      { en: "shoulder", tr: "omuz / basamak", ex: "The shoulder provides axial location for the bearing.", exTr: "Omuz, rulman için eksenel konumlandırma sağlar." },
      { en: "chamfer", tr: "pah", ex: "Add a 0.5 mm chamfer to ease assembly.", exTr: "Montajı kolaylaştırmak için 0,5 mm pah ekle." },
      { en: "fillet radius", tr: "köşe radyüsü", ex: "Increase the fillet radius to reduce stress concentration.", exTr: "Gerilme yığılmasını azaltmak için köşe radyüsünü büyüt." },
      { en: "surface finish (Ra)", tr: "yüzey pürüzlülüğü", ex: "Surface finish must be Ra 0.4 or better.", exTr: "Yüzey pürüzlülüğü Ra 0,4 veya daha iyi olmalı." },
      { en: "hardness (HRC)", tr: "sertlik", ex: "Hardness should be 58–62 HRC on the journal.", exTr: "Yatak yüzeyinde sertlik 58–62 HRC olmalı." },
      { en: "heat treatment", tr: "ısıl işlem", ex: "Heat treatment is subcontracted to a local supplier.", exTr: "Isıl işlem yerel bir tedarikçiye fason yaptırılıyor." },
      { en: "raw material / billet", tr: "hammadde / külçe", ex: "The billet is cut to length before forging.", exTr: "Külçe, dövmeden önce boyuna kesilir." },
    ],
  },
  {
    id: "quality",
    title: "Quality & Tolerance",
    subtitle: "Kalite, tolerans, denetim",
    icon: BarChart3,
    color: "#4FA3C7",
    cards: [
      { en: "tolerance", tr: "tolerans", ex: "The tolerance on this dimension is ±0.01 mm.", exTr: "Bu ölçüdeki tolerans ±0,01 mm'dir." },
      { en: "deviation", tr: "sapma", ex: "We recorded a deviation from the drawing.", exTr: "Resimden bir sapma kaydettik." },
      { en: "out of spec", tr: "spek dışı", ex: "Three parts were out of spec this shift.", exTr: "Bu vardiyada üç parça spek dışı çıktı." },
      { en: "NCR (non-conformance report)", tr: "uygunsuzluk raporu", ex: "Please open an NCR for this batch.", exTr: "Lütfen bu parti için bir uygunsuzluk raporu açın." },
      { en: "root cause", tr: "kök neden", ex: "The root cause was tool wear.", exTr: "Kök neden takım aşınmasıydı." },
      { en: "corrective action", tr: "düzeltici faaliyet", ex: "Submit the corrective action plan by Friday.", exTr: "Düzeltici faaliyet planını cumaya kadar gönderin." },
      { en: "PPAP", tr: "üretim parçası onay süreci", ex: "PPAP submission is due before mass production.", exTr: "PPAP teslimi seri üretimden önce yapılmalı." },
      { en: "FAI (first article inspection)", tr: "ilk numune muayenesi", ex: "FAI results look good, all dimensions in tolerance.", exTr: "İlk numune muayenesi sonuçları iyi, tüm ölçüler tolerans içinde." },
      { en: "CMM (coordinate measuring machine)", tr: "koordinat ölçüm cihazı", ex: "Send the part to the CMM for full inspection.", exTr: "Parçayı tam muayene için koordinat ölçüm cihazına gönderin." },
      { en: "rework", tr: "yeniden işleme", ex: "These shafts can be reworked, not scrapped.", exTr: "Bu şaftlar hurdaya ayrılmadan yeniden işlenebilir." },
      { en: "scrap rate", tr: "hurda oranı", ex: "Scrap rate dropped to 1.2% last month.", exTr: "Hurda oranı geçen ay %1,2'ye düştü." },
      { en: "defect rate", tr: "hata oranı", ex: "Defect rate is tracked per 1,000 pieces (PPM).", exTr: "Hata oranı 1000 parça başına (PPM) takip edilir." },
      { en: "containment", tr: "ayıklama / önleme", ex: "Containment action is in place at final inspection.", exTr: "Ayıklama faaliyeti son kontrolde uygulanıyor." },
      { en: "8D report", tr: "8D raporu", ex: "Please send the 8D report for the complaint.", exTr: "Şikayet için lütfen 8D raporunu gönderin." },
      { en: "calibration", tr: "kalibrasyon", ex: "The gauge calibration expired last week.", exTr: "Mastarın kalibrasyonu geçen hafta sona erdi." },
      { en: "audit", tr: "denetim", ex: "The customer audit is scheduled for next Tuesday.", exTr: "Müşteri denetimi gelecek salıya planlandı." },
    ],
  },
  {
    id: "logistics",
    title: "Logistics & Orders",
    subtitle: "Sevkiyat, sipariş, planlama",
    icon: Truck,
    color: "#7FB069",
    cards: [
      { en: "lead time", tr: "teslim süresi", ex: "The lead time for this part is six weeks.", exTr: "Bu parçanın teslim süresi altı haftadır." },
      { en: "delivery date", tr: "teslim tarihi", ex: "Can you confirm the delivery date?", exTr: "Teslim tarihini onaylayabilir misiniz?" },
      { en: "shipment", tr: "sevkiyat", ex: "The shipment left the factory this morning.", exTr: "Sevkiyat bu sabah fabrikadan çıktı." },
      { en: "backlog", tr: "bekleyen sipariş / iş yükü", ex: "We have a backlog of 2,000 pieces.", exTr: "2.000 parçalık bekleyen siparişimiz var." },
      { en: "MOQ (minimum order quantity)", tr: "minimum sipariş miktarı", ex: "The MOQ for this raw material is 5 tons.", exTr: "Bu hammadde için minimum sipariş miktarı 5 tondur." },
      { en: "packing list", tr: "çeki listesi", ex: "Please attach the packing list to the invoice.", exTr: "Lütfen çeki listesini faturaya ekleyin." },
      { en: "customs clearance", tr: "gümrük işlemi", ex: "Customs clearance may take two extra days.", exTr: "Gümrük işlemi iki gün daha sürebilir." },
      { en: "incoterms", tr: "teslim şekli (incoterms)", ex: "We ship under FCA incoterms.", exTr: "FCA teslim şekliyle sevkiyat yapıyoruz." },
      { en: "forecast", tr: "tahmin / öngörü", ex: "Please send the updated forecast for Q3.", exTr: "Lütfen 3. çeyrek için güncel tahmini gönderin." },
      { en: "purchase order (PO)", tr: "satın alma siparişi", ex: "We haven't received the PO yet.", exTr: "Satın alma siparişini henüz almadık." },
      { en: "expedite", tr: "hızlandırmak", ex: "Can you expedite this shipment by air freight?", exTr: "Bu sevkiyatı hava yoluyla hızlandırabilir misiniz?" },
      { en: "supplier", tr: "tedarikçi", ex: "Our heat-treatment supplier is delayed.", exTr: "Isıl işlem tedarikçimiz gecikti." },
    ],
  },
  {
    id: "email",
    title: "Email Phrases",
    subtitle: "İş maillerinde kalıp ifadeler",
    icon: Mail,
    color: "#C77DFF",
    cards: [
      { en: "Please find attached…", tr: "Ekte … bulabilirsiniz", ex: "Please find attached the inspection report.", exTr: "Ekte muayene raporunu bulabilirsiniz." },
      { en: "Could you please confirm…", tr: "… onaylar mısınız", ex: "Could you please confirm the new delivery date?", exTr: "Yeni teslim tarihini onaylar mısınız?" },
      { en: "I would like to follow up on…", tr: "… konusunda takip etmek isterim", ex: "I would like to follow up on yesterday's call.", exTr: "Dünkü görüşmemizi takip etmek isterim." },
      { en: "As per our discussion…", tr: "Konuştuğumuz üzere…", ex: "As per our discussion, we will rework the batch.", exTr: "Konuştuğumuz üzere, bu partiyi yeniden işleyeceğiz." },
      { en: "We regret to inform you that…", tr: "Üzülerek bildiririz ki…", ex: "We regret to inform you that the shipment is delayed.", exTr: "Üzülerek bildiririz ki sevkiyat gecikecek." },
      { en: "At your earliest convenience", tr: "En kısa sürede / uygun olduğunuzda", ex: "Please reply at your earliest convenience.", exTr: "Lütfen en kısa sürede geri dönüş yapın." },
      { en: "Kindly revert / kindly advise", tr: "Lütfen geri dönüş yapın", ex: "Kindly advise on the next steps.", exTr: "Sonraki adımlar için lütfen bilgi verin." },
      { en: "Please be advised that…", tr: "Bilginize, …", ex: "Please be advised that the audit is postponed.", exTr: "Bilginize, denetim ertelendi." },
      { en: "We apologize for the inconvenience", tr: "Verdiğimiz rahatsızlıktan dolayı özür dileriz", ex: "We apologize for the inconvenience caused.", exTr: "Verdiğimiz rahatsızlıktan dolayı özür dileriz." },
      { en: "Looking forward to your reply", tr: "Yanıtınızı bekliyorum", ex: "Looking forward to your reply on this matter.", exTr: "Bu konudaki yanıtınızı bekliyorum." },
      { en: "Should you have any questions…", tr: "Herhangi bir sorunuz olursa…", ex: "Should you have any questions, feel free to contact me.", exTr: "Herhangi bir sorunuz olursa benimle iletişime geçebilirsiniz." },
      { en: "I am writing to inform you that…", tr: "Bilginize sunmak isterim ki…", ex: "I am writing to inform you that the tooling is ready.", exTr: "Bilginize sunmak isterim ki takımlar hazır." },
      { en: "Per your request…", tr: "Talebiniz üzerine…", ex: "Per your request, we updated the drawing.", exTr: "Talebiniz üzerine resmi güncelledik." },
      { en: "Thank you for your patience", tr: "Sabrınız için teşekkür ederiz", ex: "Thank you for your patience during the investigation.", exTr: "İnceleme sürecindeki sabrınız için teşekkür ederiz." },
      { en: "Best regards / Kind regards", tr: "Saygılarımla", ex: "Best regards, Production Team.", exTr: "Saygılarımla, Üretim Ekibi." },
    ],
  },
];

const ALL_CARDS = DECKS.flatMap((d) => d.cards.map((c) => ({ ...c, deckId: d.id })));

/* ---------------------------------------------------------
   Storage helpers
--------------------------------------------------------- */
const PROGRESS_KEY = "shaft-eng:progress";

async function loadProgress() {
  try {
    const raw = window.localStorage.getItem(PROGRESS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
async function saveProgress(progress) {
  try {
    window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error("save failed", e);
  }
}

function cardKey(c) {
  return `${c.deckId}:${c.en}`;
}

/* ---------------------------------------------------------
   Blueprint grid background
--------------------------------------------------------- */
function BlueprintBG() {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage:
          "linear-gradient(rgba(79,163,199,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(79,163,199,0.10) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
        pointerEvents: "none",
      }}
    />
  );
}

/* ---------------------------------------------------------
   Main App
--------------------------------------------------------- */
export default function App() {
  const [progress, setProgress] = useState(null);
  const [view, setView] = useState("home");
  const [activeDeck, setActiveDeck] = useState(null);

  useEffect(() => {
    loadProgress().then(setProgress).catch(() => setProgress({}));
  }, []);

  const updateMastery = useCallback((card, known) => {
    setProgress((prev) => {
      const next = { ...(prev || {}) };
      const k = cardKey(card);
      const cur = next[k] || { seen: 0, known: 0 };
      next[k] = {
        seen: cur.seen + 1,
        known: known ? cur.known + 1 : Math.max(0, cur.known - 1),
        lastKnown: known,
      };
      saveProgress(next);
      return next;
    });
  }, []);

  const resetProgress = useCallback(() => {
    setProgress({});
    saveProgress({});
  }, []);

  const totalCards = ALL_CARDS.length;
  const masteredCount = useMemo(() => {
    if (!progress) return 0;
    return Object.values(progress).filter((p) => p.lastKnown).length;
  }, [progress]);

  if (progress === null) {
    return (
      <div style={styles.page}>
        <BlueprintBG />
        <div style={{ ...styles.center, color: "#4FA3C7", fontFamily: "IBM Plex Mono, monospace" }}>
          loading…
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <BlueprintBG />
      <div style={styles.content}>
        <Header masteredCount={masteredCount} totalCards={totalCards} onReset={resetProgress} view={view} />
        {view === "home" && (
          <Home
            onPickDeck={(deck, mode) => {
              setActiveDeck(deck);
              setView(mode);
            }}
            progress={progress}
          />
        )}
        {view === "study" && activeDeck && (
          <Study deck={activeDeck} onKnow={updateMastery} onExit={() => setView("home")} />
        )}
        {view === "quiz" && activeDeck && (
          <Quiz deck={activeDeck} onKnow={updateMastery} onExit={() => setView("home")} />
        )}
        <a
          href="https://www.instagram.com/arifcanbaz"
          target="_blank"
          rel="noopener noreferrer"
          style={styles.credit}
        >
          arifcanbaz tarafından yapılmıştır
        </a>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   Header
--------------------------------------------------------- */
function Header({ masteredCount, totalCards, onReset, view }) {
  const pct = Math.round((masteredCount / totalCards) * 100);
  return (
    <header style={styles.header}>
      <div>
        <div style={styles.eyebrow}>SHOP-FLOOR ENGLISH // REV. A</div>
        <h1 style={styles.h1}>
          Shaft Production <span style={{ color: "#FF6B35" }}>English Trainer</span>
        </h1>
        <div style={styles.subtitle}>Mail yazmak ve atölyede rahat anlaşmak için teknik İngilizce</div>
      </div>
      <div style={styles.headerRight}>
        <div style={styles.progressWrap}>
          <div style={styles.progressLabel}>
            MASTERED&nbsp;<span style={{ color: "#FF6B35" }}>{masteredCount}</span>/{totalCards}
          </div>
          <div style={styles.progressTrack}>
            <div style={{ ...styles.progressFill, width: `${pct}%` }} />
          </div>
        </div>
        {view === "home" && (
          <button onClick={onReset} style={styles.iconBtn} title="İlerlemeyi sıfırla">
            <RefreshCw size={14} />
          </button>
        )}
      </div>
    </header>
  );
}

/* ---------------------------------------------------------
   Home — deck picker
--------------------------------------------------------- */
function Home({ onPickDeck, progress }) {
  return (
    <div>
      <div style={styles.deckGrid}>
        {DECKS.map((deck, i) => {
          const Icon = deck.icon;
          const known = deck.cards.filter((c) => progress[cardKey({ ...c, deckId: deck.id })]?.lastKnown).length;
          return (
            <div key={deck.id} style={{ ...styles.deckCard, borderColor: deck.color + "55" }}>
              <div style={styles.deckCardTop}>
                <span style={{ ...styles.deckTag, color: deck.color, borderColor: deck.color + "66" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Icon size={20} color={deck.color} />
              </div>
              <h3 style={styles.deckTitle}>{deck.title}</h3>
              <p style={styles.deckSubtitle}>{deck.subtitle}</p>
              <div style={styles.deckMeta}>
                {deck.cards.length} terim · {known} öğrenildi
              </div>
              <div style={styles.deckBtnRow}>
                <button
                  style={{ ...styles.deckBtn, borderColor: deck.color, color: deck.color }}
                  onClick={() => onPickDeck(deck, "study")}
                >
                  Kartlarla Çalış <ChevronRight size={14} />
                </button>
                <button
                  style={{ ...styles.deckBtnFilled, background: deck.color }}
                  onClick={() => onPickDeck(deck, "quiz")}
                >
                  Test Et
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <footer style={styles.footNote}>
        <MessageSquareText size={14} color="#4FA3C7" style={{ marginRight: 6, verticalAlign: "-2px" }} />
        İpucu: önce "Kartlarla Çalış" ile kelimeleri öğren, sonra "Test Et" ile pekiştir. Kartta sırayla EN → TR + örnek → örneğin Türkçesi gelir.
      </footer>
    </div>
  );
}

/* ---------------------------------------------------------
   Study — flashcards (3-stage flip: EN -> TR+example -> example TR)
--------------------------------------------------------- */
function Study({ deck, onKnow, onExit }) {
  const [idx, setIdx] = useState(0);
  const [stage, setStage] = useState(0);
  const cards = deck.cards.map((c) => ({ ...c, deckId: deck.id }));
  const card = cards[idx];

  const go = (dir) => {
    setStage(0);
    setIdx((i) => (i + dir + cards.length) % cards.length);
  };

  const mark = (known) => {
    onKnow(card, known);
    go(1);
  };

  const handleFlip = () => setStage((s) => (s + 1) % 3);

  return (
    <div>
      <DeckBar deck={deck} onExit={onExit} idx={idx} total={cards.length} />
      <div style={styles.cardArea}>
        <div onClick={handleFlip} style={{ ...styles.flashcard, borderColor: deck.color + "66", cursor: "pointer" }}>
          {stage === 0 && (
            <>
              <div style={{ ...styles.flashEyebrow, color: deck.color }}>EN</div>
              <div style={styles.flashWord}>{card.en}</div>
              <div style={styles.flashHint}>kartı çevirmek için tıkla</div>
            </>
          )}
          {stage === 1 && (
            <>
              <div style={{ ...styles.flashEyebrow, color: deck.color }}>TR</div>
              <div style={styles.flashWordTr}>{card.tr}</div>
              <div style={styles.flashExample}>"{card.ex}"</div>
              <div style={styles.flashHint}>örneğin Türkçesini görmek için tekrar tıkla</div>
            </>
          )}
          {stage === 2 && (
            <>
              <div style={{ ...styles.flashEyebrow, color: deck.color }}>ÖRNEK · TR</div>
              <div style={styles.flashExampleTr}>{card.exTr}</div>
              <div style={styles.flashExampleSmall}>"{card.ex}"</div>
              <div style={styles.flashHint}>baştan başlamak için tekrar tıkla</div>
            </>
          )}
          <RotateCw size={16} color="#5b6b78" style={{ position: "absolute", top: 14, right: 14 }} />
          <div style={styles.stageDots}>
            {[0, 1, 2].map((s) => (
              <span key={s} style={{ ...styles.stageDot, background: s === stage ? deck.color : "#26404f" }} />
            ))}
          </div>
        </div>

        <div style={styles.navRow}>
          <button style={styles.navBtn} onClick={() => go(-1)}>
            <ChevronLeft size={18} />
          </button>
          <button style={{ ...styles.markBtn, borderColor: "#e0556055" }} onClick={() => mark(false)}>
            <X size={15} /> Bilmiyorum
          </button>
          <button style={{ ...styles.markBtn, borderColor: "#7FB06977" }} onClick={() => mark(true)}>
            <Check size={15} /> Biliyorum
          </button>
          <button style={styles.navBtn} onClick={() => go(1)}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   Quiz — multiple choice EN -> TR
--------------------------------------------------------- */
function buildQuestion(deck, exclude) {
  const cards = deck.cards.map((c) => ({ ...c, deckId: deck.id }));
  const pool = cards.filter((c) => c.en !== exclude?.en);
  const correct = cards[Math.floor(Math.random() * cards.length)];
  const distractors = [];
  const shuffledPool = [...pool].sort(() => Math.random() - 0.5);
  for (const c of shuffledPool) {
    if (c.en === correct.en) continue;
    if (!distractors.find((d) => d.tr === c.tr)) distractors.push(c);
    if (distractors.length === 3) break;
  }
  const options = [correct, ...distractors].sort(() => Math.random() - 0.5);
  return { correct, options };
}

function Quiz({ deck, onKnow, onExit }) {
  const [q, setQ] = useState(() => buildQuestion(deck, null));
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState({ right: 0, wrong: 0 });
  const [round, setRound] = useState(1);
  const TOTAL_ROUNDS = 10;

  const choose = (opt) => {
    if (selected) return;
    setSelected(opt);
    const isRight = opt.tr === q.correct.tr;
    setScore((s) => (isRight ? { ...s, right: s.right + 1 } : { ...s, wrong: s.wrong + 1 }));
    onKnow(q.correct, isRight);
  };

  const next = () => {
    if (round >= TOTAL_ROUNDS) return;
    setRound((r) => r + 1);
    setSelected(null);
    setQ(buildQuestion(deck, q.correct));
  };

  const finished = round >= TOTAL_ROUNDS && selected;

  return (
    <div>
      <DeckBar deck={deck} onExit={onExit} idx={round - 1} total={TOTAL_ROUNDS} />
      <div style={styles.quizArea}>
        {!finished ? (
          <>
            <div style={styles.quizPrompt}>
              <div style={{ ...styles.flashEyebrow, color: deck.color }}>Bu terimin Türkçesi nedir?</div>
              <div style={styles.quizWord}>{q.correct.en}</div>
            </div>
            <div style={styles.optionsGrid}>
              {q.options.map((opt, i) => {
                const isCorrect = opt.tr === q.correct.tr;
                const show = !!selected;
                let bg = "#101c28";
                let border = "#26404f";
                if (show && isCorrect) {
                  bg = "#1c3324";
                  border = "#7FB069";
                } else if (show && opt === selected && !isCorrect) {
                  bg = "#331c1f";
                  border = "#e05560";
                }
                return (
                  <button
                    key={i}
                    onClick={() => choose(opt)}
                    disabled={!!selected}
                    style={{ ...styles.optionBtn, background: bg, borderColor: border }}
                  >
                    {opt.tr}
                  </button>
                );
              })}
            </div>
            {selected && (
              <div style={styles.quizFooter}>
                <div style={styles.exampleNote}>"{q.correct.ex}" — {q.correct.exTr}</div>
                <button style={{ ...styles.nextBtn, background: deck.color }} onClick={next}>
                  {round >= TOTAL_ROUNDS ? "Sonuçları Gör" : "Sonraki"} <ChevronRight size={15} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div style={styles.resultBox}>
            <div style={{ ...styles.flashEyebrow, color: deck.color }}>SONUÇ</div>
            <div style={styles.resultScore}>
              {score.right} / {score.right + score.wrong}
            </div>
            <div style={styles.resultSub}>doğru cevap</div>
            <div style={styles.deckBtnRow}>
              <button
                style={{ ...styles.deckBtn, borderColor: deck.color, color: deck.color }}
                onClick={() => {
                  setRound(1);
                  setSelected(null);
                  setScore({ right: 0, wrong: 0 });
                  setQ(buildQuestion(deck, null));
                }}
              >
                Tekrar Dene <RotateCw size={14} />
              </button>
              <button style={{ ...styles.deckBtnFilled, background: deck.color }} onClick={onExit}>
                Decklere Dön
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   Shared deck bar
--------------------------------------------------------- */
function DeckBar({ deck, onExit, idx, total }) {
  return (
    <div style={styles.deckBar}>
      <button onClick={onExit} style={styles.backBtn}>
        <ChevronLeft size={14} /> Decklere Dön
      </button>
      <div style={{ ...styles.deckBarTitle, color: deck.color }}>{deck.title}</div>
      <div style={styles.deckBarCount}>
        {idx + 1} / {total}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   Styles
--------------------------------------------------------- */
const styles = {
  page: {
    position: "relative",
    minHeight: "100vh",
    background: "#0B1E2E",
    color: "#E8EEF2",
    fontFamily: "'Space Grotesk', 'Inter', system-ui, sans-serif",
    overflowX: "hidden",
  },
  center: { display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" },
  content: { position: "relative", zIndex: 1, maxWidth: 980, margin: "0 auto", padding: "28px 20px 60px" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: 16,
    borderBottom: "1px solid #1c3142",
    paddingBottom: 20,
    marginBottom: 26,
  },
  eyebrow: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 11,
    letterSpacing: "0.12em",
    color: "#4FA3C7",
    marginBottom: 8,
  },
  h1: { fontSize: 28, fontWeight: 700, margin: 0, lineHeight: 1.15, letterSpacing: "-0.01em" },
  subtitle: { fontSize: 13.5, color: "#8DA3B3", marginTop: 8, maxWidth: 420 },
  headerRight: { display: "flex", alignItems: "center", gap: 10 },
  progressWrap: { minWidth: 160 },
  progressLabel: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 11,
    color: "#8DA3B3",
    marginBottom: 6,
    letterSpacing: "0.04em",
  },
  progressTrack: { height: 6, background: "#16293a", borderRadius: 3, overflow: "hidden" },
  progressFill: { height: "100%", background: "linear-gradient(90deg,#FF6B35,#ffab7a)", borderRadius: 3, transition: "width .3s" },
  iconBtn: {
    background: "transparent",
    border: "1px solid #26404f",
    color: "#8DA3B3",
    borderRadius: 6,
    width: 30,
    height: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  deckGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 16 },
  deckCard: {
    background: "#0E2233",
    border: "1px solid",
    borderRadius: 10,
    padding: "18px 18px 16px",
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  deckCardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  deckTag: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 11,
    border: "1px solid",
    borderRadius: 4,
    padding: "2px 6px",
  },
  deckTitle: { fontSize: 17, margin: "2px 0 2px", fontWeight: 700 },
  deckSubtitle: { fontSize: 12.5, color: "#8DA3B3", margin: "0 0 8px" },
  deckMeta: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#5b7282", marginBottom: 14 },
  deckBtnRow: { display: "flex", gap: 8, marginTop: "auto" },
  deckBtn: {
    flex: 1,
    background: "transparent",
    border: "1px solid",
    borderRadius: 7,
    padding: "8px 10px",
    fontSize: 12.5,
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  deckBtnFilled: {
    flex: 1,
    border: "none",
    borderRadius: 7,
    padding: "8px 10px",
    fontSize: 12.5,
    fontWeight: 700,
    cursor: "pointer",
    color: "#0B1E2E",
  },
  footNote: { marginTop: 24, fontSize: 12.5, color: "#5b7282" },
  deckBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
    flexWrap: "wrap",
    gap: 10,
  },
  backBtn: {
    background: "transparent",
    border: "1px solid #26404f",
    color: "#8DA3B3",
    borderRadius: 7,
    padding: "6px 10px",
    fontSize: 12.5,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  deckBarTitle: { fontWeight: 700, fontSize: 14.5 },
  deckBarCount: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "#5b7282" },
  cardArea: { display: "flex", flexDirection: "column", alignItems: "center", gap: 22, marginTop: 10 },
  flashcard: {
    width: "100%",
    maxWidth: 460,
    minHeight: 230,
    background: "#0E2233",
    border: "1px solid",
    borderRadius: 14,
    padding: "30px 26px",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    gap: 10,
  },
  flashEyebrow: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: "0.12em" },
  flashWord: { fontSize: 26, fontWeight: 700 },
  flashWordTr: { fontSize: 24, fontWeight: 700 },
  flashExample: { fontSize: 13.5, color: "#8DA3B3", fontStyle: "italic", maxWidth: 360 },
  flashExampleTr: { fontSize: 18, fontWeight: 600, maxWidth: 380, lineHeight: 1.4 },
  flashExampleSmall: { fontSize: 12.5, color: "#5b7282", fontStyle: "italic", maxWidth: 360 },
  flashHint: { fontSize: 11.5, color: "#46606e" },
  stageDots: { display: "flex", gap: 5, position: "absolute", bottom: 14, left: "50%", transform: "translateX(-50%)" },
  stageDot: { width: 6, height: 6, borderRadius: "50%" },
  navRow: { display: "flex", gap: 10, alignItems: "center" },
  navBtn: {
    background: "transparent",
    border: "1px solid #26404f",
    color: "#8DA3B3",
    borderRadius: 8,
    width: 38,
    height: 38,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  markBtn: {
    background: "#0E2233",
    border: "1px solid",
    color: "#E8EEF2",
    borderRadius: 8,
    padding: "9px 14px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  quizArea: { display: "flex", flexDirection: "column", alignItems: "center", gap: 18, marginTop: 6 },
  quizPrompt: { textAlign: "center" },
  quizWord: { fontSize: 24, fontWeight: 700, marginTop: 6 },
  optionsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, width: "100%", maxWidth: 480 },
  optionBtn: {
    border: "1px solid",
    borderRadius: 9,
    padding: "14px 12px",
    fontSize: 14,
    color: "#E8EEF2",
    cursor: "pointer",
    textAlign: "center",
  },
  quizFooter: { display: "flex", flexDirection: "column", alignItems: "center", gap: 10, maxWidth: 480 },
  exampleNote: { fontSize: 12.5, color: "#8DA3B3", fontStyle: "italic", textAlign: "center" },
  nextBtn: {
    border: "none",
    borderRadius: 8,
    padding: "9px 16px",
    fontSize: 13,
    fontWeight: 700,
    color: "#0B1E2E",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  resultBox: { textAlign: "center" },
  resultScore: { fontSize: 42, fontWeight: 800, marginTop: 6 },
  resultSub: { fontSize: 13, color: "#8DA3B3", marginBottom: 16 },
  credit: {
    display: "block",
    textAlign: "center",
    marginTop: 40,
    fontSize: 12,
    color: "#5b7282",
    textDecoration: "none",
  },
};