# Product Admin Dashboard

A small admin dashboard to log in and manage products, built with Next.js (App Router), Tailwind CSS and Axios, using the free [DummyJSON](https://dummyjson.com) API.

## Live link
[add your Vercel link here]

## Tech stack
- Next.js (App Router) + React
- Tailwind CSS
- Axios (one shared instance with interceptors)

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:3000. Log in with:
- Username: `emilys`
- Password: `emilyspass`

## What's finished
- Login with DummyJSON `/auth/login`, error messages for wrong details, logout, and route protection so only logged-in users can open `/products`.
- Product list with a table on desktop and cards on mobile, showing image, title, category, price, rating and stock.
- Pagination with page numbers, Previous/Next, page size (10/20/50), and a "Showing X–Y of Z" line. Page and page size live in the URL.
- Search with debounce (waits for the user to stop typing) and request cancellation, so a slow older search response can never overwrite a newer one.
- Category filter and sort by price/rating/title. Search and category are mutually exclusive (see note below); sort works with both.
- Product details page at `/products/[id]` with an image gallery, description, price and reviews. A dedicated not-found page for invalid or missing ids.
- Add, edit, and delete with form validation and a confirm dialog before deleting.
- Loading, empty, and error states (with Retry) across list and details pages.
- Invalid URL values (`?page=abc`, `?page=999`, bad category/sort) are handled without breaking the page.
- Repeated fast clicks on Login/Save only send one request.

## Project structure

src/
app/ - pages (login, products, products/[id], products/new, products/[id]/edit)
components/ - small reusable UI pieces
services/ - all API calls, plus the local-overlay logic for add/edit/delete
hooks/ - useDebounce
utils/ - param parsing, validation, pagination helpers
lib/axios.js - the one shared Axios instance

# Notes

## Design choices
- **Token storage:** the login token is kept in `localStorage` and attached to every request by an Axios request interceptor. This is simple to explain, though it means route protection has to run in the browser (a `useEffect` check) rather than in middleware, since middleware can't read localStorage.
- **Search vs category:** DummyJSON can't search and filter by category at the same time. Choosing a category clears the search box, and typing a search clears the category, so the app always calls one clean endpoint and the pagination total stays accurate. Sorting works with either.
- **Add/edit/delete are not really saved by the API:** DummyJSON returns a realistic success response but doesn't persist the change. I still call the real endpoint first, then store the result in `sessionStorage` as an overlay (added products prepended to the list, edits merged onto whatever the API returns, deletes tracked as hidden ids), so the change is visible in the app and survives a refresh within the same tab. `sessionStorage` (not `localStorage`) was a deliberate choice so demo data doesn't pile up across sessions.
- **URL as the source of truth:** page, page size, search, category and sort are all stored in the URL instead of component state, so refreshing or sharing a link reproduces the same view.

## A problem I faced and how I fixed it
[Write one real thing you ran into while building this — for example: "The search race condition was tricky at first: I debounced the input but a slow request for an earlier search term could still resolve after a faster later one and overwrite the results. I fixed it with an AbortController that cancels the previous request whenever the search/page/limit changes, plus an `ignore` flag in the effect cleanup as a second safeguard."]

## Where AI helped
I used AI assistance to scaffold the project structure and boilerplate (Axios interceptors, the debounce hook, form validation), which I then read through, tested, and adjusted line by line so I could explain every part of it.