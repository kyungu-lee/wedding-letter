import { useEffect, useMemo, useRef, useState } from 'react';
import { wedding } from './wedding.js';

const pad = (value) => String(value).padStart(2, '0');
const imagePath = (filename) => `${import.meta.env.BASE_URL}images/${filename}`;
const gallery = [
  'gallery_1.jpg',
  'gallery_2.jpg',
  'gallery_3.jpg',
  'gallery_4.jpg',
  'gallery_5.jpg',
  'gallery_6.jpg',
  'gallery_7.jpg',
  'gallery_8.jpg',
  'gallery_9.jpg',
  'gallery_10.jpg',
  'gallery_11.jpg',
  'gallery_12.jpg',
  'gallery_13.jpg',
  'gallery_14.jpg',
  'gallery_15.jpeg',
  'gallery_16.jpg',
].map((filename) => `${imagePath(`gallery-web/${filename}`)}?v=20260802-2`);

function useCountdown(date) {
  const [distance, setDistance] = useState(() => Math.max(0, new Date(date).getTime() - Date.now()));

  useEffect(() => {
    const update = () => setDistance(Math.max(0, new Date(date).getTime() - Date.now()));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [date]);

  return useMemo(
    () => ({
      days: Math.floor(distance / 86400000),
      hours: Math.floor((distance / 3600000) % 24),
      minutes: Math.floor((distance / 60000) % 60),
      seconds: Math.floor((distance / 1000) % 60),
    }),
    [distance]
  );
}

function SectionTitle({ eyebrow, children }) {
  return (
    <header className="section-title reveal">
      <span>{eyebrow}</span>
      <h2>{children}</h2>
    </header>
  );
}

function AccountCard({ account }) {
  const hasAccount = account.bank && account.number;

  const copyAccount = async () => {
    if (!hasAccount) return;
    await navigator.clipboard.writeText(account.number);
    window.alert('계좌번호를 복사했습니다.');
  };

  return (
    <article className="account-card">
      <div className="account-person">
        <span>{account.relation}</span>
        <strong>{account.name}</strong>
      </div>
      {hasAccount ? (
        <button className="account-number" onClick={copyAccount} aria-label={`${account.name} 계좌번호 복사`}>
          <span>
            <small>{account.bank}</small>
            <b>{account.number}</b>
          </span>
          <i aria-hidden="true" />
          <em>복사</em>
        </button>
      ) : (
        <p className="account-pending">계좌 정보는 추후 안내드릴 예정입니다.</p>
      )}
    </article>
  );
}

function App({ variant }) {
  const countdown = useCountdown(wedding.date);
  const [openAccountSide, setOpenAccountSide] = useState(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const thumbnailStripRef = useRef(null);
  const showPreviousPhoto = () => setGalleryIndex((index) => (index - 1 + gallery.length) % gallery.length);
  const showNextPhoto = () => setGalleryIndex((index) => (index + 1) % gallery.length);
  const galleryStyle = variant === 'test1' ? 'editorial' : variant === 'test3' ? 'masonry' : 'story';
  const showAccounts = variant !== 'test3';

  useEffect(() => {
    if (galleryStyle !== 'story') return;
    const activeThumbnail = thumbnailStripRef.current?.querySelector('[aria-current="true"]');
    activeThumbnail?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [galleryIndex, galleryStyle]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.target.classList.toggle('visible', entry.isIntersecting)),
      { threshold: 0.15 }
    );
    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const copyAddress = async () => {
    await navigator.clipboard.writeText(wedding.address);
    window.alert('주소를 복사했습니다.');
  };

  const share = async () => {
    const data = { title: document.title, text: `${wedding.groom.name} ♥ ${wedding.bride.name} 결혼식에 초대합니다.`, url: window.location.href };
    if (navigator.share) await navigator.share(data);
    else {
      await navigator.clipboard.writeText(window.location.href);
      window.alert('청첩장 주소를 복사했습니다.');
    }
  };

  return (
    <main className={`design-${variant}`}>
      <section className="hero">
        <div className="hero-art" aria-hidden="true">
          <div className="sun" />
          <div className="stem stem-one" />
          <div className="stem stem-two" />
        </div>
        <p className="hero-kicker">WE ARE GETTING MARRIED</p>
        <div className="hero-names">
          <h1>{wedding.groom.firstName}</h1>
          <span>&</span>
          <h1>{wedding.bride.firstName}</h1>
        </div>
        <div className="hero-rule" />
        <p className="hero-date">{wedding.dateLabel}</p>
        <p className="hero-venue">{wedding.venue}</p>
        <span className="scroll-hint">SCROLL</span>
      </section>

      <section className="invitation section">
        <SectionTitle eyebrow="INVITATION">소중한 분들을 초대합니다</SectionTitle>
        <div className="message reveal">
          {wedding.message.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <div className="family reveal">
          <p>
            <span>
              {wedding.groom.father} · {wedding.groom.mother}
            </span>
            의 {wedding.groom.relation} <strong>{wedding.groom.name}</strong>
          </p>
          <p>
            <span>
              {wedding.bride.father} · {wedding.bride.mother}
            </span>
            의 {wedding.bride.relation} <strong>{wedding.bride.name}</strong>
          </p>
        </div>
      </section>

      <section className="gallery-section section">
        <SectionTitle eyebrow="OUR MOMENTS">우리의 빛나는 순간</SectionTitle>
        {galleryStyle === 'editorial' ? (
          <div className="gallery-editorial reveal">
            {gallery.map((src, index) => (
              <figure className={`editorial-photo editorial-photo-${index + 1}`} key={src}>
                <img src={src} alt={`웨딩 사진 ${index + 1}`} loading={index > 1 ? 'lazy' : 'eager'} />
              </figure>
            ))}
          </div>
        ) : galleryStyle === 'masonry' ? (
          <div className="gallery-masonry reveal">
            {gallery.map((src, index) => (
              <figure className={index === 0 || index === gallery.length - 1 ? 'gallery-wide' : ''} key={src}>
                <img src={src} alt={`웨딩 사진 ${index + 1}`} loading={index > 1 ? 'lazy' : 'eager'} />
              </figure>
            ))}
          </div>
        ) : (
          <div className="gallery-story reveal" aria-roledescription="carousel" aria-label="웨딩 사진 갤러리">
            <figure className="gallery-slide" key={gallery[galleryIndex]}>
              <img src={gallery[galleryIndex]} alt={`웨딩 사진 ${galleryIndex + 1}`} />
            </figure>
            <div className="gallery-controls">
              <button className="gallery-arrow" onClick={showPreviousPhoto} aria-label="이전 사진">
                <span aria-hidden="true">←</span>
              </button>
              <p aria-live="polite">
                <strong>{pad(galleryIndex + 1)}</strong>
                <span> / {pad(gallery.length)}</span>
              </p>
              <button className="gallery-arrow" onClick={showNextPhoto} aria-label="다음 사진">
                <span aria-hidden="true">→</span>
              </button>
            </div>
            <div className="gallery-thumbnails" aria-label="사진 선택" ref={thumbnailStripRef}>
              {gallery.map((src, index) => (
                <button
                  className={index === galleryIndex ? 'active' : ''}
                  onClick={() => setGalleryIndex(index)}
                  aria-label={`${index + 1}번 사진 보기`}
                  aria-current={index === galleryIndex ? 'true' : undefined}
                  key={src}
                >
                  <img src={src} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          </div>
        )}
        <p className="gallery-note reveal">우리의 소중한 순간을 담았습니다.</p>
      </section>

      <section className="calendar-section section">
        <SectionTitle eyebrow="THE WEDDING DAY">2026. 10. 10</SectionTitle>
        <div className="calendar reveal">
          <div className="week">
            {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className="days">
            {[
              null,
              null,
              null,
              null,
              1,
              2,
              3,
              4,
              5,
              6,
              7,
              8,
              9,
              10,
              11,
              12,
              13,
              14,
              15,
              16,
              17,
              18,
              19,
              20,
              21,
              22,
              23,
              24,
              25,
              26,
              27,
              28,
              29,
              30,
              31,
            ].map((day, index) => (
              <span
                key={`${day}-${index}`}
                className={[day === 10 && 'wedding-day', [5, 9].includes(day) && 'holiday'].filter(Boolean).join(' ')}
              >
                {day}
              </span>
            ))}
          </div>
        </div>
        <p className="d-day reveal">{wedding.groom.firstName} ♥ {wedding.bride.firstName}의 결혼식까지</p>
        <div className="countdown reveal">
          {Object.entries(countdown).map(([label, value]) => (
            <div key={label}>
              <strong>{pad(value)}</strong>
              <span>{label.toUpperCase()}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="location section">
        <SectionTitle eyebrow="LOCATION">오시는 길</SectionTitle>
        <div className="venue-card reveal">
          <img className="venue-map" src={imagePath('final-map.png')} alt="타니베이 호텔 약도: 일산해수욕장 앞 해수욕장5길 43" />
          <div className="venue-info">
            <h3>{wedding.venue}</h3>
            <p>{wedding.address}</p>
            <div className="buttons">
              <a href={wedding.naverMapUrl} target="_blank" rel="noreferrer">
                네이버 지도
              </a>
              <a href={wedding.kakaoMapUrl} target="_blank" rel="noreferrer">
                카카오 지도
              </a>
              <button onClick={copyAddress}>주소 복사</button>
            </div>
          </div>
        </div>
      </section>

      <section className="access section">
        <SectionTitle eyebrow="TRANSPORTATION">교통 안내</SectionTitle>

        <div className="access-group reveal">
          <div className="access-heading">
            <span>01</span>
            <div>
              <small>BY CAR</small>
              <h3>차량으로 오시는 경우</h3>
            </div>
          </div>
          <p className="parking-notice">예식 당일 호텔 주차장 또는 별관 주차장을 무료로 이용하실 수 있습니다.</p>
        </div>

        <div className="access-group reveal">
          <div className="access-heading">
            <span>02</span>
            <div>
              <small>BY BUS</small>
              <h3>대중교통으로 오시는 길</h3>
            </div>
          </div>
          <ul className="access-list bus-list">
            <li>
              <strong>시외·고속버스 터미널</strong>
              <p>
                <b>1411</b> 휴먼시아아파트 하차 <i>도보 372m</i>
              </p>
              <p>
                <b>134 · 711 · 1134 · 731</b> 일산해수욕장 하차 <i>도보 663m</i>
              </p>
            </li>
            <li>
              <strong>울산역(KTX)</strong>
              <p>
                <b>급행 5002</b> 일산해수욕장 하차 <i>도보 810m</i>
              </p>
            </li>
            <li>
              <strong>울산공항</strong>
              <p>
                <b>112 · 122 · 142</b> 대왕암공원입구 하차 <i>도보 663m</i>
              </p>
            </li>
          </ul>
        </div>

        <p className="access-note reveal">교통 상황에 따라 소요 시간이 달라질 수 있습니다.</p>
      </section>

      <section className="contact section">
        <SectionTitle eyebrow="CONTACT">{showAccounts ? '마음을 전하는 곳' : '연락처'}</SectionTitle>
        {showAccounts && (
          <>
            <p className="contact-copy reveal">
              멀리서도 축하의 마음을 전해주시는
              <br />
              모든 분께 깊이 감사드립니다.
            </p>
            <div className="account-accordions reveal">
              {[
                { key: 'groom', label: '신랑측에게', accounts: wedding.accounts.groom },
                { key: 'bride', label: '신부측에게', accounts: wedding.accounts.bride },
              ].map(({ key, label, accounts }) => {
                const isOpen = openAccountSide === key;
                return (
                  <div className={`account-accordion ${isOpen ? 'open' : ''}`} key={key}>
                    <button
                      className="account-toggle"
                      onClick={() => setOpenAccountSide(isOpen ? null : key)}
                      aria-expanded={isOpen}
                      aria-controls={`${key}-accounts`}
                    >
                      <span>{label}</span>
                      <i aria-hidden="true" />
                    </button>
                    <div className="account-list" id={`${key}-accounts`} aria-hidden={!isOpen}>
                      <div className="account-list-content">
                        {accounts.map((account) => <AccountCard account={account} key={account.relation} />)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
        <div className="contact-row reveal">
          <a href={`tel:${wedding.groom.phone}`}>신랑에게 연락하기</a>
          <a href={`tel:${wedding.bride.phone}`}>신부에게 연락하기</a>
        </div>
      </section>

      <footer>
        <p className="footer-names">
          {wedding.groom.firstName} <i>and</i> {wedding.bride.firstName}
        </p>
        <p>함께해 주셔서 감사합니다.</p>
        <button className="share" onClick={share}>
          청첩장 공유하기
        </button>
      </footer>
    </main>
  );
}

export default App;
