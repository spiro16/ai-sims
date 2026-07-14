# AI Sims OS

AI Sims OS je vizualni operativni sustav za AI agente: mala Sims-style AI kompanija u kojoj agenti imaju sobe, zadatke, modele, potrebe i ponašanje.

Projekt je sada prebačen na **React + Vite + PixiJS**, ali za praćenje procesa imamo i poseban standalone live preview koji se otvara direktno kao igra.

## Prati proces uživo

### Najstabilniji live preview

```txt
https://raw.githack.com/spiro16/ai-sims/main/live.html
```

Ovaj link otvara projekt direktno u browseru bez StackBlitz editora, bez npm installa i bez čekanja GitHub Pages builda. Kad ažuriramo `live.html`, samo refreshaj taj link.

### GitHub Pages

```txt
https://spiro16.github.io/ai-sims/
```

GitHub Pages se automatski deploya iz `main` grane preko GitHub Actions workflowa. Koristit ćemo ga kao glavni public URL kad build bude stabilan.

### StackBlitz dev okruženje

```txt
https://stackblitz.com/github/spiro16/ai-sims?embed=1&view=preview
```

Ako želiš i kod i preview, koristi obični StackBlitz URL:

```txt
https://stackblitz.com/github/spiro16/ai-sims
```

## Lokalno pokretanje

```bash
npm install --legacy-peer-deps
npm run dev
```

Zatim otvori URL koji Vite prikaže u terminalu.

## Trenutno stanje

- React app shell
- PixiJS renderer
- standalone live preview
- dvokatna cutaway kuća
- zidovi, podovi i stepenice
- mali crtani agenti
- izbor kata
- zoom/pan kontrole
- osnovni game loop
- agent status panel

## Sljedeći konkretni milestone

### Engine v2.1

- stabilan live preview za praćenje razvoja
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
