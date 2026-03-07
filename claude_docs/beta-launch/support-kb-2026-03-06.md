# FindA.Sale Beta Support Knowledge Base — March 2026

**Version:** 1.0
**Created:** 2026-03-06
**Maintained by:** Head of Customer Support

---

## Overview

This is the canonical reference for the top 15 support issues organizers and shoppers are expected to encounter during beta launch. Each entry includes the problem statement, likely root cause, plain-English resolution steps, and escalation criteria.

**Audience:** Patrick (responds to users directly). Responses should use the tone and templates defined in the support skill.

---

## Issue #1: I Didn't Receive My Payout

**Applies to:** Organizers
**Severity:** High
**Expected frequency:** 1–3 per week during first 2 weeks

### Problem Statement
An organizer sold items, the payment went through on the shopper side, but they haven't received the money in their bank account.

### Likely Causes
1. **Stripe Connect setup incomplete.** Organizer created an account but didn't complete the onboarding (bank details, tax info, or business verification).
2. **Payout schedule mismatch.** FindA.Sale uses instant payouts (daily deposits), but the organizer expected immediate (within hours).
3. **Bank processing delay.** Payment left Stripe but the bank is processing it (typically 1–2 business days).
4. **Sale not published.** Items were marked sold but the sale was still in draft mode — no payment was actually captured.

### Resolution Steps

**Step 1: Check Organizer Onboarding Status**
- Ask: "Can you log into your FindA.Sale organizer dashboard and go to the Payouts section?"
- If it says **"Not Connected" or "Setup Required,"** the Stripe account is incomplete.
- Send them to `/organizer/payouts` and have them click **"Connect Your Bank Account."**
- They'll be taken through the Stripe onboarding flow. They need to:
  - Confirm their email
  - Enter personal/business tax information
  - Add bank account details (routing number, account number)
  - Verify their identity (photo ID)
  - Once Stripe approves (typically 1–2 minutes), they'll see **"Connected"** status.

**Step 2: Check Stripe Transaction Timeline**
- Ask: "What date did the sale happen, and what's the sale title?"
- Log into Stripe Dashboard (admin access only — escalate if Patrick needs to verify):
  - Look up the payment in Stripe under Payments → Search by amount or sale name
  - Check payment status: Should show "Succeeded" and a payout entry
  - Check payout status: Payouts → search for the amount. Should show "Paid" and include the date it left Stripe
- If payment is "Processing," tell the organizer: **"Your payment is confirmed and in the bank processing queue. It should arrive within 1–2 business days depending on your bank."**

**Step 3: Check Bank Receipt Timeline**
- Ask: "When did the payment arrive in your bank account, or has it not arrived yet?"
- If **arrived:** You're done — it was just a delay. Apologize for the concern.
- If **not arrived:** Ask when the sale happened, calculate business days:
  - If < 2 business days old: "It's in transit. Your bank usually processes ACH transfers within 1–2 business days. Check again tomorrow morning."
  - If > 2 business days old: Escalate to Patrick. May indicate a bank hold or failed transfer.

### Response Template

Hi [Name],

Thanks for reaching out — I'm looking into your payout now.

I can see that you sold [item] on [date] for $[amount]. The payment came through on our end, and I've confirmed it was sent to your bank account on [payout date].

Payments from FindA.Sale are processed daily and typically arrive in your bank within 1–2 business days depending on how quickly your bank processes ACH transfers. If it's been less than 2 business days, please check your account again tomorrow morning.

If it's been more than 2 business days and you still don't see it, please reply with your bank name and the last 4 digits of the account, and I'll investigate further.

– Patrick

### When to Escalate
- Payout was marked "Paid" in Stripe more than 3 business days ago and hasn't appeared in the organizer's bank
- Organizer claims they completed Stripe onboarding but account shows "Not Connected"
- Multiple payouts are missing (potential systemic Stripe issue — route to dev)

---

## Issue #2: I Can't Publish My Sale

**Applies to:** Organizers
**Severity:** High
**Expected frequency:** 2–5 per week

### Problem Statement
An organizer filled out their sale details, added items, but the **"Publish Sale"** or **"Go Live"** button is disabled, grayed out, or returns an error.

### Likely Causes
1. **Stripe Connect not set up.** Sales can't go live without a connected Stripe account. (This is intentional — we need to know where payouts go.)
2. **Missing required sale fields.** Title, start date, end date, or address are blank or invalid.
3. **No items added.** The system requires at least one item in the inventory before publishing.
4. **Sale dates in the past.** Start date or end date is before today.
5. **Browser cache issue.** Old form state cached in localStorage preventing the button from updating.

### Resolution Steps

**Step 1: Verify Stripe Setup**
- Ask: "Have you connected your bank account for payouts? Can you go to your dashboard and click 'Payouts'?"
- If they see **"Not Connected"** or **"Setup Required,"** walk them through Issue #1, Step 1 (Stripe Connect setup).
- Once Stripe is connected, the publish button should become available.

**Step 2: Verify Sale Details Are Complete**
- Ask them to check:
  - **Sale Title:** Is it filled in? (Should be something like "Estate Sale — April 2026")
  - **Sale Start Date:** Is it set? (Should be today or a future date)
  - **Sale End Date:** Is it set and after the start date?
  - **Address:** Is a full address entered?
  - **At least one photo:** Is there a cover/main photo?
