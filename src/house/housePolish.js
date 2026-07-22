// House Polish module - first step toward modular AI Sims OS
// This keeps visual upgrades separate from the simulation logic.

export const housePolish = {
  version: 'v1',
  features: {
    roofVolume: true,
    exteriorWindows: true,
    doors: true,
    terrain: true,
    groundingShadow: true
  }
};

export function getHousePolishStatus(){
  return housePolish;
}
