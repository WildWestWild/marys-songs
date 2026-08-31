"use client";

import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { ArrowLeft, ArrowRight, ExternalLink, Pause, Play, Quote, Sparkles } from "lucide-react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const asset = (path: string) => `${basePath}${path}`;

const themes = [
  { id: "velvet", number: "01", name: "Velvet Cinema", type: "Киноистория", swatch: ["#47111d", "#d6a082"] },
  { id: "nordic", number: "02", name: "Nordic Letter", type: "Журнал", swatch: ["#e7e2d7", "#2e433c"] },
  { id: "midnight", number: "03", name: "Midnight Glass", type: "Digital stage", swatch: ["#080a13", "#8176bf"] },
  { id: "thread", number: "04", name: "Red Thread", type: "Арт-постер", swatch: ["#eee9df", "#d72c22"] },
  { id: "blue", number: "05", name: "Blue Hour", type: "Dream pop", swatch: ["#122c4b", "#a4c9d9"] },
] as const;

const songs = [
  {
    id: "piece",
    number: "01",
    title: "Пьеса",
    artist: "Mary",
    eyebrow: "Акт I · роли и недосказанность",
    statement: "Если историю нельзя завершить, её превращают в пьесу.",
    description: "Музыкант и поэтесса остаются героями общего сюжета: главные слова почти произнесены, но страх всё ещё прячется в паузах. Визуал строится как сцена после спектакля.",
    tags: ["театр", "пауза", "двое"],
    audio: asset("/tracks/mary-piesa.mp3"),
    image: asset("/mary-piesa-portrait-down.jpg"),
    imagePosition: "50% 24%",
    yandex: "https://music.yandex.ru/album/37510352/track/141214890",
  },
  {
    id: "greeting",
    number: "02",
    title: "Твой привет",
    artist: "Mary",
    eyebrow: "Акт II · знак сквозь снег",
    statement: "Один короткий знак — и прошлое возвращается снегом.",
    description: "Героиня пытается уйти, сохранить себя и отпустить другую жизнь. Но редкий привет снова приближает человека, которого невозможно заменить, — почти встреча, в которую трудно поверить.",
    tags: ["снег", "сигнал", "возвращение"],
    audio: asset("/tracks/mary-tvoy-privet.mp3"),
    image: asset("/tvoy-privet-bg.png"),
    imagePosition: "center center",
    yandex: "https://music.yandex.ru/search?text=%D0%9C%D1%8D%D1%80%D0%B8%20%D0%A2%D0%B2%D0%BE%D0%B9%20%D0%BF%D1%80%D0%B8%D0%B2%D0%B5%D1%82",
  },
  {
    id: "needed",
    number: "03",
    title: "Нужен",
    artist: "Mary",
    eyebrow: "Акт III · сила притяжения",
    statement: "Эксперимент становится единственной необходимостью.",
    description: "Обаятельный импульс превращается в яркую, наивную и почти опасную близость. Здесь любовь — магнитное поле: хочется отдать душу и признать, что нужен только один человек.",
    tags: ["притяжение", "уязвимость", "пульс"],
    audio: asset("/tracks/mary-nuzhen.mp3"),
    image: asset("/nuzhen-bg.png"),
    imagePosition: "center center",
    yandex: "https://music.yandex.ru/search?text=%D0%9C%D1%8D%D1%80%D0%B8%20%D0%9D%D1%83%D0%B6%D0%B5%D0%BD",
  },
  {
    id: "release",
    number: "04",
    title: "Отпускай",
    artist: "Mary",
    eyebrow: "Акт IV · воздух после точки",
    statement: "Иногда любовь остаётся случайным сном — и просит отпустить.",
    description: "Старый сюжет возвращается ненадолго, чтобы раствориться между строк. Повтор становится внутренним решением: забывать не из холода, а чтобы наконец освободить пространство для света.",
    tags: ["ветер", "между строк", "свобода"],
    audio: asset("/tracks/mary-otpuskay.mp3"),
    image: asset("/otpuskay-bg.png"),
    imagePosition: "center center",
    yandex: "https://music.yandex.ru/search?text=%D0%9C%D1%8D%D1%80%D0%B8%20%D0%9E%D1%82%D0%BF%D1%83%D1%81%D0%BA%D0%B0%D0%B9",
  },
] as const;

