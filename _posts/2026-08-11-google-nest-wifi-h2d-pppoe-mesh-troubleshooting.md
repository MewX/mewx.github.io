---
layout: post-v4
title: "Years of Fighting Google Nest Wifi (H2D)"
subtitle: "PPPoE on NBN, the endless 'Something went wrong', and a mesh point that dies every few days. Here are the fixes I wish someone had written down."
date: 2026-08-11 22:10
comments: true
author: MewX
published: true
categories: [hardware, life]
---

## TL;DR - the fixes, if a search engine sent you here

I burned an embarrassing number of evenings and something like ten factory resets on some of these.
If you only came for the answers, here they are. Details for each one are further down.

| Symptom | The actual fix |
| --- | --- |
| Can't save PPPoE, **Save** spins forever | **Unplug the WAN Ethernet cable first**, wait for the pulsing yellow light, change the setting, then plug it back in |
| Can't switch PPPoE ⇄ DHCP no matter what | Same unplug trick, **but you must use an iPad/iPhone.** Google Home on Android cannot do it in *any* version. It then saves silently with no confirmation on iOS btw |
| `Something went wrong` when adding a Wifi point | Google Home **4.x on Android is broken** for this flow. Downgrade to **3.4.1.5** or other 3.x |
| No "add a mesh point" option anywhere in settings | There isn't one. It only exists inside **Add ➜ Set up device ➜ New device ➜ As mesh** |
| Point randomly drops to ~2 Mbps every few days, reboot fixes it | Wireless backhaul degradation. **Run Ethernet from the primary's LAN port to the second router's WAN port** |
| Want separate 2.4 GHz / 5 GHz SSIDs | **Impossible.** Not hidden, not advanced - the feature does not exist |

