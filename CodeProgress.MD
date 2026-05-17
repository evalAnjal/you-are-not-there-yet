# Code Progress

-## DONE
- [x] Removed Supabase integration and helper
	(backend now uses a simple filesystem-backed stub at `app/api/drops/route.ts`)
- [x] Backend route `POST /api/drops` created
- [x] Backend route `GET /api/drops` created
- [x] Origin deploy flow updated to call backend (`/api/drops`)
- [x] Alphanumeric code generation restored in agent terminal
- [x] Mobile code display updated to grouped format (`XXX-XXX`)
- [x] Current location option added on origin page

-## TODO
- [ ] Wire briefing page to fetch real deployments from `GET /api/drops` (replace stub)
- [ ] Wire archive page to fetch real deployments from `GET /api/drops` (replace stub)
- [ ] Add backend input validation (code/lat/lng/radius/message)
- [ ] Add user-friendly API error messages on UI
- [ ] End-to-end test: deploy -> save -> list in briefing/archive
- [ ] Add backend input validation (code/lat/lng/radius/message)
- [ ] Add user-friendly API error messages on UI
- [ ] End-to-end test: deploy -> save in Supabase -> list in briefing/archive

## Individual Function Inventory

### Frontend: Main Compass
- `DeadDropHunter` (`app/page.tsx`) - main compass hunter screen
- `getSignalColor` (`app/page.tsx`) - UI color state by distance
- `getBgColor` (`app/page.tsx`) - background state by distance
- `getBorderColor` (`app/page.tsx`) - border state by distance

### Frontend: Agent Terminal
- `generateCode` (`app/agent/page.tsx`) - alphanumeric drop code generator
- `TerminalBootSequence` (`app/agent/page.tsx`) - startup overlay
- `CodeConfirmation` (`app/agent/page.tsx`) - deployed code display/copy UI
- `handleCopy` (`app/agent/page.tsx`) - clipboard copy action
- `BriefingRoom` (`app/agent/page.tsx`) - deployment summary list
- `OriginPoint` (`app/agent/page.tsx`) - deployment creation UI
- `handleDeploy` (`app/agent/page.tsx`) - local deploy handler
- `ArchiveLogbook` (`app/agent/page.tsx`) - historical deployment cards
- `AgentTerminal` (`app/agent/page.tsx`) - root terminal screen and tab nav
- `handleCodeGenerated` (`app/agent/page.tsx`) - inject newly created drop into state

### Frontend: Origin Route
- `generateCode` (`app/agent/origin/page.tsx`) - alphanumeric code generator for route page
- `OriginPage` (`app/agent/origin/page.tsx`) - route-level deploy page
- `useCurrentLocation` (`app/agent/origin/page.tsx`) - browser geolocation capture
- `handleDeploy` (`app/agent/origin/page.tsx`) - POST deployment to backend

### Backend: API Routes
- `POST` (`app/api/drops/route.ts`) - save new drop (filesystem-backed stub)
- `GET` (`app/api/drops/route.ts`) - read drops (filesystem-backed stub)

## Quick Backend Milestone Tracking
- [x] M1: Backend scaffolding done (client + routes)
- [ ] M2: Replace filesystem stub with real DB (Postgres/Neon)
- [ ] M3: Data model created in chosen DB
- [ ] M4: Frontend listing connected to backend
- [ ] M5: Validation + error handling complete
- [ ] M6: End-to-end verified
