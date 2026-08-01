import { useEffect, useMemo, useState } from 'react';
import { wedding } from './wedding.js';

const pad = (value) => String(value).padStart(2, '0');
const gallery = Array.from({ length: 6 }, (_, index) => `./images/gallery-${pad(index + 1)}.svg`);

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

function App() {
  const countdown = useCountdown(wedding.date);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('visible')),
      { threshold: 0.15 }
    );
    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const sections = [...document.querySelectorAll('main > section, main > footer')];
    let frameId;

    const updateSectionFade = () => {
      const fadeDistance = window.innerHeight * 0.42;

      sections.forEach((section) => {
        const { bottom } = section.getBoundingClientRect();
        const opacity = Math.min(1, Math.max(0, bottom / fadeDistance));
        section.style.setProperty('--scroll-opacity', opacity.toFixed(3));
        section.style.setProperty('--scroll-scale', (0.985 + opacity * 0.015).toFixed(4));
      });
      frameId = undefined;
    };

    const requestUpdate = () => {
      if (!frameId) frameId = window.requestAnimationFrame(updateSectionFade);
    };

    sections.forEach((section) => section.classList.add('scroll-fade'));
    updateSectionFade();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
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
    <main>
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
        <div className="gallery reveal">
          {gallery.map((src, index) => (
            <figure className={index === 0 ? 'gallery-featured' : ''} key={src}>
              <img src={src} alt={`웨딩 사진 ${index + 1}`} loading={index > 1 ? 'lazy' : 'eager'} />
            </figure>
          ))}
        </div>
        <p className="gallery-note reveal">우리의 소중한 순간을 담았습니다.</p>
      </section>

      <section className="calendar-section section">
        <SectionTitle eyebrow="THE WEDDING DAY">2026. 10. 24</SectionTitle>
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
              <span key={`${day}-${index}`} className={day === 24 ? 'wedding-day' : ''}>
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
          <img className="venue-map" src="./images/tanibay-map-final.png" alt="타니베이 호텔 약도: 일산해수욕장 앞 해수욕장5길 43" />
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

        <div className="access-summary reveal">
          <div>
            <span>AIR</span>
            <strong>김포공항 → 울산공항</strong>
            <small>약 45분</small>
          </div>
          <div>
            <span>KTX</span>
            <strong>서울역 → 울산역</strong>
            <small>약 2시간 20분</small>
          </div>
        </div>

        <div className="access-group reveal">
          <div className="access-heading">
            <span>01</span>
            <div>
              <small>BY CAR</small>
              <h3>차량으로 오시는 경우</h3>
            </div>
          </div>
          <ul className="access-list car-list">
            <li>
              <strong>울산공항</strong>
              <p>아산로 경유 · 15km</p>
              <em>약 20분</em>
            </li>
            <li>
              <strong>태화강역</strong>
              <p>아산로 경유 · 11km</p>
              <em>약 15분</em>
            </li>
            <li>
              <strong>울산역(KTX)</strong>
              <p>울밀로 경유 · 33km</p>
              <em>약 50분</em>
            </li>
          </ul>
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
        <SectionTitle eyebrow="CONTACT">마음을 전하는 곳</SectionTitle>
        <p className="contact-copy reveal">
          멀리서도 축하의 마음을 전해주시는
          <br />
          모든 분께 깊이 감사드립니다.
        </p>
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
