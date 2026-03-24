# S248 Full-Product Walkthrough Findings

**Source:** Patrick's manual walkthrough during rate limit cooldown (2026-03-23)
**Scope:** Full site as shopper (user11) then organizer (user3)
**Finding count:** 114 items across bugs, UX issues, strategic questions, and test data gaps

---

## Category Legend

- **BUG** — Broken functionality, needs dev fix
- **DARK** — Dark mode violation (D-002)
- **DATA** — Test data gap preventing proper testing
- **UX** — Confusing flow, bad labels, missing explanation
- **STRATEGIC** — Product question requiring Patrick decision
- **DUP** — Duplicate/redundant pages or features needing consolidation decision

---

## Homepage

| # | Type | Finding | Recommended Action |
|---|------|---------|--------------------|
| H1 | UX | Treasure hunt can't be closed, displays to everyone as first thing on page | FIX — add dismiss/close button |
| H2 | UX | "Sales near you" cards are basic — should they show more info? Right placement? | STRATEGIC — UX review |
| H3 | STRATEGIC | Should UX redesign the entire homepage? | Schedule UX agent review |
| H4 | BUG | Search doesn't find items or organizer names — only sale name and about | BUG — expand search scope |
| H5 | UX | No dark/light mode toggle in nav | FIX — add toggle |
| H6 | DATA | Most seller accounts should have likes and purchases and history | DATA — seed test data |
| H7 | DATA | Wishlist data should be populated in test accounts | DATA — seed test data |
| H8 | DATA | Favorites should be populated in test accounts | DATA — seed test data |
| H9 | DATA | Trails data should be populated in test accounts | DATA — seed test data |
| H10 | DATA | Loot log data should be populated in test accounts | DATA — seed test data |
| H11 | DATA | Organizers don't have Stripe enabled by default so can't test sales — only 1-2 shouldn't have it flagged as yes | DATA — update seed |
| H12 | DATA | Test data should be redesigned to include various states for all features | DATA — comprehensive seed overhaul |
| H13 | DARK | Organizer-specific pages not dark mode enabled | FIX — dark mode pass |
| H14 | UX | Organizer pages only accessible from frontpage? | FIX — ensure nav access |

## Map

| # | Type | Finding | Recommended Action |
|---|------|---------|--------------------|
| M1 | UX | Plain — no animations or interactivity besides clicking sales for card | STRATEGIC — UX enhancement |
| M2 | UX | Plan Your Route needs starting point (user location?) and ending point (same as start toggle?) | FIX — default to user location |
| M3 | STRATEGIC | Route feature could include promoted listings / ads from thrift stores, gas stations, restaurants (Waze-style) | STRATEGIC — future monetization |
| M4 | DARK | Plan Your Route is white in dark mode | FIX |

## Inspiration

| # | Type | Finding | Recommended Action |
|---|------|---------|--------------------|
| I1 | DATA | Gallery photos broken often — test data issue | DATA — fix image URLs in seed |
| I2 | BUG | Has 2 footers | FIX |
| I3 | UX | Can like but can't wishlist | FIX — add wishlist action |

## Trending

| # | Type | Finding | Recommended Action |
|---|------|---------|--------------------|
| T1 | DATA | Broken thumbnails often — test data | DATA — fix image URLs |
| T2 | UX | Can like but can't wishlist | FIX — add wishlist action |

## Pricing

| # | Type | Finding | Recommended Action |
|---|------|---------|--------------------|
| P1 | BUG | user11 (shopper) shows "Free organizer tier already chosen" — wrong role display | BUG |
| P2 | BUG | No organizer onboarding flow visible for this user | BUG — check onboarding gate |
| P3 | STRATEGIC | How do we automate support? What are "email support", "priority email support", "dedicated account manager", "priority phone support"? Patrick can't handle all this. | STRATEGIC — define support tiers |
| P4 | UX | "Need unlimited team members?" block needs space after box before mini FAQ | FIX — spacing |
| P5 | STRATEGIC | How to incentivize free tier users to use POS so platform gets paid for un-photographed items? | STRATEGIC |
| P6 | STRATEGIC | Should selling be free or nominal fee to list a single sale a la carte? | STRATEGIC |
| P7 | BUG | Trying to go to organizer/dashboard as user11 (shopper) → access denied with no helpful message | BUG — improve error/redirect |

