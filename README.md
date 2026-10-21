# ViewVerse

**A clean, fast, no-account-needed platform for browsing and watching movies and TV shows. No login. No subscription. Just watch.**

**Live Site: [viewverse.pages.dev](https://viewverse.pages.dev/)**

> Movie data comes from [TMDB](https://www.themoviedb.org/).
> Streaming is powered by [CineSrc](https://cinesrc.st/), [VidFast](https://vidfast.pro/), and [ScreenScape](https://nxsha.screenscape.me/).

## What It Does

ViewVerse is a web app where you can:

- **Browse** trending, popular, top-rated, now playing, and upcoming movies and TV shows
- **Watch** any movie or TV episode directly in the browser, including full season/episode selection for shows
- **Search** across movies, TV shows, and people all at once
- **Explore by genre** - every genre has its own browsable page
- **Save to My List** - bookmark anything to come back to later (stored locally on your device, no account needed)
- **Discover people** - actor and director profile pages with their full filmography

## Pages at a Glance

| Page                                | What you'll find                                                                                  |
| ----------------------------------- | ------------------------------------------------------------------------------------------------- |
| `/`                                 | Hero spotlight + curated rows (Trending, Popular, Top Rated, Now Playing, Upcoming, Airing Today) |
| `/movies`                           | Full popular movies catalog                                                                       |
| `/movies/top-rated`                 | Highest-rated movies of all time                                                                  |
| `/movies/now-playing`               | What's in theaters right now                                                                      |
| `/movies/upcoming`                  | Coming soon to theaters                                                                           |
| `/tv`                               | Popular TV shows                                                                                  |
| `/tv/top-rated`                     | Highest-rated shows of all time                                                                   |
| `/tv/airing-today`                  | Episodes airing today                                                                             |
| `/tv/on-the-air`                    | Shows currently running                                                                           |
| `/movie/[id]`                       | Full movie detail - cast, crew, trailer, similar titles, and a Watch button                       |
| `/tv/[id]`                          | Full show detail - seasons, episodes, cast, trailer, similar shows                                |
| `/watch/movie/[id]`                 | Full-screen movie player                                                                          |
| `/watch/tv/[id]/[season]/[episode]` | Full-screen TV episode player                                                                     |
| `/person/[id]`                      | Actor/director profile with acting credits and crew work                                          |
| `/search`                           | Search movies, TV shows, and people in one place                                                  |
| `/genre/[id]`                       | Browse titles by genre                                                                            |
| `/whitelist`                        | Your saved list - filter by Movies or TV Shows, remove items, or clear all                        |

## My List (Watchlist)

The watchlist is entirely local - nothing is sent to any server.

- Tap the **bookmark icon** on any movie or show to save it
- Access your list anytime from the header or `/whitelist`
- Holds up to 500 titles
- Syncs across tabs in the same browser automatically
- Remembers when each title was added

## Tech Overview

| Thing      | What it is                                                                                                                                                              |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework  | [Nuxt 4](https://nuxt.com) (Vue 3)                                                                                                                                      |
| Styling    | [Tailwind CSS v4](https://tailwindcss.com) + scoped component CSS                                                                                                       |
| Movie data | [TMDB API](https://www.themoviedb.org/documentation/api)                                                                                                                |
| Streaming  | [CineSrc](https://cinesrc.st/), [VidFast](https://vidfast.pro/), [ScreenScape](https://nxsha.screenscape.me/) (embedded players with auto-failover and source selector) |
| Fonts      | Satoshi · Cormorant Garamond · JetBrains Mono                                                                                                                           |
| Deployment | Static - hosted on Cloudflare Pages                                                                                                                                     |

## Credits & Disclaimers

- Movie and TV data provided by [TMDB](https://www.themoviedb.org/). This product uses the TMDB API but is not endorsed or certified by TMDB.
- Streaming provided by [CineSrc](https://cinesrc.st/), [VidFast](https://vidfast.pro/), and [ScreenScape](https://nxsha.screenscape.me/).
- ViewVerse is an independent personal project for learning purposes and is not affiliated with TMDB, CineSrc, VidFast, ScreenScape, or any studio or content owner.