And one fact worth knowing before you spend a weekend on this: the Nest Wifi (2019) went on sale
on 28 October 2019, and Google's own
[security update commitment table](https://support.google.com/product-documentation/answer/10231940?hl=en)
lists its support end date as **28 October 2024**. It is out of its committed support window.
It still gets the occasional critical patch - the most recent firmware is
**14150.883.859** for the router and **1.56.514310** for the point, both dated 24 April 2026
([official version history](https://support.google.com/googlehome/answer/13800967?hl=en)) -
but that was the first router build in about 18 months, and it is described only as
"stability and security vulnerability fixes". **Nothing here is getting fixed. That's why I'm writing it down.**

## How I ended up with two of them

I got two Nest Wifi routers (model **H2D**) through an internal dogfood contribution.
Free hardware, nice industrial design, the little fabric puck looks genuinely good on a shelf.
I was happy. I like Google products. I liked what Nest was trying to do - take the ugly,
blinking, antenna-covered box out of your living room and make home networking invisible.

The invisible part is exactly the problem. They made it invisible to the point where **you cannot
operate it**.

For context, this is what the hardware actually is:

- AC2200 Wi-Fi 5, dual-band 2.4 / 5 GHz, 4×4 MU-MIMO
- Quad-core 1.4 GHz ARM, 1 GB RAM, 4 GB flash
- **2 × Gigabit Ethernet: one WAN, one LAN** (the WAN port cannot be repurposed as LAN)
- Thread border router, built-in speaker with Assistant

That last hardware detail matters more than anything else in this post, so remember it:
**the H2D router has Ethernet ports. The H2E "point" has none at all.** If you have two routers
like I do, you have an escape hatch that people who bought the router + point bundle simply don't have.

And the architectural detail that explains half my pain: unlike the newer Nest Wifi Pro,
**the Nest Wifi has no dedicated backhaul radio**. The link between your two nodes runs on the same
ordinary 2.4 / 5 GHz radios your phone, your laptop, and every chatty IoT bulb in the house are using
([Android Authority](https://www.androidauthority.com/google-nest-wifi-review-1051816/)).
Every device you own is competing for the airtime your mesh needs to exist.

## Pain point 1: you cannot split 2.4 GHz and 5 GHz

Let's start with the one that has no fix at all.

Nest Wifi puts both bands under a single SSID and decides for you which band a device gets.
There is no setting. There is no advanced menu. There is no hidden toggle. It is
[a design decision](https://www.googlenestcommunity.com/t5/Nest-Wifi/How-to-separate-2-4GHz-and-5GHz-on-google-nest-wifi-router/m-p/62287),
and the community threads asking for it go back years and are all answered the same way: no.

If you have a 2.4 GHz-only IoT device that refuses to pair - and if you own smart plugs,
you do - the "official" workaround people pass around is genuinely this: **walk far enough away
from the router with your phone that it falls back to 2.4 GHz, and do the pairing from there.**

That is the state of the art. Walk away from your router. In 2026.

## Pain point 2: PPPoE on NBN, or, the chicken-and-egg from hell

This one took me the longest, and it is the single most useful thing in this article.

I'm on Australian NBN. My connection is PPPoE: 500/40. To get online, the router needs a PPPoE
username and password. Standard stuff - every TP-Link, every ASUS, every Netgear box on earth has
handled this from a web portal since roughly 2004.

Nest Wifi's setup wizard **requires a working internet connection to proceed**. But you cannot have a
working internet connection until PPPoE is configured. And you cannot configure PPPoE until the wizard
lets you past the "checking your connection" step.

I sat there for a long time genuinely wondering if my unit was faulty.

### The fix

It's buried in the [WAN settings support page](https://support.google.com/googlehome/answer/6246630?hl=en),
in a sentence that Google states plainly and then never repeats anywhere you'd actually look for it:

> To change your WAN settings, Nest Wifi or Google Wifi **must be offline** and your mobile phone must be
> connected to your Nest Wifi or Google Wifi network. To do this, **disconnect the Ethernet cable** from your
> router or primary Wifi point and wait until the light pulses yellow.

So the full working procedure is:

1. **Connect your phone to the Nest Wi-Fi SSID.** Not mobile data. Not your old router's SSID.
   The app talks to the router over the local network, and it will fail silently if you're not on it.
2. **Unplug the Ethernet cable from the WAN port** of the primary router.
3. **Wait for the light to pulse yellow.** This is not cosmetic - this pulsing-yellow state
   *is* the condition the app is checking for. If the light isn't pulsing yellow, stop and wait.
4. Google Home ➜ **Wi-Fi** ➜ **Network settings** ➜ **Advanced networking** ➜ **WAN**.
5. Choose **PPPoE**, enter your account name and password, confirm, **Save**.
6. **Plug the Ethernet cable back in.** It connects.

If **Save** still spins forever after all that, jump ahead to
[the DHCP section](#what-actually-worked-an-iphone) - you may be hitting the second, independent
failure, where the Android client simply cannot commit a WAN change and you need an iOS device.

Now here's the part that made me want to file a bug against the documentation itself:
Google's dedicated page for
[PPPoE issues during setup](https://support.google.com/googlehome/answer/7668126?hl=en)
- the page you will land on if you search for exactly this problem - **never mentions the unplug step at all.**
It tells you to double-check your credentials, power-cycle your modem, wait three minutes, and then
"contact your ISP". The one instruction that actually solves it lives in a different document.

I genuinely want to know whether any PM or UX researcher ever ran this flow end to end on a real
PPPoE line. Five minutes with an NBN service would have caught it. The whole product is built around
"we removed the complexity so it just works", and then it ships a first-run experience that is
structurally impossible to complete for an entire country's default connection type.

### Switching PPPoE ➜ DHCP is exactly as bad

I later moved NBN providers, mostly to escape CGNAT, and the new one hands out a normal DHCP address.
So I had to go the other direction. Same wall, and this time I didn't yet know the trick.

For the record, here is everything I tried that **does not work**, so you can skip it:

- Changing WAN settings while the internet connection is up and healthy. The Save button spins forever.
  I waited **thirty minutes** once to rule out a transient backend issue. It never resolves, and it never
  errors out either - it just spins.
- Quickly swapping the cable over from a TP-Link router mid-flow to "sneak" a connection in.
- Putting a TP-Link in front to simulate DHCP upstream (`WAN ➜ TP-Link ➜ Nest`) while waiting for the
  provider cutover. Doesn't help; the Nest still won't accept the WAN mode change.
- Powering off the second unit so only the primary is up. No effect on this particular problem.
- The app's offline mode. The button is right there, it's clickable, it looks enabled, and it does nothing.
- **Google Home on Android. Any version.** I tried 4.x. I tried the 3.x APK that had rescued my mesh
  setup. Neither one can commit a WAN mode change. This is not the same bug as the mesh one - downgrading
  does not help you here.

### What actually worked: an iPad

The only thing that ever committed the change was **the Google Home app on iOS**. My wife luckily owns an iPad.
The exact sequence:

1. **Sign in to Google Home on an iPad or iPhone** with the account that owns the network,
   and get the device onto the Nest Wi-Fi SSID.
2. **Unplug the WAN Ethernet cable** from the primary router.
3. **Wait for the light to flash yellow.**
4. Go to the WAN settings, select **DHCP**, and hit **Save**.
5. **Plug the Ethernet cable back in.** Don't forget this - nothing tells you to.

And here's the part that will make you think it failed: **it works silently.** No spinner resolving,
no success toast, no confirmation dialog, no "your settings have been saved". The screen just quietly
moves on as if nothing happened. After weeks of the Android app spinning forever, my honest reaction
was that it had failed again - I only found out it had worked when I plugged the cable back in and the
internet came up.

So there are two independent failures stacked on top of each other here: the undocumented offline-state
requirement, *and* an Android client that cannot perform this operation at all. Miss either one and you
get the same nothing. If you're on Android and stuck on this, **stop debugging your network and go find
an iPhone.**

One more trap specific to Australia and anywhere else with tagged services:
**Nest Wifi does not support VLAN tagging.** If your ISP requires a VLAN ID on the WAN, no amount of
fiddling in the app will get you online - you need a device in front of it that can tag.
Worth checking before you order the NBN, or before you blame yourself.

## Pain point 3: "Something went wrong"

Building the mesh is where I lost the most sanity.

You add the second unit. The wizard runs. It gets partway. Then:

```text
Something went wrong
```

That's it. That is the entire error. No code, no log, no "which step", no "try this".
What went wrong? Which layer? Bluetooth? Wi-Fi? Cloud? The account? What does that even mean?!

I factory reset both units over and over - hold the button on the base for 10 seconds until the light
goes solid yellow, release, wait up to 10 minutes, don't unplug it, then it flashes white and goes blue
when it's ready ([official procedure](https://support.google.com/googlehome/answer/6246619?hl=en)).
I did that loop so many times I could do it in the dark. Never worked.

### The fix: the Android app version

After reading through a lot of other people's misery, the answer turned out to have nothing to do with
my hardware, my network, or my house. **Google Home 4.x on Android is broken for the point setup flow.**
The clearest write-up I found is
[this r/GoogleWiFi thread](https://www.reddit.com/r/GoogleWiFi/comments/17eq07f/solution_to_nest_wifi_point_something_went_wrong/).

I installed **Google Home 3.4.1.5** from
[APKMirror](https://www.apkmirror.com/apk/google-inc/google-home/google-home-3-4-1-5-release/)
(uploaded 8 August 2023, needs Android 8.0+) and the mesh built on the first try. First try, after weeks.

Practical notes if you go down this road, because it's more annoying than "just install an APK":

- **Turn off auto-update for Google Home in the Play Store first.** Otherwise Play will helpfully
  upgrade you back to 4.x halfway through your setup and you get to start over.
- **App bundles make this genuinely hard.** Modern Google Home releases are split APKs, so you need a
  build that matches your device's architecture and screen density - grabbing the wrong variant gives
  you an install that fails or crashes on launch.
- I needed **an old spare phone** for this. Downgrading the app on my daily driver was not something
  I wanted to live with.
- **This is a real security tradeoff.** You are sideloading a Google account-connected app from a
  third-party mirror. APKMirror has a good reputation and does signature verification, but "good
  reputation" is not "signed by Google in a store I trust". I did it because I'd run out of options,
  not because it's fine.

### Free things to try before you resort to APKs

From the Google Nest community threads, these have worked for other people and cost nothing:

- **Set it up from an iOS device** if you can borrow one. Several people report the iOS app shows a
  "Preparing Mesh Network" step that
  [never appears on Android](https://www.googlenestcommunity.com/t5/Nest-Wifi/Something-went-wrong-Nest-wifi-point-setup/m-p/50756).
- **Restart the whole network, then find the point under "Local".** When you hit the error, back out of
  setup, go to Network settings and restart the entire network. Once everything is back up, open the
  **Devices** tab and look for a heading called **Local** - your point should be sitting there, and
  tapping it drops you into a setup flow that
  [succeeds](https://www.googlenestcommunity.com/t5/Nest-Wifi/Solved-Solution-quot-Something-went-wrong-quot-while-trying-to-add-point-to/m-p/486777).
- **Walk away for five or ten minutes** with the failed screen still open, then come back. Sounds like
  folklore. Reported to work often enough to be worth the wait.
- Some people report **disabling IPv6** clears it. It didn't do anything for me, but it's free.

## Pain point 4: where is the "add a mesh point" button?

This one is small and it made me feel stupid for a whole evening, so let me save you that.

The entire product is marketed as "router + points". You would therefore expect the router's settings
page to have something like *Add a Wifi point*. It does not. There is no such entry anywhere in the
Wi-Fi settings, anywhere in network settings, anywhere in the device page.

Adding a node lives **only inside the generic new-device wizard**:

> Google Home ➜ **+ Add** (top left) ➜ **Set up device** ➜ **New device** ➜ pick your home ➜
> let it scan ➜ it discovers the second unit

That's it. The flagship feature of a mesh product is reachable through exactly one path, that path is
the same generic wizard used for adding a smart speaker, and that wizard is the least stable part of
the app. Every failure - and there will be failures - dumps you back to the start.

Also worth knowing: a **second H2D router added to your mesh becomes a point**, and unlike an actual
H2E point, it keeps its Ethernet ports. Hold that thought for the next section.

## Pain point 5: the point that dies every few days

This is the one I never fully beat, and the debugging is interesting enough to write out properly.

**Setup:** two H2D routers. Primary on NBN PPPoE at 500/40. Second one joined over wireless mesh,
acting as a point. A main SSID plus a guest network hosting all the IoT devices.

**Symptom:** every 12 hours to 7 days - no pattern I could find - everything connected to the second
node collapses to about **2 Mbps**. The primary is completely fine the whole time. Restarting the
second unit fixes it instantly. Then it comes back days later.

### What it isn't

Ruling things out mattered more than any single fix:

- **Not the WAN.** The primary never degrades. PPPoE and the 500/40 service are not involved.
- **Not old firmware.** I'm on 14150.883.859, which is the latest build there is.
- **Not "preferred activities" / priority device.** That's WAN-side shaping. It cannot touch a radio
  link between two nodes. Turn it off to eliminate the variable, but expect nothing.
- **Not IPv6.** This is Google support's standard shotgun advice. IPv6 cannot degrade an RF link.
  There's a marginal argument that router advertisements and multicast add low-rate airtime with a big
  IoT fleet, but it is noise, not signal.

### What it is

The **mesh test** (Google Home ➜ Wi-Fi ➜ Test mesh) returns **Bad Connection** while it's happening.
That's the most useful data point available to you, because it says the radio link itself is degrading
rather than something in software above it. Some people report the mesh test alone temporarily restores
speed, which points the same direction. For me it just reported Bad Connection and changed nothing.

Combined with the no-dedicated-backhaul architecture, the picture is:

1. The backhaul runs over ordinary 5 GHz, sharing airtime with every client and every IoT device.
2. Nest Wifi picks its channel essentially **once, at boot**, and rarely re-picks. A neighbour moving
   onto your channel, or a DFS radar event, can strand you on a bad channel until you reboot. That fits
   the random 12h–7d timing better than anything else.
3. You get **no manual channel control**. None. So when it picks badly, your only tool is a power cycle.
4. A single sticky IoT device at the fringe of coverage negotiating 1–6 Mbps eats airtime out of all
   proportion to what it's actually sending. Multiply by a dozen and add mDNS chatter.

### A debugging trap worth sharing

I spent a while chasing a false lead here, and it's a good lesson if you're doing your own RF debugging.

I stood right next to the primary with a Wi-Fi analyser and captured this during a slow period:

```text
ssid (b0:e4:d5:2e:9b:c5) - 2.4 GHz - 0 dBm
ssid (b0:e4:d5:2e:9b:c1) - 5 GHz - -53 dBm
```

Two radios in the same physical box, measured from the same spot, 53 dB apart. That looks like a
smoking gun - a 5 GHz transmit chain running at a tiny fraction of its normal power.

**It isn't.** Standing at literally zero distance drives enough power into your phone's antenna to
compress its receiver front end, and phones share antenna paths across bands, so a point-blank reading
on one band drags down the reported RSSI on the other. The 53 dB gap was a measurement artifact.

The honest numbers came from a capture taken at a sane distance: 5 GHz at −62, 2.4 GHz at −54, against
a healthy baseline of 5 GHz −54 and 2.4 GHz −54/−57 from a comparable spot. So the real relative drop
is roughly **8–11 dB** - consistent, real, in the right direction, and nowhere near enough to explain
0.2 Mbps on its own. At −62 dBm you'd still expect a perfectly usable link.

**Take your readings from about 2 metres, not point blank.** I would have saved myself an evening.

Which means signal strength was never the story. The real anomaly is **6 Mbps at −36 dBm** - an
excellent signal negotiating floor rate, on a 5 GHz channel with no neighbours above −81. Something on
that channel is consuming the airtime, and it's my own equipment. A radio that can't be heard properly
retries relentlessly, and retries at floor rates devour the channel for everyone on it.

### Two tests worth running before you buy anything

If you're debugging the same thing, do these in this order - they're the biggest forks in the road:

1. **While it's slow, plug a laptop into the primary router's LAN port and run a speed test.**
   This bypasses every radio in the house. Full speed means it is purely a Wi-Fi/airtime problem and
   everything above applies. Slow means your fault is on the WAN or PPPoE side and you've been debugging
   the wrong layer entirely. Five minutes of work; do it first.
2. **Next time it happens, restart the *primary* instead of the point.** I'd been restarting the point
   for months on the assumption that the point was the faulty node. If restarting the primary also clears
   it, the point's reboot was never the mechanism and you've been fixing it by coincidence.
3. **Swap the physical roles of the two units.** If the fault follows the physical box, you have a dying
   radio. If it stays with the position, it's environmental. Either answer narrows things enormously.
   Costs you a factory reset and a rebuild, so it's a weekend job - but it's the most informative single
   test available.

### The actual fix

**Run a cable.** Ethernet from a **LAN port on the primary** to the **WAN port on the second router**.
Nest Wifi detects wired backhaul automatically and switches to it, and the failure mode disappears
because the failing link is no longer in the path.

This is the one option that eliminates the problem instead of reducing how often it happens.
Everything else - guest network off, IPv6 off, priority devices off - is at best a frequency reduction.

**This is only available to you if your second node is an H2D router.** The H2E point has no Ethernet
ports whatsoever. If you bought the advertised router-plus-points bundle, this escape hatch does not
exist for you, and I'm sorry.

If you can't run cable: MoCA over existing coax, or a decent pair of AV2 powerline adapters, both beat
a marginal wireless hop. Failing that, put the point on a smart plug with an **on-device** daily schedule
- say 4am - so it power-cycles itself without depending on the network being healthy. Make sure that
plug is joined to the primary router, not to the point, or you've built a lovely deadlock.

Testing the guest network hypothesis is also worth a fortnight of your time if you have a lot of IoT
devices. It adds a second BSSID per band per node, with extra beacons at low basic rates, and 2.4 GHz-only
devices sitting at the fringe of coverage are the classic airtime killers. Disable it and see if the point
survives past seven days.

## Pain point 6: there is nobody to tell

There is no official support channel for this hardware in any meaningful sense. There's a user forum.
Go and read it. Scroll through the Nest Wifi section and count how many threads end with a Community
Specialist asking the user to try a factory reset, and then nothing. Ever. The threads just stop.

People are describing reproducible bugs, with steps, with screenshots, and the threads simply die.

And before anyone asks: **yes, I reported these internally.** I was an internal user; that was the entire
point of me having them. I filed the issues. I nudged. I nudged again. Nobody looked at them. Now the
device is past its committed support window, the last firmware is a security patch with no changelog worth
reading, and none of it is ever going to be fixed.

That's the part that actually stings. Not the bugs - every product has bugs. It's that the bugs were
findable, reported, reproducible, and simply not worth anyone's time.

## Where I landed

I want to be clear about where this is coming from, because it isn't from someone who wanted to hate it.

I loved Google products. I loved what Nest was trying to do. The idea of a home network you never think
about, that disappears into the furniture, that your family can use without a manual - that's the right
idea. I wanted it to work. I gave it years and a genuinely unreasonable amount of patience.

What I got instead was a router I can't configure for my country's standard connection type without a
folklore workaround, a mesh I can only build by sideloading a three-year-old app from a third-party
mirror, a WAN setting I can only change by borrowing hardware from a competing ecosystem, a node that
dies on a schedule nobody can explain, an error message that says nothing, and a support channel that
is a graveyard.

Sit with that middle one for a second. To change my router from PPPoE to DHCP - the most ordinary
operation in home networking - I needed **an Apple device**, which the loyal me never owned. Google shipped an Android-first product
whose Android app cannot perform a basic function of the hardware it ships with.

Every one of these is fixable. Most are fixable in a sprint. A single sentence in the PPPoE
troubleshooting doc would have saved me weeks. None of them were.

I've ended up on the Tapo ecosystem for everything since. I'm not going to pretend Tapo is beautifully
designed or that the apps are lovely. They aren't. But they **do the job**, every day, without ceremony
- and for an IoT device, doing the job is not a high bar. It's the whole bar. It's the minimum.
Google didn't clear it, for years, on hardware I got for free while users worldwide purchased with their salary, and still felt ripped off by.

So: no, I won't buy another Google Nest product. Not out of spite - I just can't justify the hours anymore.
I'm happy to test them if I get the lottery, but sorry, not out of pocket
and not when the team do not listen to the users.

If anyone on the Nest team ever reads this: the hardware was never the problem. The industrial design is
still the nicest thing in my house. You had users telling you exactly what was broken, in writing, with
repro steps, for years. That's the rarest thing a product team can get, and it was sitting in a queue
nobody read.

---

*If any of this saved you a factory reset, leave a comment - and if you've found a fix for the periodic
point degradation that isn't "run a cable", I'd genuinely love to hear it.*
