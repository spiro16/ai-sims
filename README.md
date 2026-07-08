# AI Sims OS

AI Sims OS je rani web MVP za upravljanje AI agentima kroz sobe, gotovo kao mini Sims/RimWorld kontrolni centar.

Trenutna verzija radi kao obična statička web aplikacija u browseru. Nema instalacije, nema ZIP-a i nema backend-a.

## Što trenutno radi

- sobe/departmani za AI agente
- agenti se mogu premještati drag-and-dropom
- agenti se sami kreću dok simulacija radi
- klik na agenta otvara status panel
- CPU/RAM/fokus indikatori
- memorija po agentu
- chat s agentom
- task queue
- spremanje svijeta u browser localStorage

## Kako pokrenuti preko GitHub Pages

1. Otvori repo na GitHubu.
2. Idi na **Settings**.
3. Lijevo otvori **Pages**.
4. Pod **Build and deployment** odaberi:
   - Source: **Deploy from a branch**
   - Branch: **main**
   - Folder: **/root**
5. Klikni **Save**.
6. Nakon kratkog vremena app će biti na:

```txt
https://spiro16.github.io/ai-sims/
```

## Lokalno pokretanje

Možeš otvoriti `index.html` direktno u browseru.

Za jednostavni lokalni server:

```bash
python3 -m http.server 8000
```

Zatim otvori:

```txt
http://localhost:8000
```

## Roadmap

### Faza 1

- bolji izometrijski floor plan
- task board s kolonama
- kreiranje novih agenata iz UI-ja
- sobe koje imaju specijalna pravila

### Faza 2

- React verzija
- FastAPI backend
- SQLite baza
- WebSocket realtime sync
- lokalni Ollama bridge

### Faza 3

- agenti delegiraju zadatke jedni drugima
- GitHub/Gmail/Telegram/Discord plugin sustav
- replay/time-lapse rada
- dashboard troškova, CPU/RAM i produktivnosti

## Ideja

Cilj je napraviti vizualni operativni sustav za AI agente: umjesto da imaš samo chat prozor, imaš digitalnu firmu s agentima koji rade po sobama, pamte kontekst, preuzimaju zadatke i međusobno surađuju.
