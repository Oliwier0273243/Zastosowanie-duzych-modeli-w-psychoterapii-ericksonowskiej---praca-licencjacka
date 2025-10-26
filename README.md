# System Wspierający Psychoterapeutów Nurtu Ericksonowskiego

## Wstęp

We współczesnej psychoterapii, spośród dziesiątek różnych nurtów, większość zdaje się podążać w kierunku deterministyczności i sztywnych reguł.  
Na tym tle wyróżnia się **psychoterapia ericksonowska**, zapoczątkowana przez **Miltona H. Ericksona**, bazująca na wewnętrznych zasobach pacjenta i indywidualnym podejściu do procesu terapeutycznego.

Inspiracją dla tej aplikacji jest właśnie **elastyczność** i **kontekstowość** tego nurtu — cechy, które odnajdujemy również w działaniu współczesnych dużych modeli językowych (LLM).  
Projekt łączy więc idee psychoterapii ericksonowskiej z nowoczesnymi technologiami sztucznej inteligencji, tworząc **system wieloagentowy** wspierający psychoterapeutów w pracy koncepcyjnej, diagnostycznej i edukacyjnej.

---

## Cel i Zakres Prac

Celem projektu jest opracowanie aplikacji badawczej, która:
- wspiera psychoterapeutów nurtu ericksonowskiego poprzez wykorzystanie **dużych modeli językowych (LLM)**,
- demonstruje możliwości **architektury systemów wieloagentowych** w kontekście psychoterapii,
- bada potencjał AI w tworzeniu kontekstowych, spersonalizowanych odpowiedzi terapeutycznych.

### Zakres funkcjonalny:
- zarządzanie danymi pacjentów i notatkami terapeutycznymi,  
- czytanie książek z dynamicznym tłumaczeniem,  
- moduł czatu AI w czasie rzeczywistym (WebSocket + Socket.IO),  
- wieloagentowa architektura sztucznej inteligencji,  
- możliwość rozszerzania funkcjonalności o kolejne wyspecjalizowane agenty i narzędzia.  

> Projekt ma **charakter badawczo-eksploracyjny** i **nie jest przeznaczony do użytku komercyjnego**.  
> System korzysta z API OpenAI oraz Pinecone, co nie jest zgodne z wymogami prawnymi dotyczącymi przetwarzania danych wrażliwych (np. medycznych).

---

## Architektura Systemu

System został zbudowany w oparciu o **Node.js (Express.js)** z wykorzystaniem:

- MongoDB — baza danych użytkowników, pacjentów, notatek i czatów,  
- Socket.IO — komunikacja w czasie rzeczywistym,  
- OpenAI API — generowanie treści terapeutycznych i analiz,  
- Pinecone — wektorowe wyszukiwanie semantyczne (RAG),  
- system agentów AI — każdy agent odpowiada za odrębny aspekt pracy terapeutycznej.
---

## Technologie

| Warstwa | Technologia |
|----------|--------------|
| Backend | Node.js (Express.js) |
| Komunikacja | Socket.IO |
| Baza danych | MongoDB |
| Wektory semantyczne | Pinecone |
| Sztuczna inteligencja | OpenAI GPT-4 / GPT-5 |
| Logika aplikacji | System wieloagentowy |
| Zarządzanie środowiskiem | dotenv |