## About

| # | Type | Finding | Recommended Action |
|---|------|---------|--------------------|
| A1 | UX | Needs updated to represent what product has become | FIX — content update |

## Leaderboard

| # | Type | Finding | Recommended Action |
|---|------|---------|--------------------|
| L1 | DATA | No shoppers have badges | DATA — seed badges |
| L2 | STRATEGIC | Only have "The leaderboard updates daily based on activity. Complete sales, earn badges, and climb the ranks!" for explanation | STRATEGIC — needs full spec |
| L3 | STRATEGIC | What are they earning by completing sales? | STRATEGIC — gamification design |
| L4 | STRATEGIC | What do badges represent and why do they want to earn them beyond collecting? | STRATEGIC — gamification design |
| L5 | STRATEGIC | What does climbing the ranks get them? Do they win something? What is it? Is it seasonal? | STRATEGIC — gamification design |
| L6 | STRATEGIC | Should leaderboard be tied to Hunt Pass or future premium tier? | STRATEGIC — monetization decision |
| L7 | STRATEGIC | We have gamification but no real plan for what we've built besides the mechanics | STRATEGIC — needs full gamification spec |
| L8 | BUG | Clicking on an organizer doesn't take you to their page, it says organizer not found | BUG |

## Contact

| # | Type | Finding | Recommended Action |
|---|------|---------|--------------------|
| C1 | UX | Can be shortened to "We're here to help! Reach out with any questions or feedback." | FIX — copy update |
| C2 | BUG | Send a message doesn't seem to do anything when you click send | BUG — check form submission |

## Shopper Dashboard

| # | Type | Finding | Recommended Action |
|---|------|---------|--------------------|
| SD1 | UX | Collection, loyalty etc. buttons should display content within the same page like overview/purchases do, not link away | UX — redesign layout |
| SD2 | DARK | Overview has white elements in dark mode | FIX |
| SD3 | BUG | Overview tries to load "sales near you" in white, then fails | BUG |
| SD4 | BUG | Streak and points show nothing | BUG/DATA |
| SD5 | UX | Upgrade button links to Hunt Pass checkout but no explanation of why to upgrade | UX — add value prop |
| SD6 | BUG | Buttons for purchases, watchlist, saved items, points don't click anywhere — just display numbers | BUG |
| SD7 | UX | "Browse upcoming sales" appears randomly at bottom | UX |
| SD8 | DARK | Pickups has white card in dark mode | FIX |
| SD9 | BUG | Subscribed tab has no test data; following a seller from front page didn't work | BUG |

## Shopper: Collector Passport (/shopper/collector-passport)

| # | Type | Finding | Recommended Action |
|---|------|---------|--------------------|
| CP1 | DATA | No data to test with | DATA |
| CP2 | UX | What are "specialties" and "keywords"? No text explaining what they are or why | UX — add explanatory copy |
| CP3 | BUG | 2 footers | FIX |

## Shopper: Loyalty (/shopper/loyalty)

| # | Type | Finding | Recommended Action |
|---|------|---------|--------------------|
| LY1 | STRATEGIC | What is this in relation to leaderboard points and Hunt Pass? | STRATEGIC — gamification spec |
| LY2 | STRATEGIC | We have gaming mechanics but no game | STRATEGIC — needs full gamification spec |
| LY3 | UX | What are stamps? | UX — needs explanation |
| LY4 | UX | What are milestones? | UX — needs explanation |
| LY5 | UX | What are badges and are they the same as leaderboard badges? | UX — needs explanation |
| LY6 | UX | When do users get benefits from loyalty? | UX — needs explanation |
| LY7 | UX | What benefits do they get? | UX — needs explanation |
| LY8 | UX | How do they get those benefits? | UX — needs explanation |
| LY9 | UX | Why do they get those benefits? | UX — needs explanation |
| LY10 | UX | Where are benefits displayed or accessed? | UX — needs explanation |
| LY11 | BUG | 2 footers | FIX |

