Hi Rawling, great work with this! I'm taking your idea as a starting point to make a small rankings app for my fencing club. I'd like to make you this question, which will help me a lot. Suppose the rugby rankings starts today. Suppose france wins 10-0 every match in the 6 nations, and at the same time lets say Panama wins 10-0 all of their matches in the Central America 6 nations (competing with TrinidadTobago, Jamaica, Haiti, Guatemala and Nicaragua). At the end of these competitions they would be tied in the world ranking? How does it get solved? Thanks a lot! you can reach me at duchoprog@gmail.com
# wr-calc
World Rugby rankings calculator

## Release notes

### 0.14

Many changes, but mostly

- make WRU option more visible for the RWC
- handle WR publishing rankings updates on matchdays better
- show rankings and potential changes per-fixture

### 0.13.1
- try to handle WR publishing rankings on match days

### 0.13
- Support nominally Away teams playing at home and gaining home advanage, as seen in Pacific Nations Cup 2019

### 0.12
- Support loading multiple pages of fixtures
- Better support when the last ranking date was a long time ago
- Fix scoping issue?

### 0.11
- Support WRU fixture-links by preserving `w` query parameter

### 0.10.0.1
- handle matches with no events

### 0.10
- Add indicator of live score status
- Show kickoffs in browser-local time rather than venue-local time

### 0.9.3
- Fix issue with NHA detection prematurely populating querystring
- Add kickoff and venue for loaded fixtures

### 0.9.2
- Pull live hotfixes from GitHub
- Support WRU with `w` query parameter
- Try to detect NHA from venue country

### 0.9.1
- Upgrade to latest version of Knockout.js
- Performance upgrades

### 0.9
- Share calculations by putting base date and fixture list into query string

### 0.8
- Use Jekyll (gh pages) to enable SASS
- Material redesign
- Responsive - top/bottom on screens that can't fit left/right

### 0.7.2
- Correct sorting of real-life fixtures

### 0.7
- Visual redesign
- Abbreviate longer team names to save space
- Version CSS/JS links to avoid caching older files

Includes re-instating scrolling panes, disclaimer footer, prettier tables, slightly better loading behaviour.

### 0.6
- Load matches between the latest rankings and the next (i.e. a week), including scores
- Use Knockout rather than manual DOM manipulation

Some behaviour has regressed (panes don't scroll separately; autocompletes are now just selects)
but Knockout simplifies the code and gives immediate feedback on changes.

### 0.5
- Detect RWC matches (thanks to [marcoas](https://github.com/rawling/wr-calc-stage/pull/1))
- Change team IDs from name to IDs from API

### 0.4
- Test new staging workflow
- Show separate loading messages for rankings and fixtures
- Use numeric inputs for scores
- Add ability to add rows above loaded fixtures

### 0.3

- Automatically populate with a week of upcoming fixtures (thanks to [marcoas](https://github.com/rawling/wr-calc/pull/2))
- Replace JSONP call for rankings with `$.get` prompted by the above

### 0.2

- Fix issue with columns misaligning after calculating
- Split out JS and CSS into separate files

### 0.1

- Import from http://irbrankingcalculator.azurewebsites.net/ and fix links to be protocol-relative
- Change IRB to World Rugby
