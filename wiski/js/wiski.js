/**
* @file
* Log hovers, clicks en scrolls op Wiski.
*/

(function ($, Drupal, window, document, undefined) {

  Drupal.behaviors.wiski = {
    attach: function(context, settings)  {
      // CLICK
      // Log een click event in de database.
      function wiskiLogClick(element) {
        data =  {'action' : 'click', 'timestamp': Date.now(), 'element': element};
        $.post('wiski.module', data);
      }
      // Helpen: filter
      $('.page-helpen .form-select').click(function() {
        wiskiLogClick('Helpen: filter');
      });

      // Klassement: filter
      $('.page-klassement .quicktabs-tab').click(function() {
        filter = this.childNodes[0].nodeValue;
        id = $(this).parents('.quicktabs-wrapper').attr('id');
        patt = new RegExp("quicktabs-(.*)en");
        klassement = patt.exec(id)[1];
        element = 'Profiel: ' + klassement + ' ' + filter;
        wiskiLogClick(element);
      });

      // Profiel: verrassing.
      $('.page-user .view-verrassingen-afbeelding-gevonden').click(function() {
        wiskiLogClick('Profiel: verrassing');
      });

      // HOVER
      var timeEnter;

      // Log een hover event in de database.
      function wiskiLogHover(element) {
        var timeLeave = Date.now();
        var url = window.location.href;
        if (timeLeave - timeEnter >= 200) {
          data =  {'action' : 'hover', 'element': element, 'timeEnter': timeEnter, 'timeLeave': timeLeave, 'url': url};
          $.post('wiski.module', data);
        }
      }

      // Oefenen: day streak.
      $('.page-oefenen .pane-day-streak').mouseenter(function() {
        timeEnter = Date.now();
      });
      $('.page-oefenen .pane-day-streak').mouseleave(function() {
        wiskiLogHover('Oefenen: day streak');
      });

      // Oefenen: uitdagingen.
      $('.page-oefenen .pane-uitdagingen').mouseenter(function() {
        timeEnter = Date.now();
      });
      $('.page-oefenen .pane-uitdagingen').mouseleave(function() {
        wiskiLogHover('Oefenen: uitdagingen');
      });

      // Helpen: statistieken
      $('.page-helpen .pane-statistieken-voor-helpen .pane-views').mouseenter(function() {
        timeEnter = Date.now();
      });
      $('.page-helpen .pane-statistieken-voor-helpen .pane-views').mouseleave(function() {
        var title = $(this).hasClass('pane-duimen-omhoog') ? 'duimen omhoog' : 'anderen geholpen';
        var element = 'Helpen: statistieken ' + title;
        wiskiLogHover(element);
      });

      // Profiel: verrassing.
      $('.page-user .pane-verrassingen').mouseenter(function() {
        timeEnter = Date.now();
      });
      $('.page-user .pane-verrassingen').mouseleave(function() {
        wiskiLogHover('Profiel: verrassing');
      });

      // Profiel: oefeningen opgelost.
      $('.page-user .view-opgeloste-oefeningen').mouseenter(function() {
        timeEnter = Date.now();
      });
      $('.page-user .view-opgeloste-oefeningen').mouseleave(function() {
        wiskiLogHover('Profiel: oefeningen opgelost');
      });

      // Profiel: punten verdiend.
      $('.page-user .pane-punten-verdiend').mouseenter(function() {
        timeEnter = Date.now();
      });
      $('.page-user .pane-punten-verdiend').mouseleave(function() {
        wiskiLogHover('Profiel: punten verdiend');
      });

      // Profiel: punten info.
      $('.page-user .punten-info').mouseenter(function() {
        timeEnter = Date.now();
      });
      $('.page-user .punten-info').mouseleave(function() {
        wiskiLogHover('Profiel: punten info');
      });

      // Profiel: day streak.
      $('.page-user .view-day-streak').mouseenter(function() {
        timeEnter = Date.now();
      });
      $('.page-user .view-day-streak').mouseleave(function() {
        wiskiLogHover('Profiel: day streak')
      });

      // Profiel: instellingen.
      $('.page-user .pane-gamification-mechanics').mouseenter(function() {
        timeEnter = Date.now();
      });
      $('.page-user .pane-gamification-mechanics').mouseleave(function() {
        wiskiLogHover('Profiel instellingen');
      });

      // Instructies.
      $('.node.node-instructie').mouseenter(function() {
        timeEnter = Date.now();
      });
      $('.node.node-instructie').mouseleave(function() {
        var classList = $(this).attr('class').split(/\s+/);
        var patt = new RegExp("node-([0-9]+)");
        $.each(classList, function(index, item) {
          if (patt.exec(item)) {
            element = 'Instructie: ' + item;
            wiskiLogHover(element);
            return false;
          }
        });
      });

      // SCROLL
      // Sla scrollinfo elke 200ms op.
      $('.view-klassement').scroll(function() {
        clearTimeout($.data(this, 'scrollTimer'));
        var view = $(this);
        var wrapper = $(this).parents('.quicktabs-wrapper');
        var id = wrapper.attr('id');
        var patt = new RegExp("quicktabs-(.*)en");
        var klassement = patt.exec(id)[1];
        var filter = wrapper.find('.active .quicktabs-tab-view')[0].childNodes[0].nodeValue;
        element = 'Scroll: ' + klassement + ' ' + filter;

        $.data(this, 'scrollTimer', setTimeout(function() {
          // Current scroll
          var scroll = view.scrollTop();
          // Scroll of own row
          var active = view.find('.row-active-user');
          var ownScroll = -1;
          if (active.length) {
            ownScroll = active.position().top - view.position().top;
          }
          // Maximal possible scroll
          var maxScroll = view[0].scrollHeight;
          data =  {'action' : 'scroll', 'element': element, 'scroll': scroll, 'ownScroll': ownScroll, 'maxScroll': maxScroll, 'timestamp': Date.now()};
          $.post('wiski.module', data);
        }, 200));
      });
    }
  };

})(jQuery, Drupal, this, this.document);
