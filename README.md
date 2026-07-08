# AI Sims OS

Sims-style web aplikacija za upravljanje AI agentima po sobama.

Ovo je prvi MVP koji radi direktno u browseru:

- sobe kao AI firma / kuća
- AI agenti po sobama
- drag-and-drop premještanje agenata
- klik na agenta za detalje
- CPU/RAM/Fokus statusi
- memorija agenta
- chat s agentom
- simulacija vremena i aktivnosti
- spremanje svijeta u browser `localStorage`

## Kako otvoriti odmah

1. Otvori `index.html` u browseru.
2. Klikni `Pokreni simulaciju`.
3. Vuci agente između soba.
4. Klikni agenta za detalje.

## Kako launchati kao web app preko GitHub Pages

1. Otvori repo na GitHubu: `spiro16/ai-sims`
2. Idi na **Settings**
3. Lijevo klikni **Pages**
4. Pod **Build and deployment** odaberi:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
5. Klikni **Save**
6. Nakon minute-dvije GitHub će dati public URL.

Tipični URL će biti:

```txt
https://spiro16.github.io/ai-sims/
```

## Sljedeći koraci

### Faza 1 — pravi web app

- Vite + React
- bolji state management
- pravi task board
- agent timeline
- animacije kretanja

### Faza 2 — lokalni AI

- FastAPI backend
- SQLite baza
- Ollama bridge
- lokalni modeli poput Llama, Qwen, Mistral
- agent memory storage

### Faza 3 — AI OS

- agenti delegiraju posao
- GitHub integracija
- Gmail/Calendar integracije
- plugin system
- terminal tools
- replay rada

## Lokalni Ollama koncept

Cloud GitHub Pages ne može direktno koristiti tvoj lokalni Ollama zbog browser/CORS ograničenja.

Za lokalni AI koristit ćemo kasnije mali backend:

```txt
Browser UI -> FastAPI backend -> Ollama lokalno
```

To će omogućiti da agenti stvarno pričaju preko lokalnog modela.
