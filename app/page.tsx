"use client";

import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { ArrowLeft, ArrowRight, ExternalLink, Pause, Play } from "lucide-react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const asset = (path: string) => `${basePath}${path}`;
const laptopMediaQuery = "(min-width: 761px) and (max-width: 1728px) and (hover: hover) and (pointer: fine)";

const serviceLinks = [
  {
    id: "yandex",
    name: "Яндекс Музыка",
    href: "https://music.yandex.ru/artist/23938502?ref_id=35723D07-63E3-42C5-869A-6D24F4D46D6D&utm_medium=copy_link",
    iconPath: "M13.62 0.09 14.08 0 16.42 5.30 18.50 1.80 18.86 1.98 18.32 6.29 21.74 4.67 22.02 5.03 19.76 8.09 23.73 8.72 23.73 9.26 20.12 10.07 24 12.94 24 13.48 19.58 11.78 22.83 17.62 22.47 18.07 18.41 13.39 19.49 21.30 19.04 21.84 16.33 13.93 11.82 24 11.37 24 13.62 13.30 2.26 19.42 1.89 18.88 11.37 10.97 0 9.71 0.09 9.08 11.10 8.18 3.07 3.69 3.43 3.24 12.45 6.20 7.85 0.63 8.30 0.36 14.26 5.12Z",
  },
  {
    id: "spotify",
    name: "Spotify",
    href: "https://open.spotify.com/artist/46UBpGtsar0BKo17LhRRPD?si=tZ0wa_UdTwSdbSIOhT5kiw&utm_source=copy-link",
    iconPath: "M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z",
  },
  {
    id: "apple",
    name: "Apple Music",
    href: "https://music.apple.com/ru/artist/%D0%BC%D1%8D%D1%80%D0%B8/1801918108",
    iconPath: "M23.994 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 00-1.877-.726 10.496 10.496 0 00-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026-.747.043-1.49.123-2.193.4-1.336.53-2.3 1.452-2.865 2.78-.192.448-.292.925-.363 1.408-.056.392-.088.785-.1 1.18 0 .032-.007.062-.01.093v12.223c.01.14.017.283.027.424.05.815.154 1.624.497 2.373.65 1.42 1.738 2.353 3.234 2.801.42.127.856.187 1.293.228.555.053 1.11.06 1.667.06h11.03a12.5 12.5 0 001.57-.1c.822-.106 1.596-.35 2.295-.81a5.046 5.046 0 001.88-2.207c.186-.42.293-.87.37-1.324.113-.675.138-1.358.137-2.04-.002-3.8 0-7.595-.003-11.393zm-6.423 3.99v5.712c0 .417-.058.827-.244 1.206-.29.59-.76.962-1.388 1.14-.35.1-.706.157-1.07.173-.95.045-1.773-.6-1.943-1.536a1.88 1.88 0 011.038-2.022c.323-.16.67-.25 1.018-.324.378-.082.758-.153 1.134-.24.274-.063.457-.23.51-.516a.904.904 0 00.02-.193c0-1.815 0-3.63-.002-5.443a.725.725 0 00-.026-.185c-.04-.15-.15-.243-.304-.234-.16.01-.318.035-.475.066-.76.15-1.52.303-2.28.456l-2.325.47-1.374.278c-.016.003-.032.01-.048.013-.277.077-.377.203-.39.49-.002.042 0 .086 0 .13-.002 2.602 0 5.204-.003 7.805 0 .42-.047.836-.215 1.227-.278.64-.77 1.04-1.434 1.233-.35.1-.71.16-1.075.172-.96.036-1.755-.6-1.92-1.544-.14-.812.23-1.685 1.154-2.075.357-.15.73-.232 1.108-.31.287-.06.575-.116.86-.177.383-.083.583-.323.6-.714v-.15c0-2.96 0-5.922.002-8.882 0-.123.013-.25.042-.37.07-.285.273-.448.546-.518.255-.066.515-.112.774-.165.733-.15 1.466-.296 2.2-.444l2.27-.46c.67-.134 1.34-.27 2.01-.403.22-.043.442-.088.663-.106.31-.025.523.17.554.482.008.073.012.148.012.223.002 1.91.002 3.822 0 5.732z",
  },
  {
    id: "telegram",
    name: "Telegram",
    href: "https://t.me/marymusicru",
    iconPath: "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z",
  },
] as const;