type Song = (typeof songs)[number];

function formatTime(value: number) {
  if (!Number.isFinite(value)) return "0:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function TrackPlayer({ song }: { song: Song }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const syncTime = () => setCurrentTime(audio.currentTime);
    const syncDuration = () => setDuration(audio.duration || 0);
    const syncPause = () => setPlaying(false);
    const stopOthers = (event: Event) => {
      const playerEvent = event as CustomEvent<string>;
      if (playerEvent.detail !== song.id) audio.pause();
    };
    const stopAll = () => audio.pause();

    audio.addEventListener("timeupdate", syncTime);
    audio.addEventListener("loadedmetadata", syncDuration);
    audio.addEventListener("durationchange", syncDuration);
    audio.addEventListener("pause", syncPause);
    audio.addEventListener("ended", syncPause);
    window.addEventListener("mary-player-play", stopOthers);
    window.addEventListener("mary-player-stop", stopAll);

    return () => {
      audio.removeEventListener("timeupdate", syncTime);
      audio.removeEventListener("loadedmetadata", syncDuration);
      audio.removeEventListener("durationchange", syncDuration);
      audio.removeEventListener("pause", syncPause);
      audio.removeEventListener("ended", syncPause);
      window.removeEventListener("mary-player-play", stopOthers);
      window.removeEventListener("mary-player-stop", stopAll);
    };
  }, [song.id]);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) {
      audio.pause();
      return;
    }
    window.dispatchEvent(new CustomEvent("mary-player-play", { detail: song.id }));
    try {
      await audio.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  };

  const seek = (event: ChangeEvent<HTMLInputElement>) => {
    const nextTime = Number(event.target.value);
    if (audioRef.current) audioRef.current.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  return (
    <div className="track-widget">
      <audio ref={audioRef} src={song.audio} preload="metadata" />
      <button className="play-button" type="button" onClick={togglePlayback} aria-label={playing ? `Пауза — ${song.title}` : `Слушать — ${song.title}`}>
        {playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
      </button>
      <div className="player-copy">
        <div className="player-heading">
          <span><Sparkles aria-hidden="true" /> {song.artist}</span>
          <strong>{song.title}</strong>
        </div>
        <div className="timeline">
          <input
            type="range"
            min="0"
            max={duration || 0}
            step="0.1"
            value={Math.min(currentTime, duration || 0)}
            onChange={seek}
            aria-label={`Позиция воспроизведения — ${song.title}`}
            style={{ "--progress": `${duration ? (currentTime / duration) * 100 : 0}%` } as CSSProperties}
          />
          <span>{formatTime(currentTime)} <i>/</i> {formatTime(duration)}</span>
        </div>
      </div>
      <a className="stream-link" href={song.yandex} target="_blank" rel="noreferrer">
        Яндекс Музыка <ExternalLink aria-hidden="true" />
      </a>
    </div>
  );
}

export default function Home() {
  const [theme, setTheme] = useState<(typeof themes)[number]["id"]>("velvet");
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    return () => { api.off("select", onSelect); };
  }, [api]);

  useEffect(() => {
    window.dispatchEvent(new Event("mary-player-stop"));
  }, [current]);

  const activeTheme = themes.find((item) => item.id === theme) ?? themes[0];
  const activeSong = songs[current] ?? songs[0];

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    event.currentTarget.style.setProperty("--parallax-x", `${x * 18}px`);
    event.currentTarget.style.setProperty("--parallax-y", `${y * 14}px`);
    event.currentTarget.style.setProperty("--copy-x", `${x * -7}px`);
    event.currentTarget.style.setProperty("--copy-y", `${y * -5}px`);
    event.currentTarget.style.setProperty("--pointer-x", `${(x + 0.5) * 100}%`);
    event.currentTarget.style.setProperty("--pointer-y", `${(y + 0.5) * 100}%`);
  };

  const resetPointer = (event: ReactPointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty("--parallax-x", "0px");
    event.currentTarget.style.setProperty("--parallax-y", "0px");
    event.currentTarget.style.setProperty("--copy-x", "0px");
    event.currentTarget.style.setProperty("--copy-y", "0px");
  };

  return (
    <main className={`music-site theme-${theme} scene-${activeSong.id}`}>
      <section className="concept-dock" aria-label="Выбор дизайн-концепции">
        <div className="dock-intro"><span>Сравнение</span><strong>5 концепций сайта</strong></div>
        <Tabs value={theme} onValueChange={(value) => setTheme(value as (typeof themes)[number]["id"])}>
          <TabsList className="theme-tabs" aria-label="Шаблоны сайта">
            {themes.map((item) => (
              <TabsTrigger key={item.id} value={item.id} className="theme-tab">
                <span className="swatch" style={{ background: `linear-gradient(135deg, ${item.swatch[0]} 50%, ${item.swatch[1]} 50%)` }} />
                <span className="tab-copy"><small>{item.number}</small><b>{item.name}</b></span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </section>

      <section className="experience" onPointerMove={handlePointerMove} onPointerLeave={resetPointer}>
        <div key={`${theme}-${activeSong.id}`} className="transition-veil" aria-hidden="true" />
        <div className="motion-layer" aria-hidden="true">
          <div className="motion-grid" /><div className="motion-scan" />
          <div className="motion-marquee">
            <span>MARY · {activeSong.title} · MARY · {activeSong.title} ·&nbsp;</span>
            <span>MARY · {activeSong.title} · MARY · {activeSong.title} ·&nbsp;</span>
          </div>
        </div>
        <header className="site-header">
          <a className="artist-mark" href="#music" aria-label="Mary — к музыке">Mary<span>.</span></a>
          <div className="concept-meta"><span>{activeTheme.number}</span><span>{activeTheme.name}</span><i>{activeTheme.type}</i></div>
        </header>

        <Carousel setApi={setApi} opts={{ loop: true, duration: 38 }} className="world-carousel" id="music">
          <CarouselContent className="world-track">
            {songs.map((song) => (
              <CarouselItem className="world-slide" key={song.id}>
                <article className={`song-world song-${song.id}`}>
                  <div className="visual-stage" aria-hidden="true">
                    <div className="portrait-frame">
                      <img className="portrait" src={song.image} alt="" style={{ objectPosition: song.imagePosition }} />
                      <div className="image-wash" />
                    </div>
                    <div className="scene-orbit" /><div className="scene-line line-one" /><div className="scene-line line-two" />
                    <span className="ghost-title">{song.title}</span>
                  </div>

                  <div className="song-copy">
                    <div className="song-index"><span>{song.number}</span><i>—</i><span>0{songs.length}</span></div>
                    <p className="song-eyebrow">{song.eyebrow}</p>
                    <h1>{song.title}</h1>
                    <div className="statement"><Quote aria-hidden="true" /><p>{song.statement}</p></div>
                    <p className="song-description">{song.description}</p>
                    <div className="mood-tags" aria-label="Образы песни">
                      {song.tags.map((tag) => <span key={tag}>{tag}</span>)}
                    </div>
                    <div className="player-zone"><TrackPlayer song={song} /></div>
                  </div>
                </article>
              </CarouselItem>
            ))}
          </CarouselContent>

          <button className="edge-arrow edge-prev" type="button" onClick={() => api?.scrollPrev()} aria-label="Предыдущий трек">
            <ArrowLeft aria-hidden="true" /><span>Назад</span>
          </button>
          <button className="edge-arrow edge-next" type="button" onClick={() => api?.scrollNext()} aria-label="Следующий трек">
            <span>Далее</span><ArrowRight aria-hidden="true" />
          </button>
        </Carousel>

        <footer className="track-rail">
          <span className="rail-label">Песни</span>
          <div className="track-links">
            {songs.map((song, index) => (
              <button key={song.id} className={index === current ? "active" : ""} type="button" onClick={() => api?.scrollTo(index)} aria-current={index === current ? "true" : undefined}>
                <small>{song.number}</small><span>{song.title}</span>
              </button>
            ))}
          </div>
          <span className="swipe-hint">Листайте экран →</span>
        </footer>
      </section>
    </main>
  );
}