## Shopper: Alerts (/shopper/alerts)

| # | Type | Finding | Recommended Action |
|---|------|---------|--------------------|
| AL1 | DUP | Is this the same as wishlist? Should we rename? | STRATEGIC — feature overlap |
| AL2 | DARK | White text on white element in dark mode | FIX |
| AL3 | UX | Keywords and tags present but no distinction or explanation | UX — add explanatory copy |
| AL4 | UX | Can't search for matching items right from the alert card, only edit or delete | FIX — add search action |
| AL5 | BUG | 2 footers | FIX |

## Shopper: Trails (/shopper/trails)

| # | Type | Finding | Recommended Action |
|---|------|---------|--------------------|
| TR1 | BUG | Completely broken — can't create new trail, no data | BUG |
| TR2 | BUG | 2 footers | FIX |

## Shopper: Loot Log & Receipts

| # | Type | Finding | Recommended Action |
|---|------|---------|--------------------|
| LL1 | DATA | No sales data to test with | DATA |

## Shopper: Favorites (/shopper/favorites)

| # | Type | Finding | Recommended Action |
|---|------|---------|--------------------|
| FV1 | DUP | Lots of overlap with alerts/wishlist | STRATEGIC — consolidation decision |
| FV2 | UX | "My Wishlists" in dropdown goes to page called "Favorites" | FIX — label consistency |

## Profile

| # | Type | Finding | Recommended Action |
|---|------|---------|--------------------|
| PR1 | UX | Whole page may need redesign | STRATEGIC — UX review |
| PR2 | UX | Hunt Pass prominent but what is it in this context? Points shown but what are they good for? | UX — needs explanation |
| PR3 | DATA | Bids, referrals — no test data | DATA |
| PR4 | UX | Referral points — different from other points? | STRATEGIC — gamification spec |
| PR5 | UX | Sale interests — how do they differ from wishlist/alerts? | STRATEGIC — feature overlap |
| PR6 | UX | Push notifications toggle — here or in settings? | UX — pick one location |

## Settings

| # | Type | Finding | Recommended Action |
|---|------|---------|--------------------|
| S1 | UX | Which notifications actually matter? | UX — review notification list |
| S2 | DUP | What's the difference between settings and profile? Combine or further separate? | STRATEGIC |
| S3 | BUG | 2 footers | FIX |

## Notification Bell

| # | Type | Finding | Recommended Action |
|---|------|---------|--------------------|
| N1 | DATA | Can't check — no data in the system | DATA |

## FAQ

| # | Type | Finding | Recommended Action |
|---|------|---------|--------------------|
| F1 | BUG | ▼ displaying on each question block | BUG — fix character rendering |
| F2 | BUG | "Still have questions? Contact our support team →" — arrow character displaying literally | BUG — fix character rendering |
| F3 | BUG | "Looking for the full walkthrough? Read the Organizer Guide →" — arrow character displaying literally | BUG — fix character rendering |
| F4 | UX | Organizer guide isn't referenced enough from the rest of site copy | FIX — add more links |

## Organizer: Dropdown Menu (as user3)

| # | Type | Finding | Recommended Action |
|---|------|---------|--------------------|
| OD1 | UX | "Organizer Dashboard" and "My Dashboard" (shopper) ambiguity | FIX — distinct labels |
| OD2 | UX | "My Profile" appears for both organizer and shopper — ambiguous | FIX — distinct labels |
| OD3 | UX | Settings very different from shopper version and way more complete | STRATEGIC — parity review |

## Organizer Dashboard

| # | Type | Finding | Recommended Action |
|---|------|---------|--------------------|
| ODB1 | UX | POS should be more prominent | FIX — elevate POS placement |

## Organizer: Print Inventory

| # | Type | Finding | Recommended Action |
|---|------|---------|--------------------|
| PI1 | BUG | Print button takes forever and tries to print whole page with multiple white pages | BUG |
| PI2 | UX | Can't select individual sales to print | FIX |

## Organizer: Typology (/organizer/typology)

| # | Type | Finding | Recommended Action |
|---|------|---------|--------------------|
| TY1 | BUG | Broken — bad black text on dark background | BUG + DARK |

