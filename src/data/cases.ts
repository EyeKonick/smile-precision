// Real before/after cases, cropped from the clinic's own Facebook posts (images/optimized).
// Titles marked "confirm" weren't captioned on the original post; check the treatment with the clinic.
import smileBefore from '../../images/optimized/smile-veneers-before.webp';
import smileAfter from '../../images/optimized/smile-veneers-after.webp';
import closeBefore from '../../images/optimized/closeup-before.webp';
import closeAfter from '../../images/optimized/closeup-after.webp';
import compBefore from '../../images/optimized/composite-before.webp';
import compAfter from '../../images/optimized/composite-after.webp';
import noprepBefore from '../../images/optimized/noprep-before.webp';
import noprepAfter from '../../images/optimized/noprep-after.webp';
import faceBefore from '../../images/optimized/fullface-before.webp';
import faceAfter from '../../images/optimized/fullface-after.webp';

export const cases = [
  {
    id: 'veneer-smile',
    title: 'Veneer smile', // confirm treatment
    note: 'Gaps closed and edges evened out, keeping the natural shape of the smile.',
    before: smileBefore,
    after: smileAfter,
    alt: 'lower face of a smiling woman',
    focus: '50% 60%',
  },
  {
    id: 'no-prep',
    title: 'No-drill, no-prep veneers',
    note: 'Minimal prep, natural shade, no tooth structure removed.',
    before: noprepBefore,
    after: noprepAfter,
    alt: 'close-up of a smiling woman’s lips and teeth',
    focus: '50% 55%',
  },
  {
    id: 'composite',
    title: 'Direct composite veneers',
    note: 'A front gap closed during braces, shaped by hand in the chair.',
    before: compBefore,
    after: compAfter,
    alt: 'teeth with braces held open by a cheek retractor',
    focus: '50% 50%',
  },
  {
    id: 'full-arch',
    title: 'Full smile makeover', // confirm treatment
    note: 'Uneven, darker teeth rebuilt into one even, bright arch.',
    before: closeBefore,
    after: closeAfter,
    alt: 'close-up of the upper and lower front teeth',
    focus: '50% 45%',
  },
  {
    id: 'face',
    title: 'Smile transformation', // confirm treatment
    note: 'Seen from a full-face view: a fuller, brighter, more even smile.',
    before: faceBefore,
    after: faceAfter,
    alt: 'front view of a smiling young woman with her eyes blurred for privacy',
    focus: '50% 65%',
  },
];
