import React, { useMemo, useRef, useState } from 'react';
import { Stage, Container, Graphics, Text, useTick } from '@pixi/react';

const ROOMS = [
  { id:'lounge', name:'Lounge', floor:0, x:0, y:0, w:260, h:190, color:0xd7e7bc },
  { id:'dev', name:'Development', floor:0, x:270, y:0, w:300, h:190, color:0xb8d8f5 },
  { id:'qa', name:'QA Lab', floor:0, x:0, y:200, w:250, h:180, color:0xd2c5ee },
  { id:'studio', name:'Creative Studio', floor:0, x:260, y:200, w:310, h:180, color:0xf6d69b },
  { id:'ceo', name:'CEO Office', floor:1, x:70, y:0, w:230, h:175, color:0xf3c1d1 },
  { id:'research', name:'Research', floor:1, x:310, y:0, w:260, h:175, color:0xb9e3d0 },
  { id:'meeting', name:'Meeting Room', floor:1, x:150, y:185, w:330, h:165, color:0xe9dfbd },
];

const INITIAL_AGENTS = [
  { id:'alpha', name:'Alpha', role:'CEO agent', model:'Qwen 3', room:'ceo', x:165, y:95, shirt:0xe86c91, hair:0x53372f, task:'Planira sprint', energy:88, focus:82, mood:86 },
  { id:'nova', name:'Nova', role:'Developer', model:'DeepSeek Coder', room:'dev', x:405, y:95, shirt:0x547de8, hair:0x352a28, task:'Gradi engine', energy:73, focus:91, mood:75 },
  { id:'atlas', name:'Atlas', role:'Researcher', model:'Llama 3.3', room:'research', x:430, y:95, shirt:0x42a983, hair:0x68452f, task:'Istražuje workflow', energy:81, focus:87, mood:79 },
  { id:'mira', name:'Mira', role:'Creative agent', model:'Gemma 3', room:'studio', x:410, y:285, shirt:0xe5a33d, hair:0x875339, task:'Radi vizuale', energy:77, focus:74, mood:92 },
  { id:'pixel', name:'Pixel', role:'QA agent', model:'Mistral', room:'qa', x:125, y:285, shirt:0x8a68d8, hair:0x342c42, task:'Testira interakcije', energy:69, focus:89, mood:71 },
  { id:'bolt', name:'Bolt', role:'Ops agent', model:'Qwen 3', room:'lounge', x:135, y:100, shirt:0x67a64c, hair:0x493f31, task:'Prati deploy', energy:64, focus:68, mood:84 },
];

const iso = (x, y, z=0) => ({ x:(x-y)*0.82, y:(x+y)*0.34-z });

function Room({ room, activeFloor }) {
  const z = room.floor * 250;
  const p = iso(room.x, room.y, z);
  const right = iso(room.x + room.w, room.y, z);
  const bottom = iso(room.x, room.y + room.h, z);
  const far = iso(room.x + room.w, room.y + room.h, z);
  const wallH = 95;
  const faded = room.floor !== activeFloor;
  return <Container alpha={faded ? 0.25 : 1}>
    <Graphics draw={g=>{
      g.clear();
      g.lineStyle(3,0x776b61,1);
      g.beginFill(room.color,1);
      g.moveTo(p.x,p.y); g.lineTo(right.x,right.y); g.lineTo(far.x,far.y); g.lineTo(bottom.x,bottom.y); g.closePath(); g.endFill();
      g.beginFill(0xf8efe3,1);
      g.moveTo(p.x,p.y); g.lineTo(right.x,right.y); g.lineTo(right.x,right.y-wallH); g.lineTo(p.x,p.y-wallH); g.closePath(); g.endFill();
      g.beginFill(0xe7dbcc,1);
      g.moveTo(p.x,p.y); g.lineTo(bottom.x,bottom.y); g.lineTo(bottom.x,bottom.y-wallH); g.lineTo(p.x,p.y-wallH); g.closePath(); g.endFill();
      g.lineStyle(2,0xb7aa9c,.5);
      for(let i=1;i<4;i++){
        const a=iso(room.x+(room.w/4)*i,room.y,z); const b=iso(room.x+(room.w/4)*i,room.y+room.h,z);
        g.moveTo(a.x,a.y); g.lineTo(b.x,b.y);
      }
      for(let i=1;i<3;i++){
        const a=iso(room.x,room.y+(room.h/3)*i,z); const b=iso(room.x+room.w,room.y+(room.h/3)*i,z);
        g.moveTo(a.x,a.y); g.lineTo(b.x,b.y);
      }
    }}/>
    <Text text={room.name} x={p.x+12} y={p.y-wallH+14} style={{fontFamily:'Arial',fontSize:16,fontWeight:'700',fill:0x25344d}} />
    <Furniture room={room} />
  </Container>;
}

function Furniture({ room }) {
  const z=room.floor*250;
  const items=[
    {x:room.x+room.w*.28,y:room.y+room.h*.42,t:'▣'},
    {x:room.x+room.w*.66,y:room.y+room.h*.58,t:'▰'},
  ];
  return <>{items.map((it,i)=>{const p=iso(it.x,it.y,z-3);return <Text key={i} text={it.t} x={p.x} y={p.y-24} anchor={.5} style={{fontSize:32,fill:0x4d5d76,dropShadow:true,dropShadowDistance:4}}/>})}</>;
}