## Organizer: Command Center

| # | Type | Finding | Recommended Action |
|---|------|---------|--------------------|
| CC1 | DATA | No data so can't test | DATA |
| CC2 | DATA | Fraud signals has no data | DATA |
| CC3 | UX | Offline mode — how do they use it? | STRATEGIC — needs spec |
| CC4 | UX | When is offline mode needed? | STRATEGIC — needs spec |
| CC5 | UX | Does offline mode work for the POS and Cards? | STRATEGIC — needs spec |
| CC6 | UX | How are they alerted they have stuff to sync? | STRATEGIC — needs spec |

## Organizer: Appraisal Requests

| # | Type | Finding | Recommended Action |
|---|------|---------|--------------------|
| AP1 | UX | Sent appraisal request but how do others receive them? | STRATEGIC — needs full flow spec |
| AP2 | UX | Do they have to come back to the appraisal page when the request is no longer pending? | STRATEGIC — needs full flow spec |
| AP3 | UX | What do they get from providing estimates in the community feed? | STRATEGIC — needs full flow spec |

## Organizer: Item Library

| # | Type | Finding | Recommended Action |
|---|------|---------|--------------------|
| IL1 | BUG | Broken | BUG — fix page |
| IL2 | UX | How do we add items to the library? | UX — needs explanation |
| IL3 | UX | What is the library item vs a regular item? | UX — needs explanation |
| IL4 | UX | How are they distinguished? | UX — needs explanation |

## Organizer: Flip Reports

| # | Type | Finding | Recommended Action |
|---|------|---------|--------------------|
| FR1 | BUG | "Error Unable to load flip report. Please try again." | BUG |

## Organizer: Webhooks

| # | Type | Finding | Recommended Action |
|---|------|---------|--------------------|
| WH1 | UX | No way to know how to begin testing these | UX — needs documentation |

## Organizer: Bounties

| # | Type | Finding | Recommended Action |
|---|------|---------|--------------------|
| BO1 | DATA | No data | DATA |

## Organizer: Reputation

| # | Type | Finding | Recommended Action |
|---|------|---------|--------------------|
| RE1 | UX | Why is it hidden in community? | STRATEGIC — role assignment |
| RE2 | DATA | No data | DATA |
| RE3 | STRATEGIC | Does it need to tie in with points tiers at all? | STRATEGIC — gamification spec |

## Organizer: Neighborhoods

| # | Type | Finding | Recommended Action |
|---|------|---------|--------------------|
| NE1 | UX | Why is this an organizer feature? Shouldn't it be for shoppers? | STRATEGIC — role assignment |

## Organizer: Performance

| # | Type | Finding | Recommended Action |
|---|------|---------|--------------------|
| PF1 | UX | Just another link to insights? | DUP — consolidation |

## Organizer: Overview Tab

| # | Type | Finding | Recommended Action |
|---|------|---------|--------------------|
| OV1 | UX | Gamified with no direction again | STRATEGIC — gamification spec |
| OV2 | UX | 2 links to reputation score | FIX — deduplicate |
| OV3 | UX | Organizer/payouts only available from the overview tab in organizer dashboard? | FIX — add to nav |

## Organizer: Payouts

| # | Type | Finding | Recommended Action |
|---|------|---------|--------------------|
| PY1 | DARK | Dark text for item name and price on dark background | FIX |

## Organizer: Sales Tab

| # | Type | Finding | Recommended Action |
|---|------|---------|--------------------|
| ST1 | DARK | White cards for live sale status | FIX |

## Organizer Guide

| # | Type | Finding | Recommended Action |
|---|------|---------|--------------------|
| OG1 | UX | Needs cleanup and brand/marketing alignment. Mentions referral program and webhooks | FIX — content update |
| OG2 | UX | Not referenced enough from rest of site | FIX — add links |

## Plan a Sale (/plan)

| # | Type | Finding | Recommended Action |
|---|------|---------|--------------------|
| PL1 | STRATEGIC | Only displayed to organizers — should it be public-facing, starting by asking sale type? | STRATEGIC |

## Organizer Profile