const songs = [
  {
    id: "piece",
    number: "01",
    title: "Пьеса",
    artist: "Мэри",
    eyebrow: "Увертюра · роли и недосказанность",
    statement: "Когда историю нельзя завершить, её можно превратить в пьесу",
    description: "Поток чувств, который сложно пережить в моменте, растекается мыслями уже после основного действа. Лучше много не думать, а все превратить в пьесу.",
    audio: asset("/tracks/mary-piesa.mp3"),
    image: asset("/mary-piesa-portrait-down.jpg"),
    imagePosition: "50% 24%",
    yandex: "https://music.yandex.ru/album/37510352/track/141214890?utm_source=web&utm_medium=copy_link",
  },
  {
    id: "needed",
    number: "02",
    title: "Нужен",
    artist: "Мэри",
    eyebrow: "Акт I · сила притяжения",
    statement: "Эксперимент становится необходимостью",
    description: "Импульс превращается в наивную и почти опасную близость, когда невозможно не признать, что нужен только один человек.",
    audio: asset("/tracks/mary-nuzhen.mp3"),
    image: asset("/nuzhen-bg.png"),
    imagePosition: "center center",
    yandex: "https://music.yandex.ru/album/35465280/track/136262659?utm_source=web&utm_medium=copy_link",
  },
  {
    id: "release",
    number: "03",
    title: "Отпускай",
    artist: "Мэри",
    eyebrow: "Акт II · воздух после точки",
    statement: "Забывай...",
    description: "Когда не за что больше держаться, то выход только один.",
    audio: asset("/tracks/mary-otpuskay.mp3"),
    image: asset("/otpuskay-sky-grouse.png"),
    imagePosition: "72% center",
    yandex: "https://music.yandex.ru/album/35465280/track/136262660?utm_source=web&utm_medium=copy_link",
  },
  {
    id: "greeting",
    number: "04",
    title: "Твой привет",
    artist: "Мэри",
    eyebrow: "Акт III · Прошлое всегда с тобой",
    statement: "Один знак — и прошлое возвращается",
    description: "Можно уйти в другую жизнь и сохранить себя, но мысли снова будут приближать другого человека, которого невозможно заменить, — почти встреча, в которую трудно поверить.",
    audio: asset("/tracks/mary-tvoy-privet.mp3"),
    image: asset("/tvoy-privet-bg-detail.png"),
    imagePosition: "center center",
    yandex: "https://music.yandex.ru/album/35465280/track/136262661?utm_source=web&utm_medium=copy_link",
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
          <span>{song.artist}</span>
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
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [isLaptopMode, setIsLaptopMode] = useState(false);
  const experienceRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia(laptopMediaQuery);
    const syncLaptopMode = () => setIsLaptopMode(mediaQuery.matches);

    syncLaptopMode();
    mediaQuery.addEventListener("change", syncLaptopMode);
    return () => mediaQuery.removeEventListener("change", syncLaptopMode);
  }, []);

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

  useEffect(() => {
    if (!isLaptopMode || !experienceRef.current) return;
    experienceRef.current.style.setProperty("--parallax-x", "0px");
    experienceRef.current.style.setProperty("--parallax-y", "0px");
    experienceRef.current.style.setProperty("--copy-x", "0px");
    experienceRef.current.style.setProperty("--copy-y", "0px");
    experienceRef.current.style.setProperty("--pointer-x", "50%");
    experienceRef.current.style.setProperty("--pointer-y", "50%");
  }, [isLaptopMode]);

  const activeSong = songs[current] ?? songs[0];

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (isLaptopMode || window.matchMedia("(pointer: coarse)").matches) return;
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
    <main className={`music-site theme-midnight scene-${activeSong.id}${isLaptopMode ? " laptop-mode" : ""}`}>
      <section ref={experienceRef} className="experience" style={{ minHeight: "100vh" }} onPointerMove={handlePointerMove} onPointerLeave={resetPointer}>
        <div key={activeSong.id} className="transition-veil" aria-hidden="true" />
        <div className="motion-layer" aria-hidden="true">
          <div className="motion-grid" /><div className="motion-scan" />
          <div className="motion-marquee">
            <span>МЭРИ · {activeSong.title} · МЭРИ · {activeSong.title} ·&nbsp;</span>
            <span>МЭРИ · {activeSong.title} · МЭРИ · {activeSong.title} ·&nbsp;</span>
          </div>
        </div>
        <header className="site-header">
          <a className="artist-mark" href="#music" aria-label="Мэри — к музыке">Мэри<span>.</span></a>
          <nav className="service-links" aria-label="Мэри — музыкальные сервисы и соцсети">
            {serviceLinks.map((service) => (
              <a
                key={service.id}
                className={`service-link service-${service.id}`}
                href={service.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Мэри — ${service.name} (откроется в новой вкладке)`}
                title={service.name}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
                  <path d={service.iconPath} />
                </svg>
              </a>
            ))}
          </nav>
        </header>

        <Carousel setApi={setApi} opts={{ loop: true, duration: isLaptopMode ? 24 : 38 }} className="world-carousel" id="music">
          <CarouselContent className="world-track">
            {songs.map((song, index) => (
              <CarouselItem className={`world-slide${index === current ? " is-active" : ""}`} key={song.id}>
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
                    <div className="statement"><p>{song.statement}</p></div>
                    <p className="song-description">{song.description}</p>
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
          <div className="track-links">
            {songs.map((song, index) => (
              <button key={song.id} className={index === current ? "active" : ""} type="button" onClick={() => api?.scrollTo(index)} aria-current={index === current ? "true" : undefined}>
                <small>{song.number}</small><span>{song.title}</span>
              </button>
            ))}
          </div>
        </footer>
      </section>
    </main>
  );
}
