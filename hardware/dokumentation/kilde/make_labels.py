"""Makes the rating label (typeskilt) and the guest sign (skilt ved boksen) as SVG.

Run:  python3 make_labels.py <out-dir>
Fill in COMPANY when the address is known and run again; then print the PDFs with print_pdfs.cjs.
"""
import sys, io
import qrcode, qrcode.image.svg

VERSION = "halo-gen2-v8"
COMPANY = {"name": "Selfi", "street": "", "postcode": "", "web": "selfi.dk"}
FONT = "Geist, Helvetica, Arial, sans-serif"


def ce(x, y, h):
    """CE mark, height h (mm). Each letter is the left half of a ring; E has a shorter middle bar."""
    R, r = h / 2, h / 2 * 0.72
    def half_ring(cx):
        cy = y + R
        return (f'<path d="M{cx},{cy-R} A{R},{R} 0 0 0 {cx},{cy+R} L{cx},{cy+r} '
                f'A{r},{r} 0 0 1 {cx},{cy-r} Z"/>')
    c1, c2 = x + R, x + R + 0.86 * h
    t = R - r
    bar = f'<rect x="{c2-R+t*0.6}" y="{y+R-t/2}" width="{R*0.8}" height="{t}"/>'
    return f'<g fill="#000">{half_ring(c1)}{half_ring(c2)}{bar}</g>'


def bin_symbol(x, y, w):
    """Crossed-out wheeled bin with the bar beneath (EN 50419), width w (mm)."""
    s = w / 10
    p = lambda a, b: f"{x+a*s:.3f},{y+b*s:.3f}"
    return (f'<g fill="none" stroke="#000" stroke-width="{0.55*s:.3f}" stroke-linejoin="round">'
            f'<path d="M{p(2.2,2.6)} L{p(7.8,2.6)} M{p(4,2.6)} L{p(4.3,1.6)} L{p(5.7,1.6)} L{p(6,2.6)}"/>'
            f'<path d="M{p(2.6,3.2)} L{p(3.3,10.4)} L{p(6.7,10.4)} L{p(7.4,3.2)}"/>'
            f'<circle cx="{x+3.6*s:.3f}" cy="{y+11*s:.3f}" r="{0.55*s:.3f}"/>'
            f'<path d="M{p(1,1.2)} L{p(9,11.8)} M{p(9,1.2)} L{p(1,11.8)}"/></g>'
            f'<rect x="{x+1*s:.3f}" y="{y+12.6*s:.3f}" width="{8*s:.3f}" height="{1.5*s:.3f}" fill="#000"/>')


def polarity(x, y, h):
    """Centre-positive DC plug symbol: (-) C( . ) (+)."""
    r = h * 0.38
    cx, cy = x + h * 1.25, y + h / 2
    sw = h * 0.09
    return (f'<g fill="none" stroke="#000" stroke-width="{sw}">'
            f'<circle cx="{x+h*0.3}" cy="{cy}" r="{h*0.28}"/><path d="M{x+h*0.15},{cy} h{h*0.3}"/>'
            f'<path d="M{x+h*0.58},{cy} H{cx-r}"/>'
            f'<path d="M{cx+r*0.6},{cy-r*0.8} A{r},{r} 0 1 0 {cx+r*0.6},{cy+r*0.8}"/>'
            f'<path d="M{cx},{cy} H{x+h*2.2}"/>'
            f'<circle cx="{x+h*2.5}" cy="{cy}" r="{h*0.28}"/><path d="M{x+h*2.35},{cy} h{h*0.3} M{x+h*2.5},{cy-h*0.15} v{h*0.3}"/></g>'
            f'<circle cx="{cx}" cy="{cy}" r="{h*0.12}" fill="#000"/>')


def text(x, y, s, size, weight=400, anchor="start"):
    return f'<text x="{x}" y="{y}" font-family="{FONT}" font-size="{size}" font-weight="{weight}" text-anchor="{anchor}">{s}</text>'


