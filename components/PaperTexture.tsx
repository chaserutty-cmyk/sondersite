/**
 * PaperTexture — disabled.
 *
 * All SVG-filter and feTurbulence approaches (fixed overlay, data URI
 * background-image) caused Safari to software-render a full-viewport filter
 * pass on every paint, freezing the browser.
 *
 * The ivory background is sufficient for now. A true static PNG grain tile
 * can be added later as a public asset with no filter evaluation at runtime.
 */
export default function PaperTexture() {
  return null;
}