| # | Type | Finding | Recommended Action |
|---|------|---------|--------------------|
| OP1 | BUG | Start verification 404s | BUG — fix page link |
| OP2 | UX | Your sales just links to dashboard, why is it on profile? | UX — clarify or remove |
| OP3 | UX | Quick links and sale interests, what do they do differently than other things in settings? | DUP — consolidation decision |

## Organizer Settings

| # | Type | Finding | Recommended Action |
|---|------|---------|--------------------|
| OS1 | STRATEGIC | Very different from shopper version — shopper should have many of these features too. Needs full comparison. | STRATEGIC |
| OS2 | BUG | Workspace doesn't load, links to findasale.com instead of finda.sale | BUG |
| OS3 | BUG | https://finda.sale/workspace/s242-test-workspace → 404 | BUG |

## Organizer: Premium/Subscription/Upgrade

| # | Type | Finding | Recommended Action |
|---|------|---------|--------------------|
| PSU1 | DUP | /organizer/premium, /organizer/subscription, /organizer/upgrade all exist | STRATEGIC — consolidate |
| PSU2 | DUP | All 3 pages doing basically the same thing as pricing page | STRATEGIC — consolidate |
| PSU3 | DUP | Why do we have so many premium/subscription/upgrade pages? | STRATEGIC — consolidate |
| PSU4 | DUP | Why are they all different? | STRATEGIC — consolidate |
| PSU5 | UX | Premium page checkmarks aren't aligned to the columns | FIX — center checkmarks |

---

## Summary Counts

| Category | Count |
|----------|-------|
| BUG (broken functionality) | 29 |
| DARK (dark mode violations) | 8 |
| DATA (test data gaps) | 14 |
| UX (confusing flow/labels) | 41 |
| STRATEGIC (product decisions needed) | 17 |
| DUP (duplicate/consolidation needed) | 5 |
| **TOTAL** | **114** |

---

## Cross-Cutting Strategic Questions (require dedicated session)

1. **Gamification spec:** Points, badges, stamps, milestones, loyalty, leaderboard, Hunt Pass — we have mechanics everywhere but no coherent game. What does each thing mean? What do users earn? Why? Is it seasonal?
2. **Feature overlap:** Favorites vs wishlists vs alerts vs sale interests — how many of these are actually distinct? Consolidation decision needed.
3. **Support tier reality:** What does "priority email support" or "dedicated account manager" actually mean for a solo founder? Automate or redefine.
4. **Test data overhaul:** Nearly every feature is untestable because seed data lacks real-world state (purchases, history, badges, subscriptions, Stripe, images). This is the #1 QA blocker.
5. **Page consolidation:** premium/subscription/upgrade/pricing overlap. Settings vs profile overlap. Performance vs insights overlap.
6. **Shopper vs organizer settings parity:** Organizer settings are comprehensive; shopper settings are bare. Should features be shared?
7. **Homepage redesign:** Is the current homepage serving beta testers well? UX agent review recommended.

---

## Recommended Session Plan

**Next 2-3 sessions:** Fix all BUGs and DARK mode issues (mechanical fixes, no decisions needed)
**Following session:** Comprehensive seed data overhaul (unblocks testing of everything)
**Dedicated strategic session:** Gamification spec, feature overlap consolidation, support tier definitions
**Ongoing:** UX improvements as strategic decisions get made


---

> **Note (S265):** Post-S248 walkthrough findings (user3, second pass) have been structured and merged into `patrick-walkthrough-S248.md`. That file is the canonical audit doc. Raw notes below this line are archived only.

---

signed in as user3@example.com
Homepage:
+Sales near you is pretty basic looking, should it have more in the card? is this the right place for it? doesn't even click through to map page?
+should ux redesign the entire homepage?
+search doesn't find items or organizer names, what are keywords anyway only searches sale name and about from what i can tell
+organizer specific pages are only accessible from the frontpage? and not darkmode enabled either

Sale page:
views shares saves hard to see in dark mode
Organized by does'nt link to organizer page
stray 0 under the new organizer badges
share button in header and share block lower?
organizer info in organized by and contact info in lower block?
click buy now get "Complete Purchase Failed to create payment intent"
reviews is white in darkmode

