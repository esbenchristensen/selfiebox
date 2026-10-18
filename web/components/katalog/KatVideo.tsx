// A film on a catalogue page. Plain <video> with the browser's own controls, so the same markup also works
// in catalogues stored as HTML in MongoDB (copy the output of this component). It does not autoplay, so
// the reader starts it with sound. In the PDF the poster frame is printed with the address of the film.
// `src` is the file without extension, e.g. /video/selfi-palads-wide (needs .mp4, .webm and .jpg next to it).
export function KatVideo({ src, title }: { src: string; title: string }) {
  return (
    <figure className="kat-video">
      <video controls playsInline preload="none" poster={`${src}.jpg`} aria-label={title}>
        <source src={`${src}.webm`} type="video/webm" />
        <source src={`${src}.mp4`} type="video/mp4" />
      </video>
      <figcaption className="kat-video-print">Se filmen på selfi.dk{src}.mp4</figcaption>
    </figure>
  );
}
