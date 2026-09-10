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

const songs = [
  {
    id: "piece",
    number: "01",
    title: "Пьеса",
    artist: "Мэри",
    eyebrow: "Акт I · роли и недосказанность",
    statement: "Если историю нельзя завершить, её превращают в пьесу.",
    description: "Музыкант и поэтесса остаются героями общего сюжета: главные слова почти произнесены, но страх всё ещё прячется в паузах. Визуал строится как сцена после спектакля.",
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
    eyebrow: "Акт II · сила притяжения",
    statement: "Эксперимент становится единственной необходимостью.",
    description: "Обаятельный импульс превращается в яркую, наивную и почти опасную близость. Здесь любовь — магнитное поле: хочется отдать душу и признать, что нужен только один человек.",
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
    eyebrow: "Акт III · воздух после точки",
    statement: "Иногда любовь остаётся случайным сном — и просит отпустить.",
    description: "Старый сюжет возвращается ненадолго, чтобы раствориться между строк. Повтор становится внутренним решением: забывать не из холода, а чтобы наконец освободить пространство для света.",
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
    eyebrow: "Акт IV · знак сквозь снег",
    statement: "Один короткий знак — и прошлое возвращается снегом.",
    description: "Героиня пытается уйти, сохранить себя и отпустить другую жизнь. Но редкий привет снова приближает человека, которого невозможно заменить, — почти встреча, в которую трудно поверить.",
    audio: asset("/tracks/mary-tvoy-privet.mp3"),
    image: asset("/tvoy-privet-bg.png"),
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
    <main className={`music-site theme-midnight scene-${activeSong.id}`}>
      <section className="experience" style={{ minHeight: "100vh" }} onPointerMove={handlePointerMove} onPointerLeave={resetPointer}>
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