Item page:
can't add item to cart
shopper is seeing platform fee on a non auction item?
no buy it now button

Map:
+seems ok but plain looking and huge, no animations or interactivity besides clicking on the sales themselves and getting the little card and 
+the plan your route feature which needs a starting point (user location?) and potentially an ending point (same as starting point toggle?)  this could maybe include promoted listings or advertisements from thrift stores, gas stations restaruants similar to waze and maps
plan your route should it start expanded instead of collapsed?  moved on top of the map?

Inspiration:
+gallery photos are broken pretty often another reason to alter the test data maybe?
can like but can't wishlist? what was the decision on that?

Trending:
again broken thumbnails or white background pretty often, looks like crap
can like but can't wishlist

Pricing:
for support how do we automate it? 
what are email support 48 hour SLA?, 24 Hour SLA and onboarding call? Dedicated account manager? You can't honestly expect patrick to handle all this? 
+Need unlimited team members? block needs a space after the box before the mini FAQ
+how can we best position the platform so that free tier users especially are incentivised to use the POS and get us paid for items that don't get photographed in our system?
+Should selling be free or should there be a nominal fee to list a single sale ala carte?
trying to go to organizer/dashboard with this user was access denied
trying to become an organizer "No token received from server"

About:
+just needs updated to better represent what the product has become since it was originally made

Leaderboard:  
+no shoppers have badges displaying
we only have this for any sort of why people are earning points etc. "
The leaderboard updates daily based on activity. Complete sales, earn badges, and climb the ranks!"
We have gamification now what's the plan for this page?  

Contact:
seems to be good now. test message came through email.

Shopper Dashboard:
+while the buttons look great the collection, loyalty etc.. should display like the overview, purhcases, etc.. and stay within the same page
Huntpass CTA has nothing to click or close
Overview still has white elements in dark mode (streak bar)
huntpass crown in streak bar does what exactly?
overview tries to load sales near you says Unable to load nearby sales. Please try again later.
No upgrade button? the previous seems to link to huntpass checkout correctly but nothing to say why they should upgrade
+buttons for purchases don't show enough data and when you click through the items are not marked as sold and still say add to cart
favorites shows watchlist and not saved items is this intended?, points don't click anywhere just display numbers
pickups cant be tested as I can't purchase items e2e, 
subscribed doesn't link to the organizer pages

shopper/collector-passport: Explorer passport needs name seo change?
no matches yet in my matches

shopper/loyalty why do we call these passports?
what is the user instructions, tooltips, etc.. in relation to leaderboard points and huntpass etc..? 
what are guild xp, stamps, milestones and badges are they the same as leaderboard badges?
when and what benefits do they get? how and why and where?
this whole page needs reworking with the new gaming narrative

shopper/wishlist
again we have keywords and we have tags but no distinction or explanation of what they are or do.
what is the user instructions, tooltips, etc..? distinguish items, collections watching
can't search for matching items right from the alert card only edit or delete
2 footers
this whole page needs reworking with the new gaming narrative
view link 404's
manage link broken redirect to same page

shopper/trails:
same map graphic as explorer on button
light text on mint textbox
failed to create trail
+2 footers

loot-log:
+blank

receipts:
+blank

My Profile:
this whole page may need redesign / retooling with dashboard and gamification context.
+hunt pass is prominent but what is huntpass in this context? again show's points but what are these points and what are they good for vs all the other gamified pages?
badges not in dashboard
my bids not in dashboard
+referral points are these different from the other points again?
+push notification still showing enabled on this page when should be settings page?

Settings:
do my profile and explorer passport need to be combined or further distinguished from each other or?
what's the differnece between followed organizers categories on setting page vs item categories in explorer passport?  vs watching/wishlisht/faves
were we going to let people change email address etc.. on this page or a different page or?

Notification bell:
Notification bell didn't show the number of pending until clicked on

FAQ:
Seems good isn't refereneced enough from the rest of site copy


