## Quick tips

* To add (or improve) a language, currency, theme, or wallet, go to the respective [languages](src/languages/), [currencies](src/currencies/), [themes](src/themes/), or [wallets](src/wallets/) folder.
* To download the latest version of the app, go to the [release](release/) folder.
* To build the app from a fresh repo:
  - Copy `closure-compiler-v20230802.jar` (or similar) into the `3rd-party` folder.
  - Go into `3rd-party` folder and execute this command (or similar):
    `java -jar closure-compiler-v20230802.jar --js gl-dumbfont.js --js_output_file gl-dumbfont.min.js`
  - Go back to repo root and run `make rel` (see Makefile comments for more info).
* Contact info and demo videos are down below.

# PoSSe - Point of Sale System Extraordinaire

A point-of-sale system for cash and Lightning, ideal for mom & pop
businesses, complete with product barcode scanning and other features.
Easily enhanced with new languages, themes, currencies, wallets, etc.
for any locale, and platform-independent to grow with the business
from smartphone to desktop or mini-computer to fill the gap between personal
wallets and big commercial PoS solutions.

## About the Project - From the Developer

This project is motivated by real-life circumstances. In many places
in the world, there are more small business vendors without PoS
(Point-of-Sale) systems than there are with them. The problem is that
although we have great Bitcoin/Lightning wallet apps, it is a hard
sell to get vendors to accept alternative payments on a personal
wallet when they don’t see immediate practical benefit outweighing the
inconvenience to their business operations.

First, these small vendors, who currently only deal in cash sales and
have scarcely a calculator and a scale to assist them in the checkout
process, need a PoS solution that makes their life easier today (and
which could advantageously preempt their adoption of credit-based PoS
systems tomorrow). The fact is, these operators unwittingly already
have a capable device in their pocket with a [working barcode scanner](https://www.youtube.com/watch?v=lJfWOVZkPZo),
computation capability, Internet connectivity, and more—all in their
smartphone, waiting to be utilized. And yet, existing wallets do not
adequately address their use case.

I believe there is great opportunity to improve their business
operations by developing a fantastic PoS app that will turn their
smartphone into a handy checkout register, and I have already begun
development on such an app and brought it to a functional level of
completion. It leverages JavaScript ES6 as its platform so that it can
run on any device, allowing businesses to keep using this same PoS app
as they grow from smartphone to mini-computer. My [11-minute video
demonstrating the desktop version of the app](https://www.youtube.com/watch?v=3WPWIPnS_KU) speaks about this.

My vision is for this product to serve as a benevolent “Trojan horse”
per say to orange pill business owners through various means such as
by providing charts and useful financial data to show them with their
own numbers how Bitcoin has (or could have) benefited them since
installing the app, as well as aid them in tax reporting, financial
management, and by giving practical financial education.

I believe life-improving apps will do wonders to incentivize Bitcoin
adoption. Besides enabling customers to pay with Lightning, my goal is
to provide a delightful checkout experience, for example by allowing
customers to receive their receipt direct-to-phone via animated QR
code (already implemented and I love it!). Besides being “green,” this
allows both vendor and customer to benefit from the fine-grained data
about their purchases while maintaining privacy. Additional features
include intrinsic multilingual support (implemented), multiple
independent accounts for separate businesses within a single app
instance (implemented), color and texture themes (implemented). As I
get ideas and feedback/experience, I pivot as needed. This was
exemplified by a redesign of the UI to a simpler format, as I
mentioned in my [15-minute introduction video](https://www.youtube.com/watch?v=BDu3N_zaUZQ).

For wallet operations, the app can be configured to use any
LNbits-compatible wallet for custodial or non-custodial operation.
With the [desktop version](https://www.youtube.com/watch?v=3WPWIPnS_KU) of the app, I intend to leverage LDK to
provide a third in-between option that will allow business owners to
self-custody the funds in a built-in Lightning node without the burden
of managing the channels. Some business owners have expressed that
they don’t accept Lightning for the sole reason that running a
business is too demanding to worry about managing a Lightning node
too. I am currently looking at LSPS specs and one other way of
outsourcing Lightning node management to meet this express need.

Funding would enable me to continue development on this project
without having to sacrifice it to alternative employment. As an active
Bitcoin proponent in my area, I am personally dedicated to this
project for the benefit of my own community, but I have designed it
with the flexibility to be configured and/or extended to serve any
locale. It is an app that is currently missing from the ecosystem as
far as I can tell, and I hope it will raise the bar for what apps
should do, provoke others to innovation, and hopefully speed Bitcoin
adoption not only in my area but everywhere.

Anyone is welcome to jump in and help out! But if you like what I'm
doing, I'd love to continue, but I can only do it with your financial
support. It doesn't take much! Watch [these 20 seconds](https://www.youtube.com/watch?v=3WPWIPnS_KU&t=633s) for details.

## Contact

Nostr: [npub1rjlw0khf7sj33kpmehmhvay9sz8zg877cyxmu6tnyglnyv37zc4sr4786s](nostr:npub1rjlw0khf7sj33kpmehmhvay9sz8zg877cyxmu6tnyglnyv37zc4sr4786s)

Watch for updates on YouTube [@myDevUpdates](https://www.youtube.com/channel/UCwiikbsKzH2_3HxCou2I54A) or jump to a topic:
- [Introduction and basic usage of calculator and emoji shortcuts](https://www.youtube.com/watch?v=BDu3N_zaUZQ) (15 minutes)
- [Demonstration of the barcode scanning feature](https://www.youtube.com/watch?v=lJfWOVZkPZo) (6 minutes)
- [How to accept Lightning payments from customers](https://www.youtube.com/watch?v=bGXnmi_6lNA) (6 minutes)
- [How to pay Lightning invoices with fiat currency](https://www.youtube.com/watch?v=MFxb75zWNtY) (8 minutes)
- [Possibilities for desktop builds like this demo under Windows](https://www.youtube.com/watch?v=3WPWIPnS_KU) (11 minutes)
- [Overview of GitHub repo](https://www.youtube.com/watch?v=mm39tArBqEo) (10 minutes)
