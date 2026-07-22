// House Polish Render v1
// Rendering helpers for the Sims-style cutaway house.

export const houseRenderLayers = {
  terrain: true,
  foundation: true,
  roofVolume: true,
  exteriorWalls: true,
  windows: true,
  doors: true,
  shadows: true
};

export function drawHousePolish(ctx, house) {
  if (!ctx || !house) return;
  // Renderer integration point.
  // Keeps house visuals isolated from simulation logic.
  return houseRenderLayers;
}
