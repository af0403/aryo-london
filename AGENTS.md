# ARYO site — working rules for every agent (Codex, Claude, anyone)

More than one AI agent works on this site. These rules keep everyone on one
copy of it. Read them before you change anything.

## One source of truth

- The site lives in GitHub: `af0403/aryo-london`. **`main` is what is live.**
- Vercel project `aryo` (team `afs-projects-f3c729a9`) serves aryo.london and
  auto-deploys production on every push to `main`.
- If it isn't committed and pushed to GitHub, it doesn't exist. Another agent
  can't see it, and the next deploy from `main` will wipe it off the live site.

## Never

- **Never deploy production from the command line** (`vercel --prod`,
  `vercel deploy --prod`, or any deploy of a local working tree). Production
  only ever comes from `main`.
- Never leave work uncommitted at the end of a session.
- Never serve images or files that exist only in a deploy or on one machine.
  Every asset goes into `public/assets/` and gets committed.
- Never force-push `main` or rewrite its history.

## Every session

1. Start from the latest code: `git fetch origin`, then branch from
   `origin/main` (or pull your existing branch and merge `origin/main` into it).
2. Work on a branch named for the task, e.g. `images/noir-jacket-open`,
   `feat/campaign-archive`.
3. Commit as you go and push the branch. Vercel builds a preview for every
   branch, so share that link for review.
4. Going live = merging the branch into `main`. Customer-facing changes go live
   **only after Aryo has approved them**. Pull `origin/main` first and resolve
   any conflicts before you merge.
5. Before you finish, check `git status` is clean and `git log origin/<branch>..`
   is empty. That means everything is pushed.

## Who does what

- **Codex owns imagery**: generating, replacing and retouching product,
  campaign and editorial images.
- **Claude owns site features and code**: pages, components, SEO, checkout.
- If you need to touch the other agent's area, keep the change small and say so
  in the commit message.
- To see what's in flight before you start: `git branch -r` and
  `git log origin/main..origin/<branch> --oneline` for each open branch.

<claude-mem-context>
# Memory Context

# [you-just-remade-my-alfdigital-website] recent context, 2026-04-27 11:05pm GMT+1

Legend: 🎯session 🔴bugfix 🟣feature 🔄refactor ✅change 🔵discovery ⚖️decision
Format: ID TIME TYPE TITLE
Fetch details: get_observations([IDs]) | Search: mem-search skill

Stats: 9 obs (3,328t read) | 181,049t work | 98% savings

### Apr 24, 2026
5 3:52p 🔵 ARYO London Website Audit — Tech Stack and Full Route Map
### Apr 27, 2026
22 3:19a ⚖️ ARYO Launch Stack: Custom Next.js + Stripe + Supabase (No Shopify)
23 " 🟣 ARYO Next.js 15 Store Scaffold Built — Full Product, Cart, and Checkout Routes
24 " 🔵 ARYO Launch Blockers: Stripe Not Wired, Trouser Stock Unconfirmed, Supabase Not Connected
25 3:57a 🔵 npm Cache Permissions Error in Codex Sandbox — Root-Owned Files Workaround
30 4:42a 🟣 ARYO Store — Cart Stock Guard + Sold-Out State Added
31 " 🟣 ARYO Store — launch-config supportHref Fallback to Instagram
32 " 🔴 globals.css Patch Failure — site-footer Anchor Not Found
36 4:57a 🔵 ALF Digital Next.js Build — Stale .next Output Causing 500 on Dev Server

Access 181k tokens of past work via get_observations([IDs]) or mem-search skill.
</claude-mem-context>