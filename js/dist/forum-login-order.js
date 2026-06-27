(function () {
  function defaultExport(module) {
    return module && module.__esModule ? module.default : module;
  }

  function regGet(namespace, name) {
    try {
      return flarum.reg && flarum.reg.get(namespace, name);
    } catch (error) {
      return null;
    }
  }

  function localExtend(target, method, callback) {
    var original = target && target[method];

    target[method] = function () {
      var result = original && original.apply(this, arguments);
      callback.apply(this, [result].concat(Array.prototype.slice.call(arguments)));
      return result;
    };
  }

  function localOverride(target, method, callback) {
    var original = target && target[method];

    target[method] = function () {
      return callback.apply(this, [original ? original.bind(this) : function () {}].concat(Array.prototype.slice.call(arguments)));
    };
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

  var app = defaultExport(regGet('core', 'forum/app'));
  var extension = regGet('core', 'common/extend') || {};
  var extend = extension.extend || localExtend;
  var override = extension.override || localOverride;
  var LogInButtons = defaultExport(regGet('core', 'forum/components/LogInButtons'));
  var LogInButton = defaultExport(regGet('core', 'forum/components/LogInButton'));
  var LogInModal = defaultExport(regGet('core', 'forum/components/LogInModal'));
  var SignUpModal = defaultExport(regGet('core', 'forum/components/SignUpModal'));

  if (!app || !LogInButtons || !LogInButton || !LogInModal || !SignUpModal) {
    return;
  }

  app.initializers.add('fof/oauth-login-order', function () {
    extend(LogInButton, 'initAttrs', function (_, attrs) {
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

    if (extension.override) {
      override('flarum/forum/components/LogInModal', 'body', function () {
        return [m('div', { className: 'Form Form--centered' }, this.fields().toArray()), m(LogInButtons)];
      });

      override('flarum/forum/components/SignUpModal', 'body', function () {
        return [m('div', { className: 'Form Form--centered' }, this.fields().toArray()), !this.attrs.token && m(LogInButtons)];
      });
    } else {
      override(LogInModal.prototype, 'body', function () {
        return [m('div', { className: 'Form Form--centered' }, this.fields().toArray()), m(LogInButtons)];
      });

      override(SignUpModal.prototype, 'body', function () {
        return [m('div', { className: 'Form Form--centered' }, this.fields().toArray()), !this.attrs.token && m(LogInButtons)];
      });
    }
  });
})();
