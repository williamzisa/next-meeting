## Project Overview

- Crea una semplice applicazione ad una pagina che consenta di rendere più efficaci i meeting dei reparti in azienda.
- L'applicazione dovrà avere un menù a sinistra per selezionare il team, oltre che un dropdown per selezionare/aggiungere/eliminare il meeting a cui la pagina si riferisce.
- In ogni meeting, per ogni team, dovranno essere riportati i risultati più rilevanti (Key Results), i Rischi condivisi con gli altri reparti, le Iniziative condivise con gli altri reparti
- L'efficacia dell'applicazione deriva dalla creazione di Nuove Iniziative, che si dovranno trovare evidenziate nell'ultima parte della pagina.
- La dashboard iniziale - quando nessun meeting è selezionato - dovrà mostrare un riepilogo dei meeting e della loro efficacia, misurata in termini di Nuove Iniziative generate in quel meeting.

## Features Requirements

- The application should be responsive and look good on both desktop and mobile devices.
- The application should be built using Next.js and Tailwind CSS.
- L'applicazione dovrà essere coerente con i colori di LinkHub, con la preponderanza di bianco e blu #3a88ff.

## Relevant Docs

- [Next.js](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## Current file structure

NEXT-MEETING
├── .next
├── node_modules
├── public
│ └── requirements
│ ├── backend_instructions...
│ └── frontend_instructions...
└── src
├── app
│ ├── fonts
│ │ └── favicon.ico
│ ├── globals.css
│ ├── layout.tsx
│ └── page.tsx
├── components
│ └── ui
│ ├── button.tsx
│ ├── card.tsx
│ ├── dropdown-menu.tsx
│ ├── form.tsx
│ ├── input.tsx
│ └── label.tsx
└── lib
└── utils.ts
├── .eslintrc.json
├── .gitignore
├── components.json
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
└── tailwind.config.ts
└── tsconfig.json

## Rules

- The entire codebase should be commented on plain English.
- All new components should be added to the src/components/ folder.
- All new pages should be added to the src/app/ folder.
