(function () {
  function defaultExport(module) {
    return module && module.__esModule ? module.default : module;
  }

  var providerIcons = {
    discord: 'fab fa-discord',
    facebook: 'fab fa-facebook-f',
    github: 'fab fa-github',
    gitlab: 'fab fa-gitlab',
    google: 'fab fa-google',
    linkedin: 'fab fa-linkedin-in',
  };

  function providerNameFromClass(className) {
    var match = className && className.match(/LogInButton--([A-Za-z0-9_-]+)/);
    return match ? match[1] : null;
  }

  function isLinkingButton(attrs) {
    return typeof attrs.path === 'string' && attrs.path.indexOf('linkTo=') !== -1;
  }

  var app = defaultExport(flarum.reg.get('core', 'forum/app'));
  var extension = flarum.reg.get('core', 'common/extend');
  var LogInButtons = defaultExport(flarum.reg.get('core', 'forum/components/LogInButtons'));
  var LogInButton = defaultExport(flarum.reg.get('core', 'forum/components/LogInButton'));

  app.initializers.add('fof/oauth-login-order', function () {
    extension.extend(LogInButton, 'initAttrs', function (_, attrs) {
      if (attrs.className && attrs.className.indexOf('FoFLogInButton') !== -1) {
        var providerName = providerNameFromClass(attrs.className);

        if (providerName && providerIcons[providerName]) {
          attrs.icon = providerIcons[providerName];
        }

        if (!isLinkingButton(attrs) && attrs.className.indexOf('Button--block') === -1) {
          attrs.className = attrs.className.replace('Button ', 'Button Button--block ');
        }
      }
    });

    extension.override('flarum/forum/components/LogInModal', 'body', function () {
      return [m('div', { className: 'Form Form--centered' }, this.fields().toArray()), m(LogInButtons)];
    });

    extension.override('flarum/forum/components/SignUpModal', 'body', function () {
      return [m('div', { className: 'Form Form--centered' }, this.fields().toArray()), !this.attrs.token && m(LogInButtons)];
    });
  });
})();
