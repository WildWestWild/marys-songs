"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type {
  ChangeEvent,
  CSSProperties,
  PointerEvent as ReactPointerEvent,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Pause,
  Play,
} from "lucide-react";
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
    title: "Пьеса",
    artist: "Mary",
    context: "Театр после финала",
    statement: "Если историю нельзя завершить, её превращают в пьесу.",
    description:
      "Музыкант и поэтесса остаются героями общего сюжета. Главные слова почти произнесены, но страх всё ещё прячется в паузах.",
    audio: asset("/tracks/mary-piesa.mp3"),
    image: asset("/mary-piesa-portrait-down.jpg"),
    imageAlt: "Чёрно-белый портрет Mary для песни «Пьеса»",
    imagePosition: "50% 24%",
    yandex: "https://music.yandex.ru/album/37510352/track/141214890",
  },
  {
    id: "greeting",
    title: "Твой привет",
    artist: "Mary",
    context: "Знак сквозь снег",
    statement: "Один короткий знак, и прошлое возвращается снегом.",
    description:
      "Героиня пытается сохранить себя и отпустить другую жизнь. Но редкий привет снова приближает человека, которого невозможно заменить.",
    audio: asset("/tracks/mary-tvoy-privet.mp3"),
    image: asset("/tvoy-privet-bg.png"),
    imageAlt: "Зимний дом за мокрым стеклом для песни «Твой привет»",
    imagePosition: "center center",
    yandex:
      "https://music.yandex.ru/search?text=%D0%9C%D1%8D%D1%80%D0%B8%20%D0%A2%D0%B2%D0%BE%D0%B9%20%D0%BF%D1%80%D0%B8%D0%B2%D0%B5%D1%82",
  },
  {
    id: "needed",
    title: "Нужен",
    artist: "Mary",
    context: "Сила притяжения",
    statement: "Эксперимент становится единственной необходимостью.",
    description:
      "Обаятельный импульс превращается в яркую и почти опасную близость. Здесь любовь работает как магнитное поле.",
    audio: asset("/tracks/mary-nuzhen.mp3"),
    image: asset("/nuzhen-bg.png"),
    imageAlt: "Магнитное поле и силуэты для песни «Нужен»",
    imagePosition: "center center",
    yandex:
      "https://music.yandex.ru/search?text=%D0%9C%D1%8D%D1%80%D0%B8%20%D0%9D%D1%83%D0%B6%D0%B5%D0%BD",
  },
  {
    id: "release",
    title: "Отпускай",
    artist: "Mary",
    context: "Воздух после точки",
    statement: "Иногда любовь остаётся случайным сном и просит отпустить.",
    description:
      "Старый сюжет возвращается ненадолго, чтобы раствориться между строк. Забывать приходится не из холода, а ради нового света.",
    audio: asset("/tracks/mary-otpuskay.mp3"),
    image: asset("/otpuskay-bg.png"),
    imageAlt: "Светлый пейзаж с ветром для песни «Отпускай»",
    imagePosition: "center center",
    yandex:
      "https://music.yandex.ru/search?text=%D0%9C%D1%8D%D1%80%D0%B8%20%D0%9E%D1%82%D0%BF%D1%83%D1%81%D0%BA%D0%B0%D0%B9",
  },
] as const;

