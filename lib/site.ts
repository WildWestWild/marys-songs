export const siteUrl = "https://marymusic.ru";
export const siteTitle = "Мэри";
export const siteDescription = "Официальный сайт Мэри. Музыка и события";

export const sameAs = [
  "https://music.yandex.ru/artist/23938502",
  "https://open.spotify.com/artist/46UBpGtsar0BKo17LhRRPD",
  "https://music.apple.com/ru/artist/%D0%BC%D1%8D%D1%80%D0%B8/1801918108",
  "https://t.me/marymusicru",
] as const;

export const tracks = [
  { name: "Пьеса", url: "https://music.yandex.ru/album/37510352/track/141214890" },
  { name: "Нужен", url: "https://music.yandex.ru/album/35465280/track/136262659" },
  { name: "Отпускай", url: "https://music.yandex.ru/album/35465280/track/136262660" },
  { name: "Твой привет", url: "https://music.yandex.ru/album/35465280/track/136262661" },
] as const;

export function musicGroupJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: siteTitle,
    url: `${siteUrl}/`,
    sameAs: [...sameAs],
    track: tracks.map((track) => ({
      "@type": "MusicRecording",
      name: track.name,
      byArtist: { "@type": "MusicGroup", name: siteTitle },
      url: track.url,
    })),
  };
}
