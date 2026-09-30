import React, { useState } from 'react';

const ATRIBUTOS = ['PAC', 'SHO', 'PAS', 'DRI', 'DEF', 'PHY'];
const TCOL = { 'S+': '#f5c542', 'S': '#e0a030', 'A': '#2ecc71', 'B': '#4aa3ff', 'C': '#8a9a92' };

const calcOvr = (a) => Math.round(ATRIBUTOS.reduce((s, k) => s + (a[k] || 0), 0) / 6);
const getTier = (o) => (o >= 90 ? 'S+' : o >= 80 ? 'S' : o >= 70 ? 'A' : o >= 60 ? 'B' : 'C');

export function FutCard({ player, ovr, tier, onClose }) {
  const getPoint = (i, r) => {
    const rad = (-90 + 60 * i) * Math.PI / 180;
    return [100 + r * Math.cos(rad), 100 + r * Math.sin(rad)];
  };

  const getPolyPoints = (factorFn) => {
    return ATRIBUTOS.map((k, i) => {
      const [x, y] = getPoint(i, 70 * factorFn(k));
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
  };

  return (
    <div className="fut" style={{ background: `linear-gradient(160deg, ${TCOL[tier]}, #7a5a10 140%)` }}>
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="o">{ovr}</div>
          <b>{player.pos}</b>
          <div><b>{tier}</b></div>
          <div style={{ fontSize: '12px', fontWeight: 700 }}>Pie {player.pie || 'Derecho'}</div>
        </div>
        <span className="av">
          {player.foto ? <img src={player.foto} alt="" /> : (player.nick || player.name).slice(0, 2).toUpperCase()}
        </span>
      </div>

      <div style={{ textAlign: 'center', fontWeight: 900, fontSize: '20px', margin: '6px 0' }}>
        {player.nick || player.name}
        <div style={{ fontSize: '12px', fontWeight: 600 }}>{player.name}</div>
      </div>

      <svg viewBox="0 0 200 200" width="100%" style={{ maxWidth: '240px', display: 'block', margin: 'auto' }}>
        {[0.33, 0.66, 1].map((f, idx) => (
          <polygon key={idx} points={getPolyPoints(() => f)} fill="none" stroke="#1a120033" strokeWidth="1" />
        ))}
        <polygon points={getPolyPoints((k) => player.a[k] / 99)} fill="#1a1200" fillOpacity="0.35" stroke="#1a1200" strokeWidth="2" />
        {ATRIBUTOS.map((k, i) => {
          const [x, y] = getPoint(i, 88);
          return (
            <text key={k} x={x} y={y + 4} fontSize="11" fontWeight="700" textAnchor="middle" fill="#1a1200">
              {k}
            </text>
          );
        })}
      </svg>

      <div className="st">
        {ATRIBUTOS.map((k) => (
          <div key={k}>
            <b>{player.a[k]}</b>{k}
          </div>
        ))}
      </div>
      
      {onClose && <button style={{ marginTop: '12px', width: '100%' }} onClick={onClose}>Cerrar</button>}
    </div>
  );
}

export default function App() {
  const [view, setView] = useState('rank');
  const [players] = useState([
    { id: '1', name: 'Matías Rojas', nick: 'Matu', pos: 'DEL', a: { PAC: 92, SHO: 94, PAS: 84, DRI: 90, DEF: 45, PHY: 80 } },
    { id: '2', name: 'Diego Soto', nick: 'Dieguito', pos: 'MED', a: { PAC: 80, SHO: 78, PAS: 92, DRI: 88, DEF: 68, PHY: 76 } },
    { id: '3', name: 'Felipe Núñez', nick: 'Fefo', pos: 'DEF', a: { PAC: 76, SHO: 52, PAS: 74, DRI: 68, DEF: 90, PHY: 88 } },
    { id: '4', name: 'Camilo Vera', nick: 'Cami', pos: 'DEL', a: { PAC: 88, SHO: 82, PAS: 70, DRI: 84, DEF: 40, PHY: 72 } },
  ]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  return (
    <div className="wrap">
      <h1>⚽ Invalidos <span>FC</span></h1>

      <div id="nav" className="row" style={{ marginBottom: '12px' }}>
        {['rank', 'match', 'teams', 'data'].map((tab) => (
          <button
            key={tab}
            className={view === tab ? 'on' : ''}
            onClick={() => setView(tab)}
          >
            {tab === 'rank' && '🏆 Ranking'}
            {tab === 'match' && '⚽ Partido'}
            {tab === 'teams' && '⚖️ Equipos'}
            {tab === 'data' && '💾 Datos'}
          </button>
        ))}
      </div>

      {view === 'rank' && (
        <div className="pn">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Jugador</th>
                <th>POS</th>
                <th>CAT</th>
                <th>OVR</th>
              </tr>
            </thead>
            <tbody>
              {players.map((p, idx) => {
                const ovr = calcOvr(p.a);
                const tier = p.manual || getTier(ovr);
                return (
                  <tr key={p.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedPlayer(p)}>
                    <td style={{ color: 'var(--mu)' }}>{idx + 1}</td>
                    <td><b>{p.name}</b> <small>{p.nick}</small></td>
                    <td>{p.pos}</td>
                    <td><span className="b">{tier}</span></td>
                    <td style={{ fontSize: '18px', fontWeight: 800, color: 'var(--go)' }}>{ovr}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {selectedPlayer && (
        <div style={{ position: 'fixed', inset: 0, background: '#000b', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9, padding: '16px' }}>
          <div style={{ maxWidth: '380px', width: '100%' }}>
            <FutCard
              player={selectedPlayer}
              ovr={calcOvr(selectedPlayer.a)}
              tier={selectedPlayer.manual || getTier(calcOvr(selectedPlayer.a))}
              onClose={() => setSelectedPlayer(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}