type Song = (typeof songs)[number];
type PlayerStatus = "loading" | "ready" | "error";

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
  const [status, setStatus] = useState<PlayerStatus>("loading");

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const syncTime = () => setCurrentTime(audio.currentTime);
    const syncDuration = () => {
      setDuration(audio.duration || 0);
      setStatus("ready");
    };
    const syncPause = () => setPlaying(false);
    const syncError = () => {
      setPlaying(false);
      setStatus("error");
    };
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
    audio.addEventListener("error", syncError);
    window.addEventListener("mary-player-play", stopOthers);
    window.addEventListener("mary-player-stop", stopAll);

    return () => {
      audio.removeEventListener("timeupdate", syncTime);
      audio.removeEventListener("loadedmetadata", syncDuration);
      audio.removeEventListener("durationchange", syncDuration);
      audio.removeEventListener("pause", syncPause);
      audio.removeEventListener("ended", syncPause);
      audio.removeEventListener("error", syncError);
      window.removeEventListener("mary-player-play", stopOthers);
      window.removeEventListener("mary-player-stop", stopAll);
    };
  }, [song.id]);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio || status === "error") return;

    if (!audio.paused) {
      audio.pause();
      return;
    }

    window.dispatchEvent(
      new CustomEvent("mary-player-play", { detail: song.id }),
    );

    try {
      await audio.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
      setStatus("error");
    }
  };

  const seek = (event: ChangeEvent<HTMLInputElement>) => {
    const nextTime = Number(event.target.value);
    if (audioRef.current) audioRef.current.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  return (
    <div className={`track-widget player-${status}`}>
      <audio ref={audioRef} src={song.audio} preload="metadata" />

      <button
        className="play-button"
        type="button"
        onClick={togglePlayback}
        disabled={status === "error"}
        aria-label={playing ? `Пауза: ${song.title}` : `Слушать: ${song.title}`}
      >
        {playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
      </button>

      <div className="player-copy">
        <div className="player-heading">
          <strong>{song.title}</strong>
          <span>{song.artist}</span>
        </div>

        {status === "error" ? (
          <p className="player-status" role="status">
            Аудио временно недоступно
          </p>
        ) : (
          <div className="timeline" aria-busy={status === "loading"}>
            <input
              type="range"
              min="0"
              max={duration || 0}
              step="0.1"
              value={Math.min(currentTime, duration || 0)}
              onChange={seek}
              disabled={status !== "ready"}
              aria-label={`Позиция воспроизведения: ${song.title}`}
              style={
                {
                  "--progress": `${duration ? (currentTime / duration) * 100 : 0}%`,
                } as CSSProperties
              }
            />
            <span>
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
        )}
      </div>

      <a
        className="stream-link"
        href={song.yandex}
        target="_blank"
        rel="noreferrer"
      >
        Яндекс Музыка
        <ExternalLink aria-hidden="true" />
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

    return () => {
      api.off("select", onSelect);
    };
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

    event.currentTarget.style.setProperty("--parallax-x", `${x * 12}px`);
    event.currentTarget.style.setProperty("--parallax-y", `${y * 9}px`);
    event.currentTarget.style.setProperty("--copy-x", `${x * -4}px`);
    event.currentTarget.style.setProperty("--copy-y", `${y * -3}px`);
  };

  const resetPointer = (event: ReactPointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty("--parallax-x", "0px");
    event.currentTarget.style.setProperty("--parallax-y", "0px");
    event.currentTarget.style.setProperty("--copy-x", "0px");
    event.currentTarget.style.setProperty("--copy-y", "0px");
  };

  return (
    <main className={`music-site scene-${activeSong.id}`}>
      <section
        className="experience"
        onPointerMove={handlePointerMove}
        onPointerLeave={resetPointer}
      >
        <div key={activeSong.id} className="transition-veil" aria-hidden="true" />
        <div className="ambient-field" aria-hidden="true" />

        <header className="site-header">
          <a className="artist-mark" href="#music" aria-label="Mary: к музыке">
            Mary<span>.</span>
          </a>
          <p className="collection-note">Четыре песни, четыре состояния</p>
        </header>

        <Carousel
          setApi={setApi}
          opts={{ loop: true, duration: 34 }}
          className="world-carousel"
          id="music"
        >
          <CarouselContent className="world-track">
            {songs.map((song, index) => (
              <CarouselItem className="world-slide" key={song.id}>
                <article
                  className={`song-world song-${song.id}`}
                  data-active={index === current ? "true" : "false"}
                  aria-label={`Песня «${song.title}»`}
                >
                  <div className="visual-stage">
                    <div className="portrait-frame">
                      <Image
                        className="portrait"
                        src={song.image}
                        alt={song.imageAlt}
                        fill
                        sizes="(max-width: 760px) 100vw, 62vw"
                        priority={index === 0}
                        style={{ objectPosition: song.imagePosition }}
                      />
                      <div className="image-wash" aria-hidden="true" />
                    </div>
                    <span className="ghost-title" aria-hidden="true">
                      {song.title}
                    </span>
                  </div>

                  <div className="song-copy">
                    <p className="song-context">{song.context}</p>
                    <h1>{song.title}</h1>
                    <p className="statement">{song.statement}</p>
                    <p className="song-description">{song.description}</p>
                    <div className="player-zone">
                      <TrackPlayer song={song} />
                    </div>
                  </div>
                </article>
              </CarouselItem>
            ))}
          </CarouselContent>

          <button
            className="edge-arrow edge-prev"
            type="button"
            onClick={() => api?.scrollPrev()}
            aria-label="Предыдущий трек"
          >
            <ArrowLeft aria-hidden="true" />
          </button>
          <button
            className="edge-arrow edge-next"
            type="button"
            onClick={() => api?.scrollNext()}
            aria-label="Следующий трек"
          >
            <ArrowRight aria-hidden="true" />
          </button>
        </Carousel>

        <nav className="track-rail" aria-label="Выбор песни">
          <div className="track-links">
            {songs.map((song, index) => (
              <button
                key={song.id}
                className={index === current ? "active" : ""}
                type="button"
                onClick={() => api?.scrollTo(index)}
                aria-current={index === current ? "true" : undefined}
              >
                <span>{song.title}</span>
                <small>{song.context}</small>
              </button>
            ))}
          </div>
        </nav>
      </section>
    </main>
  );
}