function Agent({ agent, room, selected, onSelect }) {
  const ref=useRef();
  const [bob,setBob]=useState(0);
  useTick(delta=>setBob(v=>v+delta*.08));
  const p=iso(agent.x,agent.y,room.floor*250-4);
  const y=p.y-Math.sin(bob)*2;
  return <Container ref={ref} x={p.x} y={y} eventMode="static" cursor="pointer" pointertap={()=>onSelect(agent.id)}>
    {selected && <Graphics y={-78} draw={g=>{g.clear();g.beginFill(0x4ed16f);g.moveTo(0,-18);g.lineTo(11,0);g.lineTo(0,22);g.lineTo(-11,0);g.closePath();g.endFill();}}/>}
    <Graphics draw={g=>{
      g.clear();
      g.beginFill(0x000000,.18);g.drawEllipse(0,6,23,8);g.endFill();
      g.beginFill(agent.shirt);g.drawRoundedRect(-12,-38,24,34,8);g.endFill();
      g.beginFill(0xf0bd8f);g.drawCircle(0,-53,13);g.endFill();
      g.beginFill(agent.hair);g.drawRoundedRect(-13,-66,26,12,6);g.endFill();
      g.beginFill(0x26334d);g.drawRect(-10,-5,7,18);g.drawRect(3,-5,7,18);g.endFill();
    }}/>
    <Text text={agent.name} y={18} anchor={{x:.5,y:0}} style={{fontFamily:'Arial',fontSize:13,fontWeight:'700',fill:0xffffff,stroke:0x1f2a3e,strokeThickness:4}} />
  </Container>;
}

function Staircase() {
  const steps=[];
  for(let i=0;i<10;i++){
    const p=iso(540-i*13,335-i*8,i*22);
    steps.push(<Graphics key={i} draw={g=>{g.clear();g.beginFill(i%2?0xc4b7a7:0xd8cdbf);g.drawPolygon([p.x,p.y,p.x+34,p.y+14,p.x+12,p.y+25,p.x-22,p.y+11]);g.endFill();}}/>);
  }
  return <>{steps}</>;
}

function World({ agents, selected, setSelected, activeFloor }) {
  return <Container x={680} y={510}>
    <Graphics draw={g=>{g.clear();g.beginFill(0x456f48,.28);g.drawEllipse(0,120,720,250);g.endFill();}}/>
    {ROOMS.map(r=><Room key={r.id} room={r} activeFloor={activeFloor}/>)}
    <Staircase/>
    {agents.map(a=>{const r=ROOMS.find(x=>x.id===a.room);return <Agent key={a.id} agent={a} room={r} selected={selected===a.id} onSelect={setSelected}/>})}
  </Container>;
}

export default function App(){
  const [agents,setAgents]=useState(INITIAL_AGENTS);
  const [selected,setSelected]=useState('alpha');
  const [floor,setFloor]=useState(0);
  const [zoom,setZoom]=useState(1);
  const [running,setRunning]=useState(true);
  const current=agents.find(a=>a.id===selected);
  const room=ROOMS.find(r=>r.id===current?.room);
  const moveRandom=()=>setAgents(list=>list.map(a=>Math.random()>.55?{...a,x:Math.max(30,Math.min(540,a.x+(Math.random()*80-40))),y:Math.max(25,Math.min(350,a.y+(Math.random()*70-35)))}:a));
  React.useEffect(()=>{if(!running)return;const id=setInterval(moveRandom,1800);return()=>clearInterval(id)},[running]);
  return <div className="app-shell">
    <header className="topbar"><div><b>◆ AI Sims OS</b><span>PixiJS engine v2</span></div><div className="controls"><button onClick={()=>setFloor(0)} className={floor===0?'active':''}>Prizemlje</button><button onClick={()=>setFloor(1)} className={floor===1?'active':''}>1. kat</button><button onClick={()=>setZoom(z=>Math.max(.65,z-.1))}>−</button><button onClick={()=>setZoom(1)}>⌂</button><button onClick={()=>setZoom(z=>Math.min(1.45,z+.1))}>＋</button></div></header>
    <aside className="left"><h2>AI tim</h2>{agents.map(a=><button key={a.id} onClick={()=>setSelected(a.id)} className={selected===a.id?'agent-row selected':''}><span className="dot"/><span><b>{a.name}</b><small>{a.role}</small></span></button>)}</aside>
    <main className="stage-wrap"><Stage width={window.innerWidth} height={window.innerHeight} options={{backgroundColor:0x8fc9ee,antialias:true,resolution:window.devicePixelRatio||1,autoDensity:true}}><Container scale={zoom}><World agents={agents} selected={selected} setSelected={setSelected} activeFloor={floor}/></Container></Stage><div className="scene-label">Cutaway prikaz · dva kata · PixiJS renderer</div></main>
    <aside className="right"><h2>{current?.name}</h2><p>{current?.role} · {room?.name}</p><span className="model">{current?.model}</span><section><h3>Trenutni zadatak</h3><div className="card">{current?.task}</div></section><section><h3>Potrebe</h3>{['energy','focus','mood'].map(k=><label key={k}>{k}<progress value={current?.[k]} max="100"/></label>)}</section><section><h3>Engine status</h3><div className="card">Katovi, zidovi, stepenice i agenti sada se crtaju u PixiJS-u. Sljedeće: pathfinding, vrata i sprite animacije.</div></section></aside>
    <footer><button onClick={()=>setRunning(false)}>⏸</button><button onClick={()=>setRunning(true)} className={running?'active':''}>▶</button><span>{agents.length} agenata</span></footer>
  </div>
}
