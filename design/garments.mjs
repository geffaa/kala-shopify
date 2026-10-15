/**
 * Technical flats for the Kala catalog, drawn as SVG on a 1000 × 1250 grid.
 * Each garment returns { front, back, detail } markup for a given colour.
 * The look is deliberately "tech pack": flat fill, ink outline, dashed
 * topstitching, faint fold lines — the same visual language as the theme.
 */

export function lineColorFor(hex) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => v / 255);
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return lum < 0.22 ? '#9A968C' : '#1B1B19';
}

export function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => Math.max(0, Math.min(255, Math.round(v + amt))));
  return `#${c.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

const styles = (scope, fill, ink) => `
  <style>
    #${scope} *{vector-effect:non-scaling-stroke}
    #${scope} .g{fill:${fill};stroke:${ink};stroke-width:3;stroke-linejoin:round;stroke-linecap:round}
    #${scope} .d{fill:none;stroke:${ink};stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
    #${scope} .s{fill:none;stroke:${ink};stroke-width:1.5;stroke-dasharray:7 6;opacity:.55}
    #${scope} .f{fill:none;stroke:${ink};stroke-width:1.8;opacity:.16;stroke-linecap:round}
    #${scope} .in{fill:${ink};opacity:.16}
    #${scope} .b{fill:#EFE9DC;stroke:${ink};stroke-width:1.8}
  </style>`;

const buttons = (x, ys, r = 7) => ys.map((y) => `<circle class="b" cx="${x}" cy="${y}" r="${r}"/>`).join('');

/* ---------------------------------------------------------------------- */

const shirt = {
  front: () => `
    <path class="g" d="M425 205 L300 245 C250 262 220 280 205 300 L118 790 L212 812 L298 470 L314 1005 Q500 1062 686 1005 L702 470 L788 812 L882 790 L795 300 C780 280 750 262 700 245 L575 205 Z"/>
    <path class="in" d="M436 212 Q500 236 564 212 Q500 196 436 212 Z"/>
    <path class="d" d="M300 245 C318 320 322 400 298 470 M700 245 C682 320 678 400 702 470"/>
    <path class="d" d="M486 268 L486 1033 M514 268 L514 1033"/>
    ${buttons(500, [300, 392, 484, 576, 668, 760, 852, 944])}
    <path class="g" d="M345 380 L455 380 L455 505 L400 522 L345 505 Z"/>
    <path class="g" d="M545 380 L655 380 L655 505 L600 522 L545 505 Z"/>
    <path class="g" d="M340 370 L460 370 L460 410 L340 410 Z M540 370 L660 370 L660 410 L540 410 Z"/>
    ${buttons(400, [392], 6)}${buttons(600, [392], 6)}
    <path class="s" d="M352 418 L352 500 L400 514 L448 500 L448 418 M552 418 L552 500 L600 514 L648 500 L648 418"/>
    <path class="g" d="M425 205 Q500 180 575 205 L592 230 L530 298 L500 268 L470 298 L408 230 Z"/>
    <path class="d" d="M432 214 Q500 196 568 214"/>
    <path class="d" d="M134 734 L224 756 M866 734 L776 756"/>
    <path class="s" d="M128 765 L217 786 M872 765 L783 786"/>
    <path class="s" d="M318 988 Q500 1044 682 988"/>
    <path class="f" d="M340 600 Q365 700 345 830 M660 630 Q635 740 655 870 M200 520 Q222 570 205 620 M800 520 Q778 570 795 620 M420 560 Q430 640 418 700"/>
  `,
  back: () => `
    <path class="g" d="M425 205 L300 245 C250 262 220 280 205 300 L118 790 L212 812 L298 470 L314 1005 Q500 1062 686 1005 L702 470 L788 812 L882 790 L795 300 C780 280 750 262 700 245 L575 205 Z"/>
    <path class="g" d="M425 205 Q500 188 575 205 L578 232 Q500 216 422 232 Z"/>
    <path class="d" d="M300 245 C318 320 322 400 298 470 M700 245 C682 320 678 400 702 470"/>
    <path class="d" d="M306 335 Q500 352 694 335"/>
    <path class="s" d="M306 350 Q500 367 694 350"/>
    <path class="d" d="M476 345 L476 470 M524 345 L524 470 M476 345 L500 362 L524 345"/>
    <path class="d" d="M134 734 L224 756 M866 734 L776 756"/>
    <path class="s" d="M318 988 Q500 1044 682 988"/>
    <path class="f" d="M360 560 Q385 700 360 840 M640 560 Q615 700 640 840 M500 520 Q510 700 498 900"/>
  `,
  detail: { view: [300, 170, 400, 500], notes: [[500, 484, 'Corozo buttons'], [568, 222, 'Point collar, 7 cm'], [400, 520, 'Pointed pocket, flap']] },
};

const tee = {
  front: () => `
    <path class="g" d="M420 215 L300 250 L165 345 L225 478 L302 440 L308 1000 L692 1000 L698 440 L775 478 L835 345 L700 250 L580 215 Q500 285 420 215 Z"/>
    <path class="in" d="M420 215 Q500 285 580 215 Q500 232 420 215 Z"/>
    <path class="d" d="M410 228 Q500 300 590 228"/>
    <path class="d" d="M300 250 C312 330 314 390 302 440 M700 250 C688 330 686 390 698 440"/>
    <path class="s" d="M180 338 L240 471 M820 338 L760 471 M308 978 L692 978"/>
    <path class="f" d="M360 560 Q380 700 362 860 M640 580 Q620 720 640 880 M470 320 Q500 340 530 320"/>
  `,
  back: () => `
    <path class="g" d="M420 215 L300 250 L165 345 L225 478 L302 440 L308 1000 L692 1000 L698 440 L775 478 L835 345 L700 250 L580 215 Q500 238 420 215 Z"/>
    <path class="d" d="M412 230 Q500 256 588 230"/>
    <path class="d" d="M300 250 C312 330 314 390 302 440 M700 250 C688 330 686 390 698 440"/>
    <path class="s" d="M180 338 L240 471 M820 338 L760 471 M308 978 L692 978"/>
    <path class="f" d="M380 560 Q395 700 380 860 M620 560 Q605 700 620 860"/>
  `,
  detail: { view: [330, 160, 340, 425], notes: [[500, 262, '2 cm rib collar'], [210, 410, 'Twin-needle hem'], [420, 380, '240 gsm jersey']] },
};

const shortshirt = {
  front: () => `
    <path class="g" d="M425 205 L300 245 L170 340 L228 470 L302 435 L310 1000 L690 1000 L698 435 L772 470 L830 340 L700 245 L575 205 Z"/>
    <path class="in" d="M440 212 L500 410 L560 212 Q500 198 440 212 Z"/>
    <path class="d" d="M300 245 C312 325 314 385 302 435 M700 245 C688 325 686 385 698 435"/>
    <path class="d" d="M488 420 L488 1000 M512 420 L512 1000"/>
    ${buttons(500, [470, 560, 650, 740, 830, 920])}
    <path class="g" d="M350 372 L452 372 L452 485 L350 485 Z"/>
    <path class="s" d="M350 392 L452 392"/>
    <path class="g" d="M425 205 L380 268 L452 292 L497 420 L456 232 Z"/>
    <path class="g" d="M575 205 L620 268 L548 292 L503 420 L544 232 Z"/>
    <path class="d" d="M425 205 Q500 186 575 205"/>
    <path class="s" d="M185 333 L243 463 M815 333 L757 463 M310 978 L690 978"/>
    <path class="f" d="M345 560 Q365 700 348 860 M655 580 Q635 720 655 880"/>
  `,
  back: () => `
    <path class="g" d="M425 205 L300 245 L170 340 L228 470 L302 435 L310 1000 L690 1000 L698 435 L772 470 L830 340 L700 245 L575 205 Z"/>
    <path class="g" d="M425 205 Q500 188 575 205 L578 230 Q500 214 422 230 Z"/>
    <path class="d" d="M300 245 C312 325 314 385 302 435 M700 245 C688 325 686 385 698 435"/>
    <path class="d" d="M306 330 Q500 346 694 330"/>
    <path class="s" d="M185 333 L243 463 M815 333 L757 463 M310 978 L690 978"/>
  `,
  detail: { view: [330, 170, 340, 425], notes: [[455, 285, 'Camp collar'], [400, 430, 'Single patch pocket'], [500, 470, 'Corozo buttons']] },
};

const jacket = {
  front: () => `
    <path class="g" d="M420 200 L290 238 C245 255 215 275 200 300 L110 830 L215 852 L292 480 L298 1010 L702 1010 L708 480 L785 852 L890 830 L800 300 C785 275 755 255 710 238 L580 200 Z"/>
    <path class="in" d="M434 208 Q500 232 566 208 Q500 192 434 208 Z"/>
    <path class="d" d="M290 238 C310 320 314 410 292 480 M710 238 C690 320 686 410 708 480"/>
    <path class="d" d="M500 292 L500 1010"/>
    <path class="s" d="M512 300 L512 1000"/>
    ${buttons(482, [345, 465, 585, 705, 825], 8)}
    <path class="g" d="M338 392 L452 392 L452 505 L338 505 Z"/>
    <path class="g" d="M326 700 L472 700 L472 865 L326 865 Z"/>
    <path class="g" d="M528 700 L674 700 L674 865 L528 865 Z"/>
    <path class="s" d="M338 412 L452 412 M326 722 L472 722 M528 722 L674 722"/>
    <path class="g" d="M420 200 Q500 172 580 200 L612 236 L545 322 L500 292 L455 322 L388 236 Z"/>
    <path class="d" d="M428 210 Q500 188 572 210"/>
    <path class="d" d="M124 775 L225 797 M876 775 L775 797"/>
    <path class="s" d="M298 988 L702 988 M117 805 L219 826 M883 805 L781 826"/>
    <path class="f" d="M380 560 Q400 640 382 690 M620 540 Q600 620 618 690 M185 560 Q208 610 192 660 M815 560 Q792 610 808 660 M420 900 Q440 950 425 990"/>
  `,
  back: () => `
    <path class="g" d="M420 200 L290 238 C245 255 215 275 200 300 L110 830 L215 852 L292 480 L298 1010 L702 1010 L708 480 L785 852 L890 830 L800 300 C785 275 755 255 710 238 L580 200 Z"/>
    <path class="g" d="M420 200 Q500 182 580 200 L585 236 Q500 216 415 236 Z"/>
    <path class="d" d="M290 238 C310 320 314 410 292 480 M710 238 C690 320 686 410 708 480"/>
    <path class="d" d="M296 360 Q500 380 704 360"/>
    <path class="s" d="M296 376 Q500 396 704 376 M298 988 L702 988"/>
    <path class="d" d="M124 775 L225 797 M876 775 L775 797"/>
    <path class="f" d="M400 520 Q420 700 400 900 M600 520 Q580 700 600 900"/>
  `,
  detail: { view: [300, 640, 420, 525], notes: [[400, 790, '3-needle patch pockets'], [482, 830, 'Horn buttons'], [600, 990, 'Cotton–ramie canvas']] },
};

const trousers = {
  front: () => `
    <path class="g" d="M328 215 L672 215 C700 300 712 380 712 460 L728 1120 L528 1120 L506 520 Q500 505 494 520 L472 1120 L272 1120 L288 460 C288 380 300 300 328 215 Z"/>
    <path class="g" d="M330 168 L670 168 L672 215 L328 215 Z"/>
    <path class="d" d="M350 215 Q382 300 300 348 M650 215 Q618 300 700 348"/>
    <path class="d" d="M500 215 L500 470"/>
    <path class="s" d="M528 215 L528 430 Q528 474 502 484"/>
    ${[360, 440, 560, 640].map((x) => `<rect class="g" x="${x - 9}" y="160" width="18" height="64" rx="2"/>`).join('')}
    ${buttons(500, [192], 9)}
    <path class="s" d="M274 1094 L470 1094 M530 1094 L726 1094 M330 190 L670 190"/>
    <path class="f" d="M382 560 L374 1100 M618 560 L626 1100 M440 640 Q455 700 440 760 M560 680 Q545 740 560 800"/>
  `,
  back: () => `
    <path class="g" d="M328 215 L672 215 C700 300 712 380 712 460 L728 1120 L528 1120 L506 520 Q500 505 494 520 L472 1120 L272 1120 L288 460 C288 380 300 300 328 215 Z"/>
    <path class="g" d="M330 168 L670 168 L672 215 L328 215 Z"/>
    <path class="d" d="M418 172 L418 212 M436 172 L436 212 M454 172 L454 212 M472 172 L472 212 M528 172 L528 212 M546 172 L546 212 M564 172 L564 212 M582 172 L582 212"/>
    <path class="d" d="M500 215 L500 508 M300 330 Q400 300 500 288 Q600 300 700 330"/>
    <path class="g" d="M352 340 L452 330 L456 452 L356 460 Z"/>
    <path class="g" d="M548 330 L648 340 L644 460 L544 452 Z"/>
    <path class="s" d="M354 360 L452 351 M548 351 L646 360 M274 1094 L470 1094 M530 1094 L726 1094"/>
    <path class="f" d="M392 560 L384 1100 M608 560 L616 1100"/>
  `,
  detail: { view: [290, 140, 420, 525], notes: [[500, 192, 'Half-elastic back'], [330, 290, 'Deep slant pockets'], [520, 400, 'J-stitch fly']] },
};

const shorts = {
  offsetY: 200,
  front: () => `
    <path class="g" d="M328 215 L672 215 C700 300 712 380 712 460 L722 660 L522 660 L506 520 Q500 505 494 520 L478 660 L278 660 L288 460 C288 380 300 300 328 215 Z"/>
    <path class="g" d="M330 168 L670 168 L672 215 L328 215 Z"/>
    <path class="d" d="M350 215 Q382 300 300 348 M650 215 Q618 300 700 348 M500 215 L500 470"/>
    <path class="s" d="M528 215 L528 430 Q528 474 502 484 M280 634 L476 634 M524 634 L720 634"/>
    ${[360, 440, 560, 640].map((x) => `<rect class="g" x="${x - 9}" y="160" width="18" height="64" rx="2"/>`).join('')}
    ${buttons(500, [192], 9)}
    <path class="f" d="M382 500 L378 640 M618 500 L622 640"/>
  `,
  back: () => `
    <path class="g" d="M328 215 L672 215 C700 300 712 380 712 460 L722 660 L522 660 L506 520 Q500 505 494 520 L478 660 L278 660 L288 460 C288 380 300 300 328 215 Z"/>
    <path class="g" d="M330 168 L670 168 L672 215 L328 215 Z"/>
    <path class="d" d="M500 215 L500 508 M300 330 Q400 300 500 288 Q600 300 700 330"/>
    <path class="g" d="M352 340 L452 330 L456 452 L356 460 Z M548 330 L648 340 L644 460 L544 452 Z"/>
    <path class="s" d="M280 634 L476 634 M524 634 L720 634"/>
  `,
  detail: { view: [290, 140, 420, 525], notes: [[330, 290, 'Slant pockets'], [520, 400, 'J-stitch fly'], [600, 600, '18 cm inseam']] },
};

const cap = {
  offsetY: 120,
  front: () => `
    <path class="g" d="M290 640 C290 430 380 360 500 360 C620 360 710 430 710 640 Z"/>
    <path class="d" d="M500 362 C430 380 395 500 390 640 M500 362 C570 380 605 500 610 640"/>
    <path class="s" d="M482 372 C418 400 386 510 382 636 M518 372 C582 400 614 510 618 636"/>
    <circle class="g" cx="500" cy="356" r="13"/>
    <circle class="d" cx="425" cy="470" r="6"/><circle class="d" cx="575" cy="470" r="6"/>
    <path class="g" d="M282 640 Q500 600 718 640 L740 694 Q500 770 260 694 Z"/>
    <path class="s" d="M292 664 Q500 724 708 664 M300 682 Q500 744 700 682"/>
    <path class="f" d="M350 520 Q360 580 345 630 M650 520 Q640 580 655 630"/>
  `,
  back: () => `
    <path class="g" d="M290 640 C290 430 380 360 500 360 C620 360 710 430 710 640 Z"/>
    <path class="in" d="M420 640 Q500 550 580 640 Z"/>
    <path class="d" d="M500 362 L500 560 M500 362 C430 380 395 500 390 640 M500 362 C570 380 605 500 610 640"/>
    <circle class="g" cx="500" cy="356" r="13"/>
    <path class="g" d="M400 615 L600 615 L600 640 L400 640 Z"/>
    <rect x="474" y="606" width="52" height="42" fill="#B08D57" stroke="#1B1B19" stroke-width="2"/>
  `,
  detail: { view: [270, 330, 460, 575], notes: [[500, 356, 'Fabric-covered button'], [425, 470, 'Stitched eyelets'], [520, 700, 'Soft brim, 6 rows']] },
};

const tote = {
  offsetY: 40,
  front: (fill, ink) => {
    const a = fill;
    const b = shade(fill, -26);
    const c = '#8C8467';
    const strap = (x1, x2) => `
      <path d="M${x1} 470 L${x1} 300 Q${x1} 215 ${(x1 + x2) / 2} 215 Q${x2} 215 ${x2} 300 L${x2} 470" fill="none" stroke="${ink}" stroke-width="34" stroke-linecap="butt"/>
      <path d="M${x1} 470 L${x1} 300 Q${x1} 215 ${(x1 + x2) / 2} 215 Q${x2} 215 ${x2} 300 L${x2} 470" fill="none" stroke="${b}" stroke-width="28"/>
      <path class="s" d="M${x1 - 7} 470 L${x1 - 7} 300 M${x1 + 7} 470 L${x1 + 7} 300 M${x2 - 7} 470 L${x2 - 7} 300 M${x2 + 7} 470 L${x2 + 7} 300"/>`;
    return `
      ${strap(370, 470)}${strap(530, 630)}
      <path class="g" d="M290 470 L520 470 L516 760 L286 735 Z" style="fill:${a}"/>
      <path class="g" d="M520 470 L710 470 L714 700 L517 720 Z" style="fill:${b}"/>
      <path class="g" d="M286 735 L516 760 L520 1080 L280 1080 Z" style="fill:${c}"/>
      <path class="g" d="M517 720 L714 700 L720 1080 L520 1080 Z" style="fill:${a}"/>
      <path class="s" d="M300 500 L700 500 M298 748 L506 770 M528 730 L704 712"/>
      ${[370, 470, 530, 630].map((x) => `<path class="d" d="M${x - 14} 480 L${x + 14} 480 L${x + 14} 506 L${x - 14} 506 Z M${x - 14} 480 L${x + 14} 506 M${x + 14} 480 L${x - 14} 506"/>`).join('')}
      <path class="f" d="M380 860 Q400 950 385 1040 M620 820 Q600 920 618 1030"/>`;
  },
  back: (fill, ink) => tote.front(shade(fill, -10), ink),
  detail: { view: [280, 420, 460, 575], notes: [[370, 492, 'Box-X bartacks'], [400, 620, 'Pieced offcuts'], [620, 900, 'No two the same']] },
};

export const GARMENTS = { shirt, tee, shortshirt, jacket, trousers, shorts, cap, tote };

/** Markup for one garment view, wrapped in a <g> with its style block. */
let uid = 0;
export function garmentMarkup(type, view, fill) {
  const g = GARMENTS[type];
  const ink = lineColorFor(fill);
  const scope = `g${++uid}`;
  const body = g[view](fill, ink);
  return `${styles(scope, fill, ink)}<g id="${scope}" transform="translate(0 ${g.offsetY ?? 0})">${body}</g>`;
}
