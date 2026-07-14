# AI Sims OS

AI Sims OS je vizualni operativni sustav za AI agente: mala Sims-style AI kompanija u kojoj agenti imaju sobe, zadatke, modele, potrebe i ponašanje.

Projekt je sada prebačen na **React + Vite + PixiJS**. Stari HTML/CSS demo više nije glavni smjer.

## Otvori odmah

### Opcija A — GitHub Pages

```txt
https://spiro16.github.io/ai-sims/
```

GitHub Pages se automatski deploya iz `main` grane preko GitHub Actions workflowa.

### Opcija B — StackBlitz live dev preview

```txt
https://stackblitz.com/github/spiro16/ai-sims
```

Ovo je najkorisnije dok razvijamo jer možeš otvoriti projekt kao live Vite aplikaciju u browseru i pratiti promjene.

## Lokalno pokretanje

```bash
npm install --legacy-peer-deps
npm run dev
```

Zatim otvori URL koji Vite prikaže u terminalu.

## Trenutno stanje

- React app shell
- PixiJS renderer
- dvokatna cutaway kuća
- zidovi, podovi i stepenice
- mali crtani agenti
- izbor kata
- zoom kontrole
- osnovni game loop
- agent status panel

## Sljedeći konkretni milestone

### Engine v2.1

- popravljeni live preview i stabilan deploy
- bolji Sims-style cutaway osjećaj
- kamera koja se može pomicati
- sobe s vratima
- agenti se kreću po pathfinding točkama
- stepenice povezuju katove

### Engine v2.2

- sprite animacije hodanja
- task board
- agenti delegiraju zadatke
- sastanci u meeting roomu
- timeline događaja

### Engine v3

- FastAPI backend
- SQLite memorija
- Ollama bridge
- stvarni lokalni AI agenti
- GitHub/terminal alati

## Vizija

Cilj nije običan dashboard, nego osjećaj da gledaš živu AI firmu: agenti hodaju po kući, razgovaraju, ulaze u sobe, rade na zadacima i pamte što se dogodilo.