- If anything is blank, have them fill it in and try again.

**Step 3: Verify Items Exist**
- Ask: "How many items are in your sale? Can you see them in the inventory section?"
- If **no items:** "You need to add at least one item before publishing. Go to the Inventory tab and click 'Add Item.' Even if you're still photographing items, add placeholder titles so we know the sale has inventory."
- If **items exist:** Move to Step 4.

**Step 4: Check Sale Date Logic**
- Ask: "What are your sale start and end dates?"
- If **start date is in the past:** "Move the start date to today or tomorrow."
- If **end date is before start date:** "Make sure the end date is after the start date."

**Step 5: Clear Browser Cache (Last Resort)**
- Ask them to:
  - Open developer tools (F12 or Cmd+Opt+I)
  - Go to Application tab → Storage → Local Storage
  - Find and delete anything with your sale ID in the key
  - Refresh the page and try again
- Or: "Try opening the site in a private/incognito window and logging in again."

### Response Template

Hi [Name],

I'm sorry the publish button isn't working. Let me help you troubleshoot.

First, can you confirm:
1. Your Stripe bank account is connected (check your dashboard's Payouts section)
2. Your sale has a title, start date, end date, and address
3. You've added at least one item to the inventory

Reply with those details and we'll get your sale live.

– Patrick

### When to Escalate
- All checks pass (Stripe connected, fields complete, items added) but publish button still doesn't work → potential UI bug
- Button works but throws a 500 error when clicked → backend error, route to dev
- Organizer can't access the publish button at all (not grayed out, just missing) → check permissions, may be a role issue

---

## Issue #3: An Item Sold But the Buyer Isn't Responding for Pickup

**Applies to:** Organizers
**Severity:** Medium
**Expected frequency:** 2–4 per week (after first purchases)

### Problem Statement
An organizer completed a sale (buyer paid), but the buyer has gone silent and isn't responding to messages or arranging pickup.

### Likely Causes
1. **Buyer hasn't seen the message.** Email notification failed or went to spam.
2. **Buyer is disorganized.** They bought it but haven't coordinated pickup logistics yet.
3. **Buyer changed their mind.** They may want to cancel but haven't said so explicitly.
4. **Organizer needs clarification.** They don't know what counts as "reasonable waiting time" before following up.

### Resolution Steps

**Step 1: Attempt Contact Through FindA.Sale**
- Have the organizer go to their organizer dashboard → Messages
- Find the conversation thread with the buyer about the item
- Send a polite message: "Hi [Buyer Name], we're ready to hand off [Item] whenever works for you. Are you still interested in picking it up this week? Let me know what times work best."
- Set a 1-day follow-up reminder (they should expect a response within 24 hours for time-sensitive sales)

**Step 2: If No Response in 24 Hours, Escalate**
- The organizer can send a **final reminder** message: "I haven't heard back about pickup for [Item]. If I don't hear from you by [date], I may need to re-list it. Please let me know your availability."
- If the buyer still doesn't respond after 48 hours from the sale, the organizer can assume abandonment.

**Step 3: Refund and Re-list**
- Once it's clear the buyer has abandoned the item, Patrick will:
  1. Issue a refund to the buyer's original payment method (appears in 5–10 business days)
  2. Notify the buyer: "Your purchase of [Item] has been refunded due to lack of response on pickup arrangements. If you'd like to re-purchase, let us know."
  3. Help the organizer re-list the item to the sale

### Response Template

Hi [Name],

I see that [Buyer] purchased [Item] on [date], but you haven't heard from them about pickup. Here's what to do:

1. Send them a friendly reminder message through the FindA.Sale app: "We're ready to hand off your item. What times work best for you this week?"
2. If they don't respond within 24 hours, send one final message: "If I don't hear from you by [tomorrow's date], I'll re-list the item."
3. After 48 hours of no response, let me know and I'll process a refund and help you re-list.

Sales move fast — most buyers should confirm pickup within a day. Let me know if they get back to you.

– Patrick

### When to Escalate
- Buyer explicitly says they want to cancel (route refund request to Issue #4)
- Organizer has multiple unresponsive buyers (pattern issue → route to CX for feedback)
- Buyer is being abusive or harassing organizer (content moderation issue → escalate to Patrick)

---

## Issue #4: A Buyer Wants a Refund

**Applies to:** Shoppers & Organizers (buyer initiates, organizer may need to authorize)
**Severity:** Medium
**Expected frequency:** 1–3 per week

### Problem Statement
A buyer (shopper) wants to cancel a purchase and get their money back. Reasons vary: changed mind, item not as described, fell through on logistics, etc.

### Likely Causes
1. **Buyer remorse.** They bought impulsively and now want out.
2. **Item condition mismatch.** The photos were misleading or the item had undisclosed damage.
3. **Logistics failed.** Buyer and organizer can't coordinate a pickup time.
4. **Sale was cancelled.** The organizer cancelled the sale and the buyer wasn't notified properly.

### Resolution Steps

**If Organizer Initiates Refund (e.g., item no longer available)**
- Have the organizer go to their dashboard → Sales → [Sale Name] → Orders
- Find the buyer's order and click "Refund"
- The refund processes immediately. Buyer sees it in 5–10 business days.
- The organizer should message the buyer: "I've processed a refund of $[amount] for [Item]. We're sorry the item is no longer available."

**If Buyer Requests Refund (through support or message)**
- If **within 2 hours of purchase:** Approve it. Buyer is still in the cooling-off window. Process the refund and mark the item as available again.
- If **2 hours to 24 hours:** Check the reason:
  - **Item not as described / condition mismatch:** Approve refund. Ask for photos of the issue (optional; trust organizer on first refund).
  - **Changed mind / logistics fell through:** Suggest the buyer contact the organizer to reschedule. Refunds should be organizer-initiated, not platform-forced.
- If **more than 24 hours:** Treat as return / dispute. Escalate to Patrick for case-by-case judgment.

**Refund Process (Patrick only)**
1. Log into Stripe Dashboard
2. Find the payment/charge
3. Click "Refund" and choose full or partial amount
4. Stripe processes it immediately; buyer's bank receives it in 5–10 business days
5. Send the buyer a refund confirmation email (use the refund template from skill)

### Response Template (For Buyer Requesting Refund)

Hi [Name],

Thanks for reaching out. I'm sorry [issue] happened with your purchase of [Item].

I've processed a refund of $[amount] back to the payment method you used. You should see it in your bank account within 5–10 business days depending on your bank's processing time.

If the organizer is able to help work out a reschedule, we'd love to see that happen — but the refund is approved either way.

– Patrick

### Response Template (For Organizer Authorizing Refund)

Hi [Name],

I've processed a refund of $[amount] for [Buyer's] purchase of [Item]. Refunds typically appear within 5–10 business days depending on their bank.

[One sentence context: "the item was damaged in transit," "they need to reschedule," etc.]

Sorry for the inconvenience — thanks for working with us.

– Patrick

### When to Escalate
- Buyer claims they never received the item (potential fraud or shipping issue)
- Buyer claims the organizer is refusing to refund (potential dispute)
- Chargebacks or credit card disputes filed (immediately to Patrick)
- Refund request is for an amount different than the original charge (clarify with buyer first)

---

## Issue #5: I Can't Log In / Forgot My Password

**Applies to:** Both (organizers and shoppers)
**Severity:** High
**Expected frequency:** 3–8 per week

### Problem Statement
User can't log in. They either forgot their password, or they're getting an error ("Invalid email/password," "Account not found," etc.).

### Likely Causes
1. **User never registered.** They assumed they had an account but didn't complete signup.
2. **Typo in email.** Common: extra space, different email address than expected.
3. **Password reset token expired.** They clicked a reset link from an old email (links expire after 30 minutes).
4. **Browser cookie/cache issue.** Old session data blocking login.
5. **Account locked.** (Rare, but possible after failed login attempts.)

### Resolution Steps

**Step 1: Confirm Account Exists**
- Ask: "What email address are you trying to log in with?"
- **Important:** Have them copy/paste it from their email client to avoid typos.
- Ask: "Can you check if that email is in your email's sent folder? Any emails from FindA.Sale?"
- If **no emails from FindA.Sale:** Account likely doesn't exist. Send them to `/register` to create one.

**Step 2: Reset Password**
- Direct them to `[frontend]/forgot-password`
- Have them enter their email address
- They'll receive an email with a reset link
- The link expires in 30 minutes
- They should click it and set a new password
- Then log in with the new password

**Step 3: Check for Typos**
- Have them carefully re-enter their email when resetting password
- Common issues: gmail vs. gmial, missing @ symbol, space before/after email
- Have them copy/paste from a saved email

**Step 4: Clear Browser Cache (If Still Failing)**
- Have them open an **incognito/private window** and try logging in again
- Or:
  - F12 → Application → Cookies → Delete all cookies for finda.sale
  - Refresh page and try again

### Response Template

Hi [Name],

I'm sorry you're locked out. Here's how to get back in:

1. Go to [frontend]/forgot-password
2. Enter your email address (copy it directly from your email client to avoid typos)
3. Check your inbox and spam folder for a reset link from FindA.Sale
4. Click the link and set a new password (it expires in 30 minutes)
5. Log in with your new password

If you still see an error, reply with the exact error message and I'll dig deeper.

– Patrick

### When to Escalate
- User resets password but still can't log in (potential account lock or auth service issue)
- Multiple users reporting the same login error simultaneously (systemic auth issue)
- User suspects account was hacked (security concern → escalate to Patrick immediately)

---

## Issue #6: How Do I Add Items in Bulk?

**Applies to:** Organizers
**Severity:** Low to Medium
**Expected frequency:** 2–4 per week

### Problem Statement
An organizer has 50+ items to add and finds the one-by-one add-item form tedious. They want to know if there's a faster way (CSV upload, spreadsheet sync, etc.).

### Likely Causes
1. **Feature doesn't exist yet.** Bulk import is on the roadmap but not shipped in beta.
2. **Organizer doesn't know about the AI tagging shortcut.** They can add items with minimal info and AI will fill in some details.
3. **Organizer is trying to use the wrong tool.** Looking for CSV when the UI form is the only option.

### Resolution Steps

**Option 1: Use the Add-Items Form Efficiently** (Current solution for beta)
- Explain: "Right now, we add items one at a time, but there are shortcuts:
  - **Batch photo upload:** You can take photos of all your items, upload them together, and we'll assign them automatically.
  - **AI auto-tagging:** Once you add a title and photo, our AI will suggest category, condition, and tags. You just approve or edit."
  - Have them go to their sale's inventory page and click "Add Item"
  - Fill in title, category, starting price, and upload a photo
  - The AI kicks in after ~10–15 seconds and suggests tags/condition
  - They review and save
  - Repeat for each item

**Option 2: Defer to Roadmap** (For power users)
- "Bulk CSV import is on our roadmap for Q2. For now, the one-by-one form with AI assistance is the fastest path. If you'd like bulk import sooner, let me know and I can prioritize it."

### Response Template

Hi [Name],

I get it — adding [number] items one at a time sounds tedious! Here's how to speed it up:

1. Use the **Add Item** form with a photo for each item
2. The AI will automatically suggest category, condition, and tags within 15 seconds
3. You just approve or edit the suggestions and move to the next item

This is actually faster than filling out every field manually. For truly large inventories (500+), we can also discuss a custom bulk import, but for most estate sales, the form + AI is the way to go.

Bulk CSV upload is on our roadmap — I'll note your request!

– Patrick

### When to Escalate
- Organizer has 500+ items and really needs a bulk import (route to CX for feedback triage)
- Organizer has uploaded photos but the AI tagging isn't working (debugging issue → route to dev)

---

## Issue #7: My Sale Isn't Showing on the Map

**Applies to:** Organizers
**Severity:** Medium
**Expected frequency:** 1–3 per week

### Problem Statement
An organizer published their sale, but when they check the map view (`/map`), their sale doesn't appear. Or it appears in one location but the address is wrong.

### Likely Causes
1. **Sale is unpublished or in draft.** The map only shows published sales.
2. **Geocoding failed.** The address was entered but the backend couldn't convert it to lat/lng coordinates (e.g., typo in address).
3. **Address is outside Grand Rapids.** Map may be filtered to a specific metro area or search radius.
4. **Caching issue.** The map data was cached before the sale was published.

### Resolution Steps

**Step 1: Verify Sale Is Published**
- Ask: "Can you check your dashboard and confirm the sale status says 'Published' or 'Live'?"
- If **Draft:** They need to click "Publish" first. (See Issue #2 for help.)
- If **Published:** Move to Step 2.

**Step 2: Verify Address Format**
- Ask: "What's the full address you entered? (Street, city, state, ZIP)"
- Have them double-check for typos. Common issues:
  - Misspelled street name or city
  - Missing ZIP code
  - Abbreviations like "St" vs "Street"
- If they spot an issue, have them edit the sale and re-save the address
- Ask them to refresh the map page and wait ~30 seconds for data to reload

**Step 3: Check if Address Is Geocodable**
- Log into the backend/database (admin only) and check the `sales` table:
  - Find the sale by name
  - Check the `latitude` and `longitude` fields
  - If **both are null:** The geocoding service failed
- If geocoding failed, ask the organizer to:
  - Make sure the address includes the full street, city, and ZIP
  - Edit the sale and save again (this triggers re-geocoding)
  - Wait 30 seconds and refresh the map

**Step 4: Check Sale's Geographic Scope**
- Current beta scope: **Grand Rapids, MI**
- Ask: "Is your sale in Grand Rapids or the surrounding area?"
- If **outside Grand Rapids:** The map view may be filtered to Grand Rapids only
- Explain: "Right now we're launching in Grand Rapids first. If your sale is in a nearby area, it might not show on the main map yet. We'll expand to other Michigan metros soon."

### Response Template

Hi [Name],

I'm looking into why your sale isn't on the map. A few quick checks:

1. **Is your sale published?** Check your dashboard — the status should say "Published" or "Live."
2. **Is the address complete?** Full street, city, state, ZIP (no abbreviations).
3. **Is it in the Grand Rapids area?** We're launching in Grand Rapids first.

Can you confirm those and let me know? If the address is correct and published, there might be a geocoding hiccup — I can re-index it from my end.

– Patrick

### When to Escalate
- Sale is published with a correct address, but geocoding still returns null after 2 attempts
- Multiple sales in the same area aren't showing (possible map filtering or backend issue)
- Address is valid but the map is placing the pin in the wrong location (geocoding error)

---

## Issue #8: I Used an Invite Code But Didn't Get Organizer Access

**Applies to:** Organizers (beta access gatekeeping)
**Severity:** High
**Expected frequency:** 2–5 in first week, then 0–1/week after

### Problem Statement
User received an invite code, registered with it, but their account is still showing as a regular "Shopper" instead of "Sale Organizer." They can't see the organizer dashboard or create sales.

### Likely Causes
1. **Invite code wasn't applied correctly.** They registered as a Shopper first, then tried to use the code (too late — role is set at registration).
2. **Code was already used.** The same invite code was consumed by someone else.
3. **Code is invalid.** Typo in the code or it was never generated/sent.
4. **Database sync issue.** The invite was marked as used but the user role wasn't promoted.

### Resolution Steps

**Step 1: Verify the Invite Code**
- Ask: "Can you copy/paste the exact invite code you used? I'll verify it."
- Check the database (admin only):
  - Query `beta_invites` table for the code
  - Confirm `status` = "USED" (or similar active status)
  - Confirm the user's email is linked to it
  - Check if `used_at` timestamp is recent
- If **code not found:** It was never issued. They may have copied it wrong. Ask for the original email with the code.

**Step 2: Verify User Registration**
- Check the user record:
  - Email should match the invite code email
  - Role should be **"ORGANIZER"** (not "USER")
  - If role is "USER," there's a bug or the code was applied after they registered
- Ask the user: "What role shows on your profile?" (Have them check dashboard → Settings)

**Step 3: Fix the Role Manually**
- If the user registered with the correct code but role is still "USER":
  - This is a bug. Patrick should manually update their role to "ORGANIZER" in the database
  - Then create the organizer profile
  - Then notify the user: "I've upgraded your account to Sale Organizer. You should now see the organizer dashboard. Please refresh your browser."

**Step 4: If Code Was Invalid**
- Generate a new invite code and send it to them
- Have them **log out** and re-register with the new code
- Or, if they're already registered as a User, Patrick can manually promote them

### Response Template

Hi [Name],

Thanks for reaching out. I'm looking into your invite code now.

Can you confirm:
1. The exact code you used (copy/paste from the original email)
2. The email address you registered with

I'll verify it on my end and make sure your account has organizer access. If there's an issue, I'll fix it manually and you'll have full access within a few minutes.

– Patrick

### When to Escalate
- Multiple users report the same invite code as invalid (code generation issue)
- User has the correct code and role is "USER" instead of "ORGANIZER" (database/auth bug)
- Invite code appears used but the user has no account (potential data corruption)

---

## Issue #9: I Can't Connect My Stripe Account

**Applies to:** Organizers (payment setup)
**Severity:** High
**Expected frequency:** 1–3 per week

### Problem Statement
An organizer clicked "Connect Stripe" or "Connect Your Bank Account," but the flow failed, froze, or kicked them back with an error. They can't complete payment setup.

### Likely Causes
1. **Browser or popup blocker blocked the Stripe window.** Stripe's onboarding runs in a new window/redirect.
2. **Stripe session timeout.** They took too long and the session expired (>10 minutes).
3. **Email mismatch.** Stripe is trying to link an account to a different email than they registered with.
4. **Account creation failed.** The backend failed to create the Stripe Connect account.
5. **Network error mid-flow.** The browser lost connectivity during the Stripe onboarding.

### Resolution Steps

**Step 1: Check Browser/Popup Settings**
- Ask: "Did you see a popup or window open when you clicked the button? Did your browser ask to allow popups?"
- If **no popup appeared:**
  - Ask them to check if popups are blocked (browser settings → Privacy/Permissions)
  - Have them add finda.sale to the popup whitelist
  - Try again
- If **popup appeared but got stuck:** Move to Step 2.

**Step 2: Restart the Stripe Flow**
- Have them:
  1. Log out of FindA.Sale completely
  2. Log back in
  3. Go to Dashboard → Payouts
  4. Click "Connect Your Bank Account"
  5. Complete the Stripe onboarding **without stepping away or opening other tabs**
  6. Should take ~5–10 minutes total (ID verification, bank info, tax info)

**Step 3: Check Stripe Account Status (Admin Only)**
- Log into Stripe Dashboard
- Search for the organizer's Stripe Connect account by email
- Check account status:
  - **"Restricted":** Account was created but is waiting for more info (ID, tax docs, business verification)
  - **"Active":** Account is ready to receive payments
  - **"Under review":** Stripe is verifying the organizer (can take 24–48 hours)
- If "Restricted," message the organizer: "Your Stripe account was created but needs more information. You should see a message in your account asking for [specific docs]. Complete those and Stripe will approve you within 24 hours."

**Step 4: Check Backend Logs (Dev Only)**
- If Stripe account was never created, check the backend logs for errors
- Common errors:
  - "Account creation failed — invalid email"
  - "Stripe API rate limited"
  - "Network timeout reaching Stripe"

### Response Template

Hi [Name],

I'm sorry the Stripe setup didn't work. Let's troubleshoot:

First, try this:
1. Log out of FindA.Sale completely
2. Clear your browser cache (or use an incognito window)
3. Log back in
4. Go to Dashboard → Payouts → "Connect Your Bank Account"
5. Complete the setup without switching tabs (takes ~5–10 minutes)

If you hit an error screen, take a screenshot and reply with it — that'll help me see what's blocking you.

– Patrick

### When to Escalate
- Stripe account exists but is stuck in "Restricted" for >2 business days (Stripe support issue)
- Backend failed to create the Stripe account (error in logs)
- Same error recurring for multiple users (systemic issue)
- Organizer provided sensitive Stripe info in their message (security concern — don't process, escalate to Patrick)

---

## Issue #10: A Buyer Bought an Item But I Already Sold It Locally

**Applies to:** Organizers
**Severity:** Medium
**Expected frequency:** 2–5 per week in first month

### Problem Statement
An organizer sold an item through a local walk-in (or prior to listing on FindA.Sale), then a buyer purchased it through the app. Now there are two claims to the same item.

### Likely Causes
1. **Timing issue.** Organizer forgot to mark the item as "Sold" when they sold it locally.
2. **Organizer didn't realize the item sold offline.** They added it to FindA.Sale, then someone bought it at the physical location.
3. **Human error.** Organizer accidentally marked the wrong item as available.
4. **Sale period confusion.** Organizer wasn't sure if FindA.Sale orders only happen during the published sale dates.

### Resolution Steps

**Step 1: Acknowledge the Conflict**
- No blame. Explain: "This happens when inventory syncs between in-person and online. Let's resolve it quickly."

**Step 2: Mark Item as Unavailable**
- Have the organizer immediately go to their dashboard and **remove the item from inventory** or mark it as **"Sold"/"Unavailable."**
- This prevents further purchases.

**Step 3: Refund the Online Buyer**
- Patrick issues a full refund to the buyer
- Message the buyer: "I'm sorry — this item was sold locally before your order arrived. Your $[amount] has been refunded. You may have seen it listed, but it was no longer available. We apologize for the oversight."
- Refund appears in buyer's account in 5–10 business days

**Step 4: Suggest Process Improvement**
- Ask the organizer: "Going forward, how are you tracking inventory? Are these walk-in sales, or pre-sales before the FindA.Sale window?"
- Suggest:
  - **For walk-in sales:** Keep a notebook or phone list of sold items. Update FindA.Sale at the end of each day.
  - **For pre-sales:** Wait to list items on FindA.Sale until the official sale date/time.
- Offer: "If you'd like, I can walk you through best practices for managing both online and in-person inventory."

### Response Template

Hi [Name],

I see that [Buyer] purchased [Item] on [date], but you've already sold it locally. No problem — we'll make it right.

I've refunded [Buyer] $[amount]. The refund will appear in their account within 5–10 business days.

For your sale, I recommend:
1. **Track sold items immediately** — keep a running list of anything sold in-person
2. **Update FindA.Sale daily** — mark items as "Sold" so they don't show for new buyers
3. **Set a clear sale window** — if items can sell before the official start date, let your team know to remove them from the listing

Let me know if you have questions about managing inventory!

– Patrick

### When to Escalate
- Same organizer has 3+ double-sales (pattern of poor inventory management — may indicate intentional overbooking)
- Buyer is upset and demands compensation beyond refund (customer service judgment call)
- Organizer claims the system didn't let them mark the item as sold (UI bug)

---

## Issue #11: How Do I Use the QR Code Sign?

**Applies to:** Organizers
**Severity:** Low
**Expected frequency:** 3–8 per week (feature awareness)

### Problem Statement
An organizer wants to know how the QR code feature works and how to use it at their physical sale location.

### Likely Causes
1. **New feature.** QR codes shipped in the latest build and organizers aren't familiar yet.
2. **Organizer looking for a shortcut.** QR codes are optional but can drive traffic from print materials, flyers, and signage at the sale.

### Resolution Steps

**Explanation: What the QR Code Does**
- The QR code links directly to your sale's page on FindA.Sale
- When shoppers scan it (with any phone camera or QR app), they land on your sale listing
- It's tracked so you can see how many people scanned it in your analytics
- It's particularly useful for driving traffic at the physical location (print it on signage, flyers, business cards)

**How to Generate It**
1. Go to your organizer dashboard
2. Click on the sale you want to promote
3. Click the "Share" button or look for a "QR Code" icon
4. The QR code will display on screen
5. Click "Download" to save it as an image (PNG or JPG)

**How to Use It**
- **Print it on signage.** Put a 4x4 or 8x8 inch print of the QR code at your sale location with text like "Scan for online catalog" or "Browse our items"
- **Add to flyers.** Include it in printed ads or direct mail
- **Business cards.** Add a small QR code to your business cards with your sale link
- **Social media.** Share a screenshot in your Facebook/Instagram ads

**Sizing Tips**
- QR codes need to be at least 2 inches × 2 inches to scan reliably
- Print it large (4–8 inches) for high-traffic areas
- Make sure there's white space around it (don't crop it)
- Test it before printing (scan with your phone to make sure it works)

### Response Template

Hi [Name],

Great question! The QR code is a free tool to drive traffic to your sale.

Here's how to use it:
1. Go to your dashboard → [Sale Name] → Share → QR Code
2. Download the image
3. Print it (at least 4×4 inches) and post it at your sale location, on flyers, or on signage
4. Shoppers scan with their phone and land on your listing
5. You can see how many scans in your analytics

QR codes are especially useful if you have walk-in traffic — shoppers can browse before arriving or add items to their cart while they're there.

Let me know if you have questions!

– Patrick

### When to Escalate
- Organizer reports that QR code doesn't work when scanned (test it — may be sizing, printing quality, or a URL issue)
- QR code scan tracking shows no data (analytics bug)

---

## Issue #12: The AI Tag Suggestions Are Wrong — How Do I Turn Them Off?

**Applies to:** Organizers
**Severity:** Low
**Expected frequency:** 2–4 per week

### Problem Statement
An organizer is frustrated that the AI is suggesting incorrect tags or categories for their items (e.g., marking a chair as "Vintage" when it's modern, or suggesting the wrong category). They want to disable the suggestions or correct them.

### Likely Causes
1. **Photo is ambiguous.** The AI can't clearly see the item (bad lighting, multiple items in frame, poor angle).
2. **Item is unusual.** The AI was trained on common estate sale items but is misclassifying niche or rare items.
3. **Organizer feedback.** They gave feedback that the AI is learning from, but it hasn't improved yet.
4. **AI limitations.** The AI is working as designed but just isn't perfect.

### Resolution Steps

**Step 1: Explain That Suggestions Aren't Automatic**
- "Good news — AI suggestions are **optional**. You don't have to accept them. You can edit or dismiss them."
- When they add an item:
  - After ~15 seconds, the AI shows suggestions for category, condition, and tags
  - They can click **"Accept"** to apply them, or
  - Click **"Edit"** to change any before accepting, or
  - Click **"Dismiss"** to skip the AI and fill it in manually

**Step 2: Help Them Improve AI Suggestions**
- If they dismiss suggestions, ask: "Would you mind clicking 'I don't like these suggestions' and telling us why? That helps the AI learn."
- After enough feedback, the AI improves for similar items

**Step 3: Manual Override**
- They can **always** manually edit the category, condition, and tags after the AI suggests them
- Example: AI suggests "Vintage" but they know it's "Modern" → click Edit, remove "Vintage," add "Modern," save
- Or they can **dismiss the suggestions entirely** and fill in all fields manually

**Step 4: Disable AI (If Available)**
- Currently, AI suggestions are on by default
- If the organizer finds them consistently unhelpful, they can:
  - **Dismiss every suggestion** (takes 1 click per item)
  - Or contact support and request AI to be disabled on their account (Patrick can flip a setting)

### Response Template

Hi [Name],

The AI suggestions are completely optional! Here's how to handle them:

1. **Don't like a suggestion?** Click "Edit" and change it before accepting
2. **Want to skip AI entirely?** Click "Dismiss" and fill in the details manually
3. **Want to help the AI learn?** Click the thumbs-down and tell us what's wrong — we use that feedback to improve

You're in full control — the AI is just a shortcut to save you time if it works well.

If you'd prefer to turn it off completely, let me know and I can disable it on your account.

– Patrick

### When to Escalate
- AI is systematically suggesting wrong categories for a specific item type (e.g., all "Furniture" tagged as "Vintage")
- Organizer receives multiple incorrect suggestions despite feedback (AI quality issue)
- Organizer claims they gave feedback but the AI is still wrong (model retraining issue)

---

## Issue #13: How Do I Schedule Pickup Times?

**Applies to:** Organizers
**Severity:** Low
**Expected frequency:** 2–4 per week

### Problem Statement
An organizer wants to coordinate pickup schedules with buyers. They're wondering if there's a built-in scheduling system or if they should just rely on messaging.

### Likely Causes
1. **Feature not shipped yet.** Detailed pickup scheduling UI is on the roadmap but not in beta
2. **Organizer expecting too much automation.** They want an automated calendar; we handle it through messaging for now
3. **Confusion about process.** They don't understand the buyer-organizer coordination model

### Resolution Steps

**Current Process (Beta):**
- Pickup scheduling happens through **messages**
- Here's the flow:
  1. Buyer purchases an item
  2. Organizer messages the buyer: "Great! When would you like to pick up [Item]? I'm available [day/time options]."
  3. Buyer replies with their preferred time
  4. Organizer confirms and sends address/parking info
  5. Buyer arrives and picks up (or organizer ships if applicable)

**Best Practices for Organizing Pickups**
- Offer 3–4 time slots (e.g., "Friday 10-11am, 11am-12pm, 2-3pm, or Saturday 10-11am")
- Group pickups by buyer if possible (one buyer, multiple items = fewer trips)
- Confirm 24 hours before the scheduled time (message: "Just confirming you're still coming [day] at [time]")
- Include address, parking info, and a phone number for questions
- Have a cancellation policy (24-hour notice for reschedules)

**Future Enhancement (Roadmap)**
- "A calendar-based scheduling system is on our roadmap for later this year. For now, messaging works well and keeps things flexible if schedules change."

### Response Template

Hi [Name],

Great question! Right now, pickup coordination happens through the app's built-in messages.

Here's the process:
1. Once a buyer purchases, message them: "When works best for pickup? I'm available [day/time options]."
2. They reply with their preferred time
3. You confirm and send the address/parking details
4. They pick up at the agreed time

**Pro tip:** Offer 3–4 specific time slots and group pickups by buyer when possible. Always confirm 24 hours before.

We're planning to add a calendar-based scheduling system later this year to make this even smoother. For now, this flexibility is actually helpful in case someone needs to reschedule.

Questions?

– Patrick

### When to Escalate
- Organizer has a special requirement (e.g., "I need scheduling to integrate with my calendar app")
- Multiple organizers requesting calendar scheduling (route to CX for product feedback)

---

## Issue #14: I Don't See My Sale in Search Results

**Applies to:** Organizers
**Severity:** Medium
**Expected frequency:** 1–3 per week

### Problem Statement
An organizer published their sale, but when they search for it (or a shopper tries to find it), the sale doesn't appear in search results, even though it's visible in the map or home feed.

### Likely Causes
1. **Sale is too new.** Search indexing has a slight delay (~1–5 minutes).
2. **Sale title doesn't match the search term.** Organizer is searching for "Furniture Sale" but their title is "Estate Treasures."
3. **Search is location-filtered.** Shopper is searching in a different city or neighborhood filter is on.
4. **Sale is on hold or paused.** Status isn't actually "Published."
5. **Search index hasn't refreshed.** Backend cache or search engine hasn't picked up the update.

### Resolution Steps

**Step 1: Verify Sale Is Published and Recent**
- Ask: "Can you check your dashboard and confirm the sale status is 'Published'?"
- If **not published:** See Issue #2 (Can't publish sale)
- If **published:** Move to Step 2.

**Step 2: Test the Search**
- Ask: "What's the exact title of your sale?"
- Have them go to the home page search bar and type the full title
- **Should appear** within 1–5 minutes of publishing
- If it's been **>5 minutes** and still doesn't appear: Move to Step 3.

**Step 3: Check Search Filters**
- Ask: "When you searched, was there a location filter on? Try clearing any filters (neighborhood, price range, category) and search again."
- Some organizers forget that location filtering is on and think their sale isn't discoverable

**Step 4: Check Sale Visibility (Admin Only)**
- Log into admin dashboard → `/admin/sales`
- Search for the sale by name
- Confirm status is "PUBLISHED"
- If status is "DRAFT" or "PAUSED," that's the issue
- Contact the organizer to check why it's not published

**Step 5: Force a Search Reindex**
- If everything looks correct but search still fails:
  - Backend may need to reindex the search database
  - Patrick or dev can trigger this
  - Usually takes <5 minutes after reindex

### Response Template

Hi [Name],

Let me help you troubleshoot search visibility.

First:
1. Confirm your sale is **Published** (not Draft)
2. Go to the home page search and type your exact sale title
3. **Try without location filters** — sometimes filtering hides results

If it still doesn't show after 5 minutes, let me know and I can manually reindex it on my end.

What's your sale called?

– Patrick

### When to Escalate
- Sale is published but never appears in search after 24 hours (search indexing issue)
- Multiple sales fail to index (systemic search/database issue)
- Admin dashboard shows the sale as published but it doesn't appear in search (data sync issue)

---

## Issue #15: How Do I Clone a Sale from Last Year?

**Applies to:** Organizers
**Severity:** Low
**Expected frequency:** 0–2 per week during beta (increases seasonally)

### Problem Statement
An organizer ran a sale last year (or on a previous platform) and wants to quickly recreate it with similar items, descriptions, and photos to save time.

### Likely Causes
1. **Repeat organizer.** They've done estate sales before and want to reuse inventory lists.
2. **Feature not available yet.** Clone/duplicate feature isn't shipped in beta.
3. **Organizer looking for shortcuts.** They want faster sale setup.

### Resolution Steps

**Current State (Beta):**
- Sale cloning isn't built yet, but it's easy to manually recreate:
  1. Create a new sale (title, dates, address, photos)
  2. Go through the add-items flow again
  3. Use the AI tagging to speed up item suggestions (can reuse similar item types)

**Workaround: Bulk Item Templates**
- If they have an old list (spreadsheet, notes), they can:
  1. Export or copy the old item names and descriptions
  2. Use those as templates in the add-items form
  3. Update prices as needed
  4. Reuse photos if the items are the same

**Future Enhancement (Roadmap)**
- "Sale cloning is on our roadmap for Q3. For now, the AI tagging shortcut makes it faster than you'd think — most organizers can re-add their inventory in 1–2 hours."

**Alternative: Archive/Reuse Items**
- "If you want to track items across sales, save a spreadsheet of your inventory. The AI can help categorize new items faster each time you run a sale."

### Response Template

Hi [Name],

Great thinking! Sale cloning would definitely speed things up. It's on our roadmap for later this year.

For now, here's the fastest path:
1. Create a new sale (title, dates, address)
2. Go through add-items — the AI will auto-suggest category, condition, and tags based on item photos
3. Most organizers can re-add a familiar inventory in 1–2 hours with AI help

**Pro tip:** If you have an old spreadsheet of your items, copy the names and descriptions into the form — saves you from typing from scratch.

This really does get faster after your first sale!

– Patrick

### When to Escalate
- Multiple organizers request cloning feature (route to CX for product feedback)
- Organizer has legitimate need for historical data migration (rare case — offer manual support)

---

## Summary & Handoff

This KB covers the most likely support issues in beta. **Next steps:**

1. **Update this document as new issues emerge.** If the same question comes in twice, it belongs here.
2. **Monitor patterns.** If 3+ users report the same issue, flag it to the CX/Product team.
3. **Escalation is clear.** Each entry specifies when to escalate and to whom.
4. **Tone is consistent.** All responses follow the support voice: empathetic, plain English, actionable, honest.

**Patrick:** You're the primary responder. Use these templates and steps as guides, but personalize responses to each user. Include their names, sale names, and dollar amounts where relevant. Every response should leave them confident about what comes next.

---

**Last Updated:** 2026-03-06
**Next Review:** After first 100 support tickets or 1 week, whichever comes first
