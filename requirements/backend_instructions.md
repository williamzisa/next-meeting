# Project Overview

The project is a web application that allows users to manage their meetings with more teams, sharing key results, risks, and initiatives, with the aim of improving the quality of the meetings and the alignment of the teams generating New Initiatives.

# Tech Stack

- Next.js
- Tailwind CSS
- Shadcn/UI
- Supabase

# Tables already created

table meetings (
id bigint not null primary key,
created_at timestamp default now() not null,
date date default now()
);

table teams (
id bigint not null primary key,
created_at timestamp default now() not null,
company text
);

table key_results (
id bigint not null primary key,
created_at timestamp default now(),
indicator text,
forecast double,
target double,
gap double,
result_type bigint,
date date default now(),
meeting_id bigint references meetings (id),
value double,
team_id bigint references teams (id)
);

table shared_risks (
id bigint not null primary key,
created_at timestamp default now() not null,
description text,
meeting_id bigint references meetings (id),
team_id bigint references teams (id),
key_result_id bigint references key_results (id)
);

table new_initiatives (
id bigint not null primary key,
created_at timestamp default now(),
description text,
meeting_id bigint references meetings (id),
team_id bigint references teams (id),
shared_risk_id bigint references shared_risks (id)
);

table shared_initiatives (
id bigint not null primary key,
created_at timestamp default now() not null,
description text,
meeting_id bigint references meetings (id),
team_id bigint references teams (id),
shared_risk_id bigint references shared_risks (id)
);

# Requirements

- Ogni Rischio è connesso ad un Key Result
- Ogni Shared Initiative è connessa ad un Rischio
- Ogni Key Result è connesso ad un Meeting
- Ogni New Initiative è connessa ad un Rischio
- Ogni meeting comprende più team e la sua efficacia dipende dalla quantità di New Initiatives generate in quel meeting
- La qualità di un Team nell'affrontare i meeting può essere misurata in base alla quantità di New Initiatives generate in tutti i meeting in cui ha partecipato

# Documentation

- [Supabase](https://supabase.com/docs)
- [Next.js](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn/UI](https://ui.shadcn.com/docs)