def typeskilt():
    W, H = 40, 70
    addr = ", ".join(v for v in (COMPANY["street"], COMPANY["postcode"]) if v)
    parts = [
        f'<rect x="0.25" y="0.25" width="{W-0.5}" height="{H-0.5}" rx="2.5" fill="#fff" stroke="#000" stroke-width="0.3"/>',
        text(3, 7, "Selfi Boks gen 2", 3.6, 700),
        text(3, 11.2, f"Type SB2 · {VERSION}", 2.3),
        text(3, 17.5, "24 V", 3.4, 700),
        # DC symbol: solid line over dashed line
        f'<rect x="12.2" y="14.2" width="4.2" height="0.45"/><rect x="12.2" y="15.9" width="1" height="0.45"/><rect x="13.8" y="15.9" width="1" height="0.45"/><rect x="15.4" y="15.9" width="1" height="0.45"/>',
        text(17.6, 17.5, "3,75 A", 3.4, 700),
        polarity(28.6, 14.4, 3.4),
        text(3, 22, "Brug kun strømforsyningen", 2.2),
        text(3, 24.9, "Mean Well GST90A24.", 2.2, 600),
        text(3, 29, "Indendørs eller under tag.", 2.2),
        text(3, 31.9, "Ikke regn eller direkte sol.", 2.2),
        text(3, 34.8, "Åbn ikke boksen.", 2.2),
        text(3, 40.5, "Serienr.", 2.2, 600),
        f'<rect x="12.5" y="37.6" width="24.5" height="4.2" rx="0.6" fill="none" stroke="#000" stroke-width="0.25"/>',
        text(13.5, 40.6, "SB2-", 2.4),
        text(3, 46.3, f"Fabrikant: {COMPANY['name']}", 2.2, 600),
        text(3, 49.2, addr if addr else "Adresse: ______________________", 2.1),
        text(3, 52.1, f"{COMPANY['web']} · Lavet i Danmark", 2.1),
        ce(3, 56.5, 8),
        bin_symbol(28, 55, 8.2),
        text(3, 68, "selfi.dk/dokumentation", 1.9),
    ]
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}mm" height="{H}mm" viewBox="0 0 {W} {H}">'
            + "".join(parts) + "</svg>")


def qr_svg(data, x, y, size):
    q = qrcode.QRCode(border=0, error_correction=qrcode.constants.ERROR_CORRECT_M)
    q.add_data(data); q.make()
    m = q.get_matrix(); n = len(m); c = size / n
    rects = "".join(f'<rect x="{x+j*c:.3f}" y="{y+i*c:.3f}" width="{c+0.01:.3f}" height="{c+0.01:.3f}"/>'
                    for i, row in enumerate(m) for j, v in enumerate(row) if v)
    return f'<g fill="#000">{rects}</g>'


def skilt():
    W, H = 105, 148  # A6
    lines = [
        ("Her står en fotoboks.", 7.2, 700),
    ]
    body = [
        "Boksen tager kun billeder og video med lyd,",
        "når du selv trykker start.",
        "",
        "Du får dit billede via QR-kode eller SMS.",
        "Stedet må kun bruge det, hvis du siger ja,",
        "og du kan altid trække dit ja tilbage.",
        "",
        "Er du under 15 år, skal en voksen sige ja for dig.",
    ]
    parts = [f'<rect width="{W}" height="{H}" fill="#fff"/>',
             f'<rect x="0" y="0" width="{W}" height="6" fill="#22D36B"/>',
             text(8, 22, lines[0][0], lines[0][1], 700)]
    y = 33
    for b in body:
        if b:
            parts.append(text(8, y, b, 3.7))
        y += 5.4 if b else 3
    parts += [
        text(8, y + 6, "Ansvarlig for dine billeder:", 3.4, 600),
        f'<rect x="8" y="{y+9}" width="89" height="10" rx="1.5" fill="none" stroke="#000" stroke-width="0.3" stroke-dasharray="1.5 1"/>',
        text(11, y + 15.6, "Stedets navn", 3.2),
        text(8, y + 27, "Behandles af Selfi for stedet.", 3.4),
        text(8, y + 32.5, "Læs mere og få dine billeder slettet:", 3.4),
        text(8, y + 39, "selfi.dk/gaester", 5.4, 700),
        qr_svg("https://selfi.dk/gaester", 72, H - 34, 25),
        text(8, H - 8, "Selfi · selfi.dk", 3, 400),
    ]
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}mm" height="{H}mm" viewBox="0 0 {W} {H}">'
            + "".join(parts) + "</svg>")


if __name__ == "__main__":
    out = sys.argv[1]
    open(f"{out}/{VERSION}_typeskilt.svg", "w").write(typeskilt())
    open(f"{out}/selfi-gdpr-v1_skilt-ved-boksen.svg", "w").write(skilt())
