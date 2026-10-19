// Selfi Boks gen 2 as declared in the EU declaration of conformity and the user instructions.
// Keep in step with the technical file in /mnt/project-files/dokumentation/ (halo-gen2-v8_teknisk-fil.md).
export const product = {
  name: "Selfi Boks",
  model: "Selfi Boks gen 2",
  type: "SB2", // typebetegnelse på typeskiltet
  hardware: "halo-gen2-v8",
  rating: "24 V ⎓ 3,75 A (90 W)",
  psu: "Mean Well GST90A24-P1M (100–240 V~ 50/60 Hz ind, 24 V ⎓ 3,75 A ud)",
  weight: "ca. 1,6 kg",
  size: "222,5 × 306 × 70 mm (b × h × d)",
  ambient: "0–30 °C, indendørs eller under tag",
  declared: "19. oktober 2026",
};

// Radio transmitters that can be fitted. The 4G modem and the microphone board are options.
// Power figures are the maximum for the band as stated by the module makers and the EU limits for the band.
export const radios: { part: string; use: string; band: string; power: string; optional?: boolean }[] = [
  { part: "Raspberry Pi 5 (Wi-Fi)", use: "Internet via stedets Wi-Fi", band: "2400–2483,5 MHz", power: "< 20 dBm e.i.r.p." },
  { part: "Raspberry Pi 5 (Wi-Fi)", use: "Internet via stedets Wi-Fi", band: "5150–5350 MHz (kun indendørs)", power: "< 23 dBm e.i.r.p." },
  { part: "Raspberry Pi 5 (Wi-Fi)", use: "Internet via stedets Wi-Fi", band: "5470–5725 MHz", power: "< 30 dBm e.i.r.p." },
  { part: "Raspberry Pi 5 (Bluetooth)", use: "Slået fra i boksens software", band: "2400–2483,5 MHz", power: "< 10 dBm e.i.r.p." },
  { part: "Gledopto GL-C-016WL-D (Wi-Fi)", use: "Styring af RGB-lyset i boksen", band: "2400–2483,5 MHz", power: "< 20 dBm e.i.r.p." },
  { part: "reSpeaker XVF3800 med XIAO ESP32-S3 (Wi-Fi/Bluetooth)", use: "Mikrofonkortets styring, radio ikke brugt", band: "2400–2483,5 MHz", power: "< 20 dBm e.i.r.p.", optional: true },
  { part: "Waveshare SIM7600G-H 4G HAT (GSM)", use: "Mobilnet", band: "880–915 MHz / 1710–1785 MHz", power: "33 dBm / 30 dBm", optional: true },
  { part: "Waveshare SIM7600G-H 4G HAT (UMTS)", use: "Mobilnet", band: "Bånd 1 og 8", power: "24 dBm", optional: true },
  { part: "Waveshare SIM7600G-H 4G HAT (LTE)", use: "Mobilnet", band: "Bånd 1, 3, 7, 8, 20, 28, 38, 40", power: "23 dBm", optional: true },
  { part: "Waveshare SIM7600G-H 4G HAT (GNSS)", use: "Position, kun modtager", band: "1559–1610 MHz", power: "Sender ikke", optional: true },
];
