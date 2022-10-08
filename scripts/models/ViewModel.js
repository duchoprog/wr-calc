// Overall view model for the page
var ViewModel = function (isFemale) {
    this.isFemale = isFemale;

    // The base rankings in an object, indexed by the ID of the team.
    this.rankingsById = ko.observable();

    // The base rankings in an array, ordered by points.
    this.baseRankings = ko.observable();

    // The date of the base rankings.
    this.originalDate = ko.observable();
    this.originalMillis = -1;

    // The teams from the base rankings, used to populate the lookup.
    // We only need this separate from baseRankings if we want to sort differently.
    this.teams = ko.observableArray();

    // The fixtures used to calculate projected rankings.
    this.fixtures = ko.observableArray();

    // A rate-limited set of fixtures. This allows us to add fixtures performantly, by having the fixture list
    // bound to fixtures above but calculations based on this version.
    // As long as no-one ands and completes a fixture within the time below, this should not be noticeable.
    // (It also happens when we load in fixtures at startup, but that's a reasonable trade-off.)
    this.deferredFixtures = ko.computed(function () {
        return this.fixtures();
    }, this).extend({ rateLimit: 100 });

    // An indication of which set of rankings is displayed.
    // Options are null, 'original' or 'calculated'.
    this.rankingsChoice = ko.observable();

    // An indication of whether we have loaded fixtures from WR.
    // Not actually used yet, but could help show a loading screen.
    this.fixturesLoaded = ko.observable(false);

    // The rankings calcualted by taking the original rankings and applying
    // the fixtures.
    this.projectedRankings = ko.computed(function() {
        var rankingsById = this.rankingsById();
        var fixtures = this.deferredFixtures();

        // Nothing to calculate if the data has not yet loaded.
        if (!rankingsById || !fixtures) {
            return null;
        }

        // We work on the rankings as we go. Duplicate the base rankings
        // and set the "old" values to the "current" values so we can 
        // show changes at the end.
        var projectedRankings = {};
        $.each(rankingsById, function (k, v) {
            var cr = new RankingViewModel(v);
            cr.previousPos(cr.pos());
            cr.previousPts(cr.pts());
            projectedRankings[v.team.id] = cr;
        });

        // Apply each fixture in turn.
        $.each(fixtures, function (index, fixture) {
            // If the fixture doesn't have teams selected, or is already applied, do nothing.
            if (!fixture.hasValidTeams() || fixture.alreadyInRankings) {
                return;
            }

            // Supply the current rankings to the fixture so it can calculate potential change.
            var home = projectedRankings[fixture.homeId()];
            var away = projectedRankings[fixture.awayId()];

            fixture.homeRankingBefore(home.pts());
            fixture.awayRankingBefore(away.pts());

            // If the fixture doesn't have scores as well as teams, don't apply it to the rankings.
            if (!fixture.isValid()) {
                return;
            }

            var possibleHomeChanges = fixture.changes();
            var homeChange = possibleHomeChanges[fixture.activeChange()];

            // The rankings are zero-sum, so the away team loses what the home team gains.
            var awayChange = -homeChange;

            // Update the "current" values.
            home.pts(home.pts() + homeChange);
            away.pts(away.pts() + awayChange);
        });

        // Sort the rankings for display and update the "current" positions.
        var sorted = [];
        $.each(projectedRankings, function (i, r) {
            sorted.push(r);
        });
        sorted.sort(function (a, b) { return b.pts() - a.pts(); });
        $.each(sorted, function (i, r) {
            r.pos(i + 1);
        });

        return sorted;
    }, this);

    // Whichever set of rankings is chosen.
    this.shownRankings = ko.computed(function () {
        switch (this.rankingsChoice()) {
            case 'original':
                return this.baseRankings();
            case 'calculated':
                return this.projectedRankings();
            default:
                return [];
        }
    }, this);

    // A string representing the selected fixtures and results.
    this.fixturesString = ko.pureComputed({
        read: function () {
            return '2:' + $.map(this.fixtures(), function (e) {
                if (e.alreadyInRankings) return null;
                var vars = [];
                if (e.homeId()) vars[0] = e.homeId();
                if (e.awayId()) vars[1] = e.awayId();
                if (!isNaN(e.homeScore())) vars[2] = e.homeScore();
                if (!isNaN(e.awayScore())) vars[3] = e.awayScore();
                if (e.noHome()) vars[4] = '1';
                if (e.isRwc()) vars[5] = '1';
                if (e.switched()) vars[6] = '1';

                return vars.join(',');
            }).join(';');
        },
        write: function (value) {
            var versionAndString = value.split(':');
            switch (versionAndString[0]) {
                case '1':
                    var fs = [];
                    var r = this.rankingsById();
                    var me = this;
                    $.each(versionAndString[1].split(';'), function (i, e) {
                        var rs = e.split(',');
                        var fixture = new FixtureViewModel(me);
                        fixture.homeId(rs[0]);
                        fixture.awayId(rs[1]);
                        fixture.homeScore(rs[2]);
                        fixture.awayScore(rs[3]);
                        fixture.noHome(rs[4]);
                        fixture.isRwc(rs[5]);
                        fixture.switched(false);
                        fs.push(fixture);
                    });
                    this.fixtures(fs);
                    break;
                case '2':
                    var fs = [];
                    var r = this.rankingsById();
                    var me = this;
                    $.each(versionAndString[1].split(';'), function (i, e) {
                        var rs = e.split(',');
                        var fixture = new FixtureViewModel(me);
                        fixture.homeId(rs[0]);
                        fixture.awayId(rs[1]);
                        fixture.homeScore(rs[2]);
                        fixture.awayScore(rs[3]);
                        fixture.noHome(rs[4]);
                        fixture.isRwc(rs[5]);
                        fixture.switched(rs[6]);
                        fs.push(fixture);
                    });
                    this.fixtures(fs);
                    break;
                default:
                    this.fixtures([]);
                    break;
            }
        },
        owner: this
    });

    // A string representing the base date and selected fixtures, suitable for putting into the address bar.
    this.queryString = ko.computed(function () {
        return (this.isFemale ? 'w&' : '') + 'd=' + this.originalDate() + '&f=' + this.fixturesString();
    }, this);

    return this;
};