as user3@example.com: drop down menu:
settings very different from shopper version and way more complete
shoppers don't have payments or subscriptions or appearance or security settings currently?
Verification is light on context and probably the whole workflow on all side us and them needs fleshing out
Notifications, another place where it says push notifications are enabled?
AI assistance has no toggle or checkbox
Profile is super basic only business name?  can we automate most of it for people who already have licensed business's?

organizer/dashboard: wasn't this whole thing supposed to be fully reorganized and something moved into shopper?
Quick Actions
+ Create New Sale🤝 Holds💳 POS
▼Essential Tools🖨️ Print Inventory📝 Message Templates
▼Pro Features📊Insights⚙️Command Center⚠️Fraud Signals💎Appraisals📈Flip Report🔗Webhooks
▶Community🏆 Bounties⭐ Reputation🏘️ Neighborhoods📈 Performance

/organizer/holds:
no data

organizer/print-inventory:
print button takes forever to load and tries to print the whole page with multiple white pages because of the formatting.
+can't select individual sales?
dark mode trouble seeing column headers Title	Category	Condition	Price	Status

/organizer/typology:
+Batch classification faild and bad black text on dark background in select a sale block

organizer/command-center:
white elements in dark mode

Organizer profile: 
Same as shopper profile? is this correct?

fraud signals:
no data can't test

offline mode: 
+no instructions how do they use it and when?  does it work for the POS and Cards?  how are they alerted they have stuff to sync? how do they sync and how do we get paid if they forget to sync or have computer issues etc?

Appraisal requests:
sent one out but how do others receive them?  do they have to come back to the appraisal page when ther request is no longer pending?  what do they get from providing estimates in the community feed?
should these be gamified?  is it smart to limit it to only pro organizers? all organizers or even certain shoppers?

Brand kit:
How much of this page should be in settings or profile and how much here?
How much is pro+ only?  all of it?

https://finda.sale/organizer/item-library:
What did we decide to do with this, it got added to the roadmap i think?

community:
should this start collaped or open?

flip reports:
+Error Unable to load flip report. Please try again.

webhooks:
+I don't even know how to begin testing these

bounties:
+no data

reputation: 
hidden deep in community?  
no data

neighborhoods: 
+shopper feature? should be for shoppers or am i mistaken?  I can see where organizers would use it as a tag but that's a different usecase than this page

performance: 
+just another link to insights?

Overview tab:
gamified with no direction again
whole tab could use work

Sales tab:
shows white cards for live sale status
kinda seems to be working better than the command center as the command center...?


organizer/payouts:
dark text for item name and price on dark background


/Plan:
Plan a sale is only displayed to organizers?
only in the dropdown? not in dashboard?
should it be public facing and start by asking what type of sale they are planning?


Organizer Guide:
did this get done?  needs cleanup and to align with brand and marketing.  mentions referral program and webhooks
isn't referenced enough from the rest of site copy


Organizer Profile:
Start verificaton link needs a space
does not link straight to verification Tab
your sales just links to dashboard why even there?
quick links and sale interests again what for or what do they do differntly than other things in settings?
subscriptions seems like the only really necessary thing to be there to me?
Push notifications here too?


Settings:
Very different from shopper version, seems like shopper roles should have many of these features as well, suggest full comparison

workspace:
created a test workspace 
when i do go to the link it provided https://finda.sale/workspace/test it says "Workspace Not Found We couldn't find the workspace you're looking for. It may have been deleted or the link may be incorrect."
Can't invite other team members

User1@example.com:
Admin panel:
2 footers
user status in new signups, ended status in recent sales is too dark for darkmode
What else can we put in here to help me admin?
Back to app button unneccessary
Maybe some of our own insights or messaging?


admin/users:
role status  is too dark for darkmode
pagination buttons are light on light text
maybe a password reset feature or other actions?
2 footers

admin/sales:
ended status is too dark for darkmode
pagination buttons are light on light text
2 footers

admin/invites:
if i generate a code for someone will it work with oauth or passkey? or do they have to signup with the code even if they use gmail or facebook login normall?

Organizer dashboard:
pro features show nothing when expanded... i thought you said they should be greyed out buttons saying upgrade or something along those lines at one point.
performance button shows in community but errors because not a pro user
neighborhoods in this org tier too
upgrade cta can't be closed during a session?  

