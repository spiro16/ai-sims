// House details layer v1
// Visual upgrade primitives for the Sims-style house.

export const houseDetails = {
  windows: [
    {room:'ceo', style:'large'},
    {room:'meeting', style:'wide'},
    {room:'dev', style:'workshop'},
    {room:'studio', style:'creative'}
  ],
  doors: [
    {from:'ceo', to:'meeting'},
    {from:'dev', to:'meeting'},
    {from:'studio', to:'qa'}
  ],
  exterior: {
    roof:true,
    garden:true,
    path:true,
    foundationShadow:true
  }
};

export function getHouseDetails(){
  return houseDetails;